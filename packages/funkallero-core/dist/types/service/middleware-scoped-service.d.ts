import ScopedService from './scoped-service';
import type { MediatorResult } from './mediator-service';
import type { Response } from '../types';
export interface IMiddlewareScopedService {
    beforeRequestHandler(response: Response): Promise<void>;
    afterRequestHandler(response: Response, result: MediatorResult<any>): Promise<MediatorResult<any>>;
}
declare abstract class MiddlewareScopedService extends ScopedService implements IMiddlewareScopedService {
    beforeRequestHandler(response: Response): Promise<void>;
    afterRequestHandler(response: Response, result: MediatorResult<any>): Promise<MediatorResult<any>>;
}
export default MiddlewareScopedService;
