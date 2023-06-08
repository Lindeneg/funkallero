import { injectService, ScopedService, type ILoggerService } from '@lindeneg/funkallero';
import SERVICE from '../enums/service';
import type ExampleSingletonService from './example-singleton-service';

class ExampleScopedService extends ScopedService {
    @injectService(SERVICE.EXAMPLE_SINGLETON_SERVICE)
    private readonly someService: ExampleSingletonService;

    @injectService(SERVICE.LOGGER)
    private readonly logger: ILoggerService;

    public async doSomethingElse() {
        this.logger.verbose({
            msg: 'Hello from a scoped service!',
            force: true,
        });

        this.logger.verbose({
            msg: 'Do we have access to the request?',
            force: true,
        });

        this.logger.verbose({
            msg: 'Request ID: ' + this.request.id,
            force: true,
        });

        this.logger.verbose({
            msg: 'Do we have access to ExampleSingletonService?',
            force: true,
        });

        this.someService.doSomething();
    }
}

export default ExampleScopedService;
