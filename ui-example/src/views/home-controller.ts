import { controller, view } from '@lindeneg/funkallero';
import BaseController from '@/api/base-controller';

@controller()
class HomeController extends BaseController {
    @view()
    public async index() {
        return this.mediator.send('GetIndexPage');
    }
}
