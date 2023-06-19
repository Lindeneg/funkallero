import ScopedService from './scoped-service';
import type { MediatorResult } from './mediator-service';
import type { Promisify, Response } from '../types';

abstract class MiddlewareScopedService extends ScopedService {
    beforeRequestHandler(response: Response): Promisify<void> {}
    afterRequestHandler(response: Response, result: MediatorResult<any>): Promisify<void> {}
}

export default MiddlewareScopedService;
