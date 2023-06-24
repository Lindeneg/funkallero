import {
    injectService,
    MiddlewareSingletonService,
    type ILoggerService,
    type Response,
    type Request,
} from '@lindeneg/funkallero';
import SERVICE from '../enums/service';

class Test1MiddlewareService extends MiddlewareSingletonService {
    @injectService(SERVICE.LOGGER)
    private readonly logger: ILoggerService;

    async beforeRequestHandler(request: Request, response: Response) {
        this.logger.info(`test-1-middleware running on request: ${request.id}`);
    }
}

export default Test1MiddlewareService;
