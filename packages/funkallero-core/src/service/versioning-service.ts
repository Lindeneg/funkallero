import type HttpException from '../http-exception';
import type { Constructor, Promisify } from '../types';
import type { IControllerService, IRoute } from './controller-service';

export interface IVersioningContext {
    CustomController: Constructor<IControllerService>;
    route: IRoute;
}

export interface IVersioningPathContext {
    routePath: string;
    basePath: string;
    version?: string;
}

interface IVersioningService {
    getPathContext(
        route: IRoute,
        controllerPath: string,
        controllerVersion: string | null
    ): Promisify<IVersioningPathContext>;
    getContextFromHeaderVersioning(
        CustomController: Constructor<IControllerService>,
        customControllerPath: string,
        customControllerVersion: string | null,
        requestedVersion: string,
        route: IRoute,
        routes: IRoute[]
    ): Promisify<IVersioningContext | HttpException>;
}

export default IVersioningService;
