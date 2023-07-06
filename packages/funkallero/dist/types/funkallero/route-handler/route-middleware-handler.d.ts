import { type IControllerService, type Constructor, type Request, type Response, type IScopedService, type MediatorResult } from '@lindeneg/funkallero-core';
interface IMiddlewareContext {
    middleware: [string[], string[]];
    hasBeforeMiddleware: boolean;
    hasAfterMiddleware: boolean;
    hasMiddleware: boolean;
}
declare class RouteMiddlewareHandler {
    static middlewareCache: Map<string, IMiddlewareContext>;
    private readonly logger;
    private readonly services;
    private readonly request;
    private readonly response;
    private readonly beforeMiddleware;
    private readonly afterMiddleware;
    hasBeforeMiddleware: boolean;
    hasAfterMiddleware: boolean;
    hasMiddleware: boolean;
    constructor(request: Request, response: Response, services: Map<string, IScopedService>, [before, after]: [string[], string[]]);
    runBeforeMiddleware(): Promise<void>;
    runAfterMiddleware(result: MediatorResult): Promise<MediatorResult<any>>;
    private runMiddleware;
    static getMiddleware(CustomController: Constructor<IControllerService>, handlerKey: string): IMiddlewareContext;
    private static getMiddlewareTuple;
}
export default RouteMiddlewareHandler;
