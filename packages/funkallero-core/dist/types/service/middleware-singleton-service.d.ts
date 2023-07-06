import SingletonService from './singleton-service';
import type { MediatorResult } from './mediator-service';
import type { Request, Response } from '../types';
export interface IMiddlewareSingletonService {
    beforeRequestHandler(request: Request, response: Response): Promise<void>;
    afterRequestHandler(request: Request, response: Response, result: MediatorResult<any>): Promise<MediatorResult<any>>;
}
declare abstract class MiddlewareSingletonService extends SingletonService implements IMiddlewareSingletonService {
    beforeRequestHandler(request: Request, response: Response): Promise<void>;
    afterRequestHandler(request: Request, response: Response, result: MediatorResult<any>): Promise<MediatorResult<any>>;
}
export default MiddlewareSingletonService;
