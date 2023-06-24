import {
    injectService,
    MiddlewareSingletonService,
    type IConfigurationService,
    type ILoggerService,
    Request,
    Response,
} from '@lindeneg/funkallero';
import SERVICE from '../enums/service';

class ExampleSingletonMiddlewareService extends MiddlewareSingletonService {
    @injectService(SERVICE.CONFIGURATION)
    private readonly config: IConfigurationService;

    @injectService(SERVICE.LOGGER)
    private readonly logger: ILoggerService;

    async beforeRequestHandler(request: Request, response: Response) {
        this.logger.verbose('Hello from a singleton middleware service!');

        this.logger.verbose('Do we have access to the configuration?');

        this.logger.verbose({
            msg: 'someApiKey: ' + this.config.meta.someApiKey,
        });
    }
}

export default ExampleSingletonMiddlewareService;
