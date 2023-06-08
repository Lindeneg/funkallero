import { injectService, SingletonService, type IConfigurationService, type ILoggerService } from '@lindeneg/funkallero';
import SERVICE from '../enums/service';

class ExampleSingletonService extends SingletonService {
    @injectService(SERVICE.CONFIGURATION)
    private readonly config: IConfigurationService;

    @injectService(SERVICE.LOGGER)
    private readonly logger: ILoggerService;

    public doSomething() {
        this.logger.verbose({
            msg: 'Hello from a singleton service!',
            force: true,
        });

        this.logger.verbose({
            msg: 'Do we have access to the configuration?',
            force: true,
        });

        this.logger.verbose({
            msg: 'someApiKey: ' + this.config.meta.someApiKey,
            force: true,
        });
    }
}

export default ExampleSingletonService;
