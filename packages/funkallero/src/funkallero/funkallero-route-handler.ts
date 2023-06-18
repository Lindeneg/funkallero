import type { NextFunction } from 'express';
import { randomUUID } from 'crypto';
import {
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
} from '@lindeneg/funkallero-core';
import serviceContainer from '../container/service-container';
import AuthServiceNotFoundError from '../errors/auth-service-not-found-error';
import ControllerDependencyInjection from '../injection/controller-dependency-injection';
import devLogger from '../dev-logger';

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
        const hasAuthPolicy = this.route.authorizationPolicy.length > 0;
        const argumentInjections = this.getArgumentInjections();

        this.logger.info({
            msg: `${this.route.method.toUpperCase()} ${this.routePath}`,
            source: this.CustomController.name,
            requestId: this.request.id,
            hasAuthPolicy,
        });

        const [customController, services] = await new ControllerDependencyInjection(
            this.request,
            this.response,
            this.CustomController,
            hasAuthPolicy
        ).inject();

        try {
            if (hasAuthPolicy) {
                await this.authorizePolicies(this.route.authorizationPolicy, this.routePath, services);
            }

            let handlerArgs: any[] = [];

            if (argumentInjections.length > 0) {
                handlerArgs = await this.getHandlerArgs(argumentInjections);
            }

            await (customController[<keyof typeof customController>this.route.handlerKey] as unknown as ControllerFn)(
                ...handlerArgs
            );
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
        const argumentInjections = (Reflect.get(this.CustomController.prototype, META_DATA.ARGUMENT_INJECTION)[
            this.route.handlerKey
        ] || {}) as Record<InjectableArgUnion, IArgumentInjection>;

        const entries = Object.entries(argumentInjections).sort((a, b) => a[1].index - b[1].index);

        return entries as [InjectableArgUnion, IArgumentInjection][];
    }

    private async getHandlerArgs(argumentInjections: [InjectableArgUnion, IArgumentInjection<any>][]) {
        const validationService = serviceContainer.getService(SERVICE.VALIDATION);
        const handlerArgs: unknown[] = [];
        const errors: Record<string, string>[] = [];

        for (const [key, value] of argumentInjections) {
            const target = this.getFilteredTarget(this.request[key], value.properties);

            devLogger(
                'argument injection target',
                this.route.handlerKey,
                'on request id',
                this.request.id,
                'has filtered target',
                target,
                'with schema',
                value.schema ? 'true' : 'false'
            );

            if (!value.schema) {
                handlerArgs.push(target);
                continue;
            }

            const result = await validationService.validate(target, value.schema);

            if (result.success) {
                handlerArgs.push(result.data);
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
