import { controller, httpGet, injectService, MediatorResultSuccess } from '@lindeneg/funkallero';
import SERVICE from '../enums/service';
import Controller from './controller';
import type ExampleScopedService from '../services/example-scoped-service';

@controller('example-2')
class ExampleController2 extends Controller {
    @injectService(SERVICE.EXAMPLE_SCOPED_SERVICE)
    private readonly exampleScopedService: ExampleScopedService;

    @httpGet()
    public async example2() {
        this.exampleScopedService.doSomethingElse();
        return this.handleResult(new MediatorResultSuccess('look in the terminal'));
    }
}
