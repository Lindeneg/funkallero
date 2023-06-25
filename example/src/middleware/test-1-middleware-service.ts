import {
    injectService,
    MiddlewareSingletonService,
    type ILoggerService,
    type Response,
    type Request,
    type MediatorResult,
} from '@lindeneg/funkallero';
import SERVICE from '../enums/service';

class Test1MiddlewareService extends MiddlewareSingletonService {
    @injectService(SERVICE.LOGGER)
    private readonly logger: ILoggerService;

    async beforeRequestHandler(request: Request, response: Response) {
        // do something..
    }

    async afterRequestHandler(request: Request, response: Response, result: MediatorResult) {
        // do something..
        return result;
    }
}

export default Test1MiddlewareService;
