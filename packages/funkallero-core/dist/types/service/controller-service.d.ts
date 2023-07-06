import type { RouterOptions } from 'express';
import type { HttpMethodUnion } from '../enums/http-method';
import type IBaseService from './base-service';
import type { MediatorResult } from './mediator-service';
import type { Response } from '../types';
import ScopedService from './scoped-service';
export type ControllerFn = (...args: any[]) => Promise<MediatorResult>;
export type ControllerSettings = RouterOptions;
export interface IRoute {
    method: HttpMethodUnion;
    path: string;
    handlerKey: string;
    routerOptions?: RouterOptions;
}
export interface IControllerService extends IBaseService {
    handleResult(result: MediatorResult<any>): Promise<void>;
}
declare abstract class ControllerService extends ScopedService implements IControllerService {
    protected readonly response: Response;
    abstract handleResult(result: MediatorResult<any>): Promise<void>;
}
export default ControllerService;
