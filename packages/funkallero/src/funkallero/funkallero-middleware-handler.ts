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
import serviceContainer, { getScopedService, getSingletonService } from '../container/service-container';
import ScopedDependencyInjection from '../injection/scoped-dependency-injection';

class FunkalleroMiddlewareHandler {
    private readonly logger: ILoggerService;

    private readonly CustomController: Constructor<IControllerService>;
    private readonly handlerKey: string;
    private readonly services: Map<string, IScopedService>;
    private readonly request: Request;
    private readonly response: Response;

    constructor(
        CustomController: Constructor<IControllerService>,
        request: Request,
        response: Response,
        services: Map<string, IScopedService>,
        handlerKey: string
    ) {
        this.logger = serviceContainer.getService(SERVICE.LOGGER);
        this.CustomController = CustomController;
        this.request = request;
        this.response = response;
        this.services = services;
        this.handlerKey = handlerKey;
    }

    public async runBeforeMiddleware() {
        return this.runMiddleware(this.getMiddleware(META_DATA.MIDDLEWARE_BEFORE), 'beforeRequestHandler', undefined);
    }

    public runAfterMiddleware(result: MediatorResult) {
        return this.runMiddleware(this.getMiddleware(META_DATA.MIDDLEWARE_AFTER), 'afterRequestHandler', result);
    }

    private async runMiddleware(
        middlewareKeys: string[],
        key: 'afterRequestHandler' | 'beforeRequestHandler',
        result: any
    ) {
        for (const middlewareServiceKey of middlewareKeys) {
            const singletonService = getSingletonService<MiddlewareSingletonService>(middlewareServiceKey);
            if (singletonService) {
                result = await singletonService[key](this.request, this.response, result);

                this.logger.verbose({
                    msg: 'running singleton middleware',
                    key,
                    requestId: this.request.id,
                    middlewareServiceKey,
                    result,
                });

                continue;
            }

            let scopedService = this.services.get(middlewareServiceKey) as MiddlewareScopedService | undefined;

            if (!scopedService) {
                const Service = getScopedService(middlewareServiceKey) as Constructor<MiddlewareScopedService> | null;
                if (!Service) throw new Error('hello');

                scopedService = await new ScopedDependencyInjection(this.request, Service, this.services).inject();

                this.services.set(middlewareServiceKey, scopedService);
            }

            result = await scopedService[key](this.response, result);

            this.logger.verbose({
                msg: 'running scoped middleware',
                key,
                requestId: this.request.id,
                middlewareServiceKey,
                result,
            });
        }

        return result;
    }

    private getMiddleware(key: MetaDataUnion) {
        const middleware = Reflect.get(this.CustomController.prototype, key) || {};
        return middleware[this.handlerKey] || [];
    }
}

export default FunkalleroMiddlewareHandler;
