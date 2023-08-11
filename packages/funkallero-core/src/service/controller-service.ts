import type { RouterOptions } from 'express';
import type { HttpMethodUnion } from '../enums/http-method';
import type IBaseService from './base-service';
import type { MediatorResult } from './mediator-service';
import type { Response } from '../types';
import ScopedService from './scoped-service';

export type ControllerFn = (...args: any[]) => Promise<MediatorResult>;

export type ControllerSettings = {
    options?: RouterOptions;
    basePath?: string | false;
    html?: boolean;
    version?: string;
};

export interface IRoute {
    method: HttpMethodUnion;
    path: string;
    html?: boolean;
    handlerKey: string;
    version: string | null;
    basePath: string | null;
    routerOptions?: RouterOptions;
}

export interface IControllerService extends IBaseService {
    handleResult(result: MediatorResult<any>): Promise<void>;
}

abstract class ControllerService extends ScopedService implements IControllerService {
    protected readonly response: Response;

    public abstract handleResult(result: MediatorResult<any>): Promise<void>;
}

export default ControllerService;
