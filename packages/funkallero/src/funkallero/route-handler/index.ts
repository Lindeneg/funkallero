import type { NextFunction } from 'express';
import { randomUUID } from 'crypto';
import {
    devLogger,
    META_DATA,
    SERVICE,
    HttpException,
    type IArgumentInjection,
    type IResponseHeaderInjection,
    type ILoggerService,
    type IConfigurationService,
    type IControllerService,
    type Constructor,
    type ControllerFn,
    type IRoute,
    type Request,
    type Response,
    type InjectableArgUnion,
    type IScopedService,
} from '@lindeneg/funkallero-core';
import serviceContainer from '../../container/service-container';
import ScopedDependencyInjection from '../../injection/scoped-dependency-injection';
import RouteMiddlewareHandler from './route-middleware-handler';
import RouteAuthHandler from './route-auth-handler';

class RouteHandler {
    private readonly logger: ILoggerService;
    private readonly config: IConfigurationService;
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
        this.config = serviceContainer.getService(SERVICE.CONFIGURATION);
        this.CustomController = CustomController;
        this.route = route;
        this.routePath = routePath;
        this.request = this.configureRequest(request);
        this.response = response;
        this.next = next;
    }

    public async handle() {
        const authInjection = RouteAuthHandler.getAuthorizationPolicyInjection(
            this.CustomController,
            this.route.handlerKey
        );
        const middlewareContext = RouteMiddlewareHandler.getMiddleware(this.CustomController, this.route.handlerKey);
        const hasAuthPolicies = authInjection.policies.length > 0;

        this.logger.info({
            msg: `${this.route.method.toUpperCase()} ${this.routePath || '/'}`,
            source: this.CustomController.name,
            requestId: this.request.id,
            hasAuthPolicies,
            hasMiddleware: middlewareContext.hasMiddleware,
        });

        const scopedServices = new Map<string, IScopedService>();

        const customController = await new ScopedDependencyInjection(
            this.request,
            this.CustomController,
            scopedServices,
            {
                hasAuthPolicies,
                response: this.response,
            }
        ).inject();

        await this.setResponseHeaders(customController);

        try {
            if (hasAuthPolicies) {
                const result = await new RouteAuthHandler(this.routePath).handle(
                    customController,
                    authInjection,
                    scopedServices
                );

                if (result instanceof HttpException) return this.next(result);
            }

            let middlewareHandler: RouteMiddlewareHandler | null = null;

            if (middlewareContext.hasMiddleware) {
                middlewareHandler = new RouteMiddlewareHandler(
                    this.request,
                    this.response,
                    scopedServices,
                    middlewareContext.middleware
                );
            }

            if (middlewareHandler && middlewareContext.hasBeforeMiddleware) {
                await middlewareHandler.runBeforeMiddleware();
            }

            const handlerArgs = await this.getHandlerArgs();

            if (handlerArgs instanceof HttpException) return this.next(handlerArgs);

            let mediatorResult = await (
                customController[<keyof typeof customController>this.route.handlerKey] as unknown as ControllerFn
            )(...handlerArgs);

            if (middlewareHandler && middlewareContext.hasAfterMiddleware) {
                mediatorResult = await middlewareHandler.runAfterMiddleware(mediatorResult);
            }

            const handlerResult = await customController.handleResult(mediatorResult);

            if (handlerResult instanceof HttpException) return this.next(handlerResult);
        } catch (err) {
            this.next(err);
        }
    }

    private async setResponseHeaders(customController: IControllerService) {
        const headers = await this.getResponseHeaders(customController);
        const headerEntries = Object.entries(headers);
        let hasContentTypeHtml = this.route.html || false;
        let didHtmlHeader = false;

        for (const [key, value] of headerEntries) {
            const evaluatedValue = await this.getResponseHeaderValue(value);

            devLogger('setting header', key, 'with value', evaluatedValue);

            this.response.setHeader(key, evaluatedValue);

            const htmlHeaderMatch = evaluatedValue.match(/^text\/html/);

            if (key === 'Content-Type' && htmlHeaderMatch && htmlHeaderMatch[1]) {
                didHtmlHeader = true;
                hasContentTypeHtml = true;
            }
        }

        if (hasContentTypeHtml) {
            if (!didHtmlHeader) {
                this.response.setHeader('Content-Type', 'text/html; charset=utf-8');
            }

            this.request._funkallero = {
                html: true,
            };
        }
    }

    private async getResponseHeaders(customController: IControllerService) {
        const controllerHeaders = Reflect.get(customController, META_DATA.RESPONSE_HEADERS) || {};
        const routeHeaders = (controllerHeaders[this.route.handlerKey] || {}) as IResponseHeaderInjection;
        const mergedHeaders = { ...routeHeaders };

        if (this.config.globalHeaders) {
            const globalHeaders = Object.entries(this.config.globalHeaders);
            for (const [key, value] of globalHeaders) {
                if (!mergedHeaders[key]) {
                    mergedHeaders[key] = value;
                }
            }
        }

        return mergedHeaders;
    }

    private async getResponseHeaderValue(header: IResponseHeaderInjection[string]) {
        if (typeof header === 'function') {
            return header(this.request);
        }
        return header;
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

        const entries = Object.entries(argumentInjections || {}).sort((a, b) => a[1].index - b[1].index);

        return entries as [InjectableArgUnion, IArgumentInjection][];
    }

    private async getHandlerArgs() {
        const argumentInjections = this.getArgumentInjections();
        let handlerArgs: unknown[] | HttpException = [];

        if (argumentInjections.length > 0) {
            handlerArgs = await this.getValidatedHandlerArgs(argumentInjections);
        }

        return handlerArgs;
    }

    private async getValidatedHandlerArgs(
        argumentInjections: [InjectableArgUnion, IArgumentInjection<any>][]
    ): Promise<unknown[] | HttpException> {
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

            return HttpException.malformedBody(null, errors);
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
}

export default RouteHandler;
