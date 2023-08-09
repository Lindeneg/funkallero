import { MediatorResultSuccess, injectService, controller, view } from '@lindeneg/funkallero';
import SERVICE from '@/enums/service';
import Controller from '@/api/controller';
import type TemplateService from '@/services/template-service';

@controller()
class HomeController extends Controller {
    @injectService(SERVICE.TEMPLATE)
    protected readonly templateService: TemplateService;

    @view()
    public async index() {
        return new MediatorResultSuccess(await this.templateService.render('home', { hello: 'world', there: 1 }));
    }
}
