import SingletonService from './singleton-service';
import type { MediatorResult } from './mediator-service';
import type { Request, Response } from '../types';

export interface IMiddlewareSingletonService {
    beforeRequestHandler(request: Request, response: Response): Promise<void>;
    afterRequestHandler(
        request: Request,
        response: Response,
        result: MediatorResult<any>
    ): Promise<MediatorResult<any>>;
}

abstract class MiddlewareSingletonService extends SingletonService implements IMiddlewareSingletonService {
    public async beforeRequestHandler(request: Request, response: Response): Promise<void> {}
    public async afterRequestHandler(
        request: Request,
        response: Response,
        result: MediatorResult<any>
    ): Promise<MediatorResult<any>> {
        return result;
    }
}

export default MiddlewareSingletonService;
