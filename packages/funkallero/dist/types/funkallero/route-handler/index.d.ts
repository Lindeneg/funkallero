import type { NextFunction } from 'express';
import { type IControllerService, type Constructor, type IRoute, type Request, type Response } from '@lindeneg/funkallero-core';
declare class RouteHandler {
    private readonly logger;
    private readonly CustomController;
    private readonly route;
    private readonly routePath;
    private readonly request;
    private readonly response;
    private readonly next;
    constructor(CustomController: Constructor<IControllerService>, route: IRoute, routePath: string, request: Request, response: Response, next: NextFunction);
    handle(): Promise<void>;
    private getFilteredTarget;
    private getArgumentInjections;
    private getHandlerArgs;
    private getValidatedHandlerArgs;
    private configureRequest;
}
export default RouteHandler;
