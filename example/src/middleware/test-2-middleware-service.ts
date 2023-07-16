import {
    injectService,
    MiddlewareScopedService,
    type ILoggerService,
    type Response,
    type MediatorResult,
} from '@lindeneg/funkallero';
import SERVICE from '@/enums/service';

class Test2MiddlewareService extends MiddlewareScopedService {
    @injectService(SERVICE.LOGGER)
    private readonly logger: ILoggerService;

    async beforeRequestHandler(response: Response) {
        // do something..
    }

    async afterRequestHandler(response: Response, result: MediatorResult) {
        // do something..
        return result;
    }
}

export default Test2MiddlewareService;
