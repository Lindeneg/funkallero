import { ACTION_RESULT, MediatorResultSuccess, MediatorResultFailure, injectService } from '@lindeneg/funkallero';
import SERVICE from '@/enums/service';
import BaseAction from '@/application/base-action';
import type TemplateService from '@/services/template-service';

class GetIndexPage extends BaseAction {
    @injectService(SERVICE.TEMPLATE)
    private readonly templateService: TemplateService;

    public async execute() {
        const template = await this.templateService.render('HOME', {
            doesWhat: 'Something',
        });

        if (!template) return new MediatorResultFailure(ACTION_RESULT.ERROR_NOT_FOUND);

        return new MediatorResultSuccess(template);
    }
}

export default GetIndexPage;
