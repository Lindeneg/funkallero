import ScopedService from './scoped-service';
import type { MediatorResult } from './mediator-service';
import type { Response } from '../types';

abstract class MiddlewareScopedService extends ScopedService {
    public async beforeRequestHandler(response: Response, result: any): Promise<any> {}
    public async afterRequestHandler(response: Response, result: MediatorResult<any>): Promise<MediatorResult<any>> {
        return result;
    }
}

export default MiddlewareScopedService;
