import { injectService, MiddlewareScopedService, type ILoggerService, Response } from '@lindeneg/funkallero';
import SERVICE from '../enums/service';

class ExampleScopedMiddlewareService extends MiddlewareScopedService {
    @injectService(SERVICE.LOGGER)
    private readonly logger: ILoggerService;

    async beforeRequestHandler(response: Response) {
        this.logger.verbose('Hello from a scoped service!');

        this.logger.verbose({
            msg: 'Do we have access to the request?',
            requestId: this.request.id,
        });
    }
}

export default ExampleScopedMiddlewareService;
