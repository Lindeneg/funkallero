import SingletonService from './singleton-service';
import type { MediatorResult } from './mediator-service';
import type { Promisify, Request, Response } from '../types';

abstract class MiddlewareSingletonService extends SingletonService {
    beforeRequestHandler(request: Request, response: Response): Promisify<void> {}
    afterRequestHandler(request: Request, response: Response, result: MediatorResult<any>): Promisify<void> {}
}

export default MiddlewareSingletonService;
