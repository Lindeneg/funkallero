import SingletonService from './singleton-service';
import type { MediatorResult } from './mediator-service';
import type { Request, Response } from '../types';

abstract class MiddlewareSingletonService extends SingletonService {
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
