import {
    META_DATA,
    SERVICE,
    type ILoggerService,
    type IControllerService,
    type Constructor,
    type Request,
    type Response,
    type MiddlewareScopedService,
    type MiddlewareSingletonService,
    type IScopedService,
    type MediatorResult,
    type MetaDataUnion,
} from '@lindeneg/funkallero-core';
import serviceContainer, { getScopedService, getSingletonService } from '../../container/service-container';
import ScopedDependencyInjection from '../../injection/scoped-dependency-injection';
import RequiredServiceMissingError from '../../errors/required-service-missing-error';

interface IMiddlewareContext {
    middleware: [string[], string[]];
    hasBeforeMiddleware: boolean;
    hasAfterMiddleware: boolean;
    hasMiddleware: boolean;
}

class RouteMiddlewareHandler {
    public static middlewareCache: Map<string, IMiddlewareContext> = new Map();

    private readonly logger: ILoggerService;

    private readonly services: Map<string, IScopedService>;
    private readonly request: Request;
    private readonly response: Response;
    private readonly beforeMiddleware: string[];
    private readonly afterMiddleware: string[];

    public hasBeforeMiddleware: boolean;
    public hasAfterMiddleware: boolean;
    public hasMiddleware: boolean;

    constructor(
        request: Request,
        response: Response,
        services: Map<string, IScopedService>,
        [before, after]: [string[], string[]]
    ) {
        this.logger = serviceContainer.getService(SERVICE.LOGGER);
        this.request = request;
        this.response = response;
        this.services = services;
        this.beforeMiddleware = before;
        this.afterMiddleware = after;
    }

    public async runBeforeMiddleware() {
        await Promise.all(
            this.beforeMiddleware.map((middlewareKey) => this.runMiddleware(middlewareKey, 'beforeRequestHandler'))
        );
    }

    public async runAfterMiddleware(result: MediatorResult) {
        let amendedResult = result;

        for (const middlewareKey of this.afterMiddleware) {
            amendedResult = await this.runMiddleware(middlewareKey, 'afterRequestHandler', amendedResult);
        }

        return amendedResult;
    }

    private async runMiddleware(
        middlewareServiceKey: string,
        method: 'afterRequestHandler' | 'beforeRequestHandler',
        result?: any
    ) {
        const singletonService = getSingletonService<MiddlewareSingletonService>(middlewareServiceKey);
        if (singletonService) {
            result = await singletonService[method](this.request, this.response, result);

            this.logger.verbose({
                msg: 'singleton middleware result',
                middlewareServiceKey,
                method,
                requestId: this.request.id,
                result,
            });

            return result;
        }

        let scopedService = this.services.get(middlewareServiceKey) as MiddlewareScopedService | undefined;

        if (!scopedService) {
            const Service = getScopedService<Constructor<MiddlewareScopedService>>(middlewareServiceKey);

            if (!Service) throw new RequiredServiceMissingError(middlewareServiceKey);

            scopedService = await new ScopedDependencyInjection(this.request, Service, this.services).inject();

            this.services.set(middlewareServiceKey, scopedService);
        }

        result = await scopedService[method](this.response, result);

        this.logger.verbose({
            msg: 'scoped middleware result',
            method,
            requestId: this.request.id,
            middlewareServiceKey,
            result,
        });

        return result;
    }

    public static getMiddleware(
        CustomController: Constructor<IControllerService>,
        handlerKey: string
    ): IMiddlewareContext {
        const key = CustomController.name + handlerKey;
        const cached = RouteMiddlewareHandler.middlewareCache.get(key);

        if (cached) return cached;

        const [[before, hasBeforeMiddleware], [after, hasAfterMiddleware]] = [
            this.getMiddlewareTuple(CustomController, handlerKey, META_DATA.MIDDLEWARE_BEFORE),
            this.getMiddlewareTuple(CustomController, handlerKey, META_DATA.MIDDLEWARE_AFTER),
        ];

        const result: IMiddlewareContext = {
            middleware: [before, after],
            hasBeforeMiddleware,
            hasAfterMiddleware,
            hasMiddleware: hasBeforeMiddleware || hasAfterMiddleware,
        };

        RouteMiddlewareHandler.middlewareCache.set(key, result);

        return result;
    }

    private static getMiddlewareTuple(
        CustomController: Constructor<IControllerService>,
        handlerKey: string,
        key: MetaDataUnion
    ): [string[], boolean] {
        const map = Reflect.get(CustomController.prototype, key) || {};

        const specificMiddleware = map[handlerKey] || [];
        const hasSpecificMiddleware = specificMiddleware.length > 0;

        return [specificMiddleware, hasSpecificMiddleware];
    }
}

export default RouteMiddlewareHandler;
