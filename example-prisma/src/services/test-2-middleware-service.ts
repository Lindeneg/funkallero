import { injectService, MiddlewareScopedService, type ILoggerService, type Response } from '@lindeneg/funkallero';
import SERVICE from '../enums/service';

class Test2MiddlewareService extends MiddlewareScopedService {
    @injectService(SERVICE.LOGGER)
    private readonly logger: ILoggerService;

    async beforeRequestHandler(response: Response, result: any) {
        this.logger.info({
            msg: 'test-2-middleware running',
            requestId: this.request.id,
            test1MiddlewareResult: result,
        });

        return result;
    }
}

export default Test2MiddlewareService;
