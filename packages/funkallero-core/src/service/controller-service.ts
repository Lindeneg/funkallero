import ScopedService from './scoped-service';
import type { HttpMethodUnion } from '../enums/http-method';
import type IBaseService from './base-service';
import type { Response } from '../types';

export type ControllerFn = (...args: any[]) => Promise<void>;

export interface IControllerSettings {
    authPolicy?: string | string[];
}

export interface IRoute {
    method: HttpMethodUnion;
    route: string;
    handlerKey: string;
    authorizationPolicy: string[];
}

export interface IControllerService extends IBaseService {
    baseRoute: string;
    routes: IRoute[];
}

abstract class ControllerService extends ScopedService implements IControllerService {
    public readonly baseRoute: string;
    public readonly routes: IRoute[];

    protected readonly response: Response;
}

export default ControllerService;
