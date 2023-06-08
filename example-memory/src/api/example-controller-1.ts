import { controller, httpGet, injectService, MediatorResultSuccess } from '@lindeneg/funkallero';
import SERVICE from '../enums/service';
import Controller from './controller';
import type ExampleSingletonService from '../services/example-singleton-service';

@controller('example-1')
class ExampleController1 extends Controller {
    @injectService(SERVICE.EXAMPLE_SINGLETON_SERVICE)
    private readonly exampleSingletonService: ExampleSingletonService;

    @httpGet()
    public async example1() {
        this.exampleSingletonService.doSomething();
        return this.handleResult(new MediatorResultSuccess('look in the terminal'));
    }
}
