import type { RouterOptions } from 'express';
import type { HttpMethodUnion } from '../enums/http-method';
import type IBaseService from './base-service';
import type { Response } from '../types';
import ScopedService from './scoped-service';

export type ControllerFn = (...args: any[]) => Promise<void>;

export interface IControllerSettings {
    authPolicy?: string | string[];
    options?: RouterOptions;
}

export interface IRoute {
    method: HttpMethodUnion;
    path: string;
    handlerKey: string;
    authorizationPolicy: string[];
    routerOptions: RouterOptions;
}

export interface IControllerService extends IBaseService {}

abstract class ControllerService extends ScopedService implements IControllerService {
    protected readonly response: Response;
}

export default ControllerService;
