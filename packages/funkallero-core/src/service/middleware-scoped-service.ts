import ScopedService from './scoped-service';
import type { MediatorResult } from './mediator-service';
import type { Response } from '../types';

export interface IMiddlewareScopedService {
    beforeRequestHandler(response: Response): Promise<void>;
    afterRequestHandler(response: Response, result: MediatorResult<any>): Promise<MediatorResult<any>>;
}

abstract class MiddlewareScopedService extends ScopedService implements IMiddlewareScopedService {
    public async beforeRequestHandler(response: Response): Promise<void> {}
    public async afterRequestHandler(response: Response, result: MediatorResult<any>): Promise<MediatorResult<any>> {
        return result;
    }
}

export default MiddlewareScopedService;
