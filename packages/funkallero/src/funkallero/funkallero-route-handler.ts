import type { NextFunction } from 'express';
import { randomUUID } from 'crypto';
import {
    devLogger,
    META_DATA,
    SERVICE,
    HttpException,
    type IArgumentInjection,
    type ILoggerService,
    type IControllerService,
    type IAuthorizationService,
    type Constructor,
    type ControllerFn,
    type IRoute,
    type Request,
    type Response,
    type InjectableArgUnion,
    type IScopedService,
} from '@lindeneg/funkallero-core';
import serviceContainer from '../container/service-container';
import AuthServiceNotFoundError from '../errors/auth-service-not-found-error';
import ScopedDependencyInjection from '../injection/scoped-dependency-injection';
import FunkalleroMiddlewareHandler from './funkallero-middleware-handler';

class FunkalleroRouteHandler {
    private readonly logger: ILoggerService;
    private readonly CustomController: Constructor<IControllerService>;
    private readonly route: IRoute;
    private readonly routePath: string;
    private readonly request: Request;
    private readonly response: Response;
    private readonly next: NextFunction;

    constructor(
        CustomController: Constructor<IControllerService>,
        route: IRoute,
        routePath: string,
        request: Request,
        response: Response,
        next: NextFunction
    ) {
        this.logger = serviceContainer.getService(SERVICE.LOGGER);
        this.CustomController = CustomController;
        this.route = route;
        this.routePath = routePath;
        this.request = this.configureRequest(request);
        this.response = response;
        this.next = next;
    }

    public async handle() {
        const hasAuthorizationPolicy = this.route.authorizationPolicy.length > 0;

        this.logger.info({
            msg: `${this.route.method.toUpperCase()} ${this.routePath}`,
            source: this.CustomController.name,
            requestId: this.request.id,
            hasAuthorizationPolicy,
        });

        const services = new Map<string, IScopedService>();

        const customController = await new ScopedDependencyInjection(this.request, this.CustomController, services, {
            hasAuthorizationPolicy,
            response: this.response,
        }).inject();

        try {
            if (hasAuthorizationPolicy) {
                await this.authorizePolicies(this.route.authorizationPolicy, this.routePath, services);
            }

            const middlewareHandler = new FunkalleroMiddlewareHandler(
                this.CustomController,
                this.request,
                this.response,
                services,
                this.route.handlerKey
            );

            await middlewareHandler.runBeforeMiddleware();

            let handlerArgs: unknown[] = [];

            const argumentInjections = this.getArgumentInjections();
            if (argumentInjections.length > 0) {
                handlerArgs = await this.getHandlerArgs(argumentInjections);
            }

            const result = await (
                customController[<keyof typeof customController>this.route.handlerKey] as unknown as ControllerFn
            )(...handlerArgs);

            const amendedResult = await middlewareHandler.runAfterMiddleware(result);

            await customController.handleResult(amendedResult);
        } catch (err) {
            this.next(err);
        }
    }

    private getFilteredTarget<TTarget extends Record<string, any>>(target: TTarget, properties: string[]) {
        if (properties.length === 0) return target;
        if (properties.length === 1) return target[properties[0]];
        return properties.reduce((acc, cur) => {
            const value = target[cur];
            if (value) {
                acc[<keyof typeof acc>cur] = value;
            }
            return acc;
        }, {} as TTarget);
    }

    private getArgumentInjections() {
        const metaInjections = Reflect.get(this.CustomController.prototype, META_DATA.ARGUMENT_INJECTION);
        const argumentInjections = (metaInjections ? metaInjections[this.route.handlerKey] : {}) as Record<
            InjectableArgUnion,
            IArgumentInjection
        >;

        const entries = Object.entries(argumentInjections).sort((a, b) => a[1].index - b[1].index);

        return entries as [InjectableArgUnion, IArgumentInjection][];
    }

    private async getHandlerArgs(argumentInjections: [InjectableArgUnion, IArgumentInjection<any>][]) {
        const validationService = serviceContainer.getService(SERVICE.SCHEMA_PARSER);
        const handlerArgs: unknown[] = [];
        const errors: Record<string, string>[] = [];

        for (const [key, opts] of argumentInjections) {
            const target = this.getFilteredTarget(this.request[key], opts.properties);

            devLogger(
                'argument injection target',
                this.route.handlerKey,
                'on request id',
                this.request.id,
                'has filtered target',
                target,
                'with schema:',
                !!opts.schema
            );

            if (!opts.schema) {
                handlerArgs.push(opts.transform ? opts.transform(target) : target);
                continue;
            }

            const result = await validationService.parse(target, opts.schema);

            if (result.success) {
                handlerArgs.push(opts.transform ? opts.transform(result.data) : result.data);
            } else {
                errors.push(result.error);
            }
        }

        if (errors.length) {
            this.logger.verbose({
                msg: 'request validation failed',
                requestId: this.request.id,
                errors,
            });
            throw HttpException.malformedBody(null, errors);
        }

        this.logger.verbose({
            msg: 'request validation succeeded',
            requestId: this.request.id,
            handlerArgs,
        });

        return handlerArgs;
    }

    private configureRequest(request: Request) {
        request.id = randomUUID();
        return request as Request;
    }

    private async authorizePolicies(authorizationPolicies: string[], routePath: string, services: Map<any, any>) {
        const authorizationService = services.get(SERVICE.AUTHORIZATION) as IAuthorizationService;

        if (!authorizationService) {
            devLogger('authorization service not found but is used on route', routePath);
            throw new AuthServiceNotFoundError(authorizationPolicies.join(','), routePath);
        }

        for (const policy of authorizationPolicies) {
            await this.authorizePolicy(authorizationService, policy);
        }
    }

    private async authorizePolicy(service: IAuthorizationService, authorizationPolicy: string) {
        const isAuthorized = await service.isAuthorized(authorizationPolicy);

        if (!isAuthorized) {
            throw HttpException.unauthorized();
        }
    }
}

export default FunkalleroRouteHandler;
