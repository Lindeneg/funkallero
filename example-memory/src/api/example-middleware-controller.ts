import { before, controller, httpGet, MediatorResultSuccess } from '@lindeneg/funkallero';
import SERVICE from '../enums/service';
import Controller from './controller';

@controller('example-middleware')
class ExampleMiddlewareController extends Controller {
    @httpGet()
    // before can be used to run middleware before handler has run
    @before(SERVICE.EXAMPLE_SINGLETON_MIDDLEWARE, SERVICE.EXAMPLE_SCOPED_MIDDLEWARE)
    // after can be used to run middleware after handler has run and is given the mediator result
    //@after(...serviceKeys)
    public async example() {
        return new MediatorResultSuccess('look in the terminal');
    }
}
