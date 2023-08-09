import Handlebars from 'handlebars';
import { BaseHandlebarTemplateService, createHandlebarTemplate } from '@lindeneg/funkallero';
import TEMPLATE_NAME from '@/enums/template-name';

const TEMPLATES = {
    [TEMPLATE_NAME.HEAD]: createHandlebarTemplate<never>({
        path: 'templates/head.hbs',
        partial: true,
    }),
    [TEMPLATE_NAME.HOME]: createHandlebarTemplate<{ hello: string; there: number }>({
        path: 'templates/index.hbs',
    }),
} as const;

class TemplateService extends BaseHandlebarTemplateService<typeof TEMPLATES> {
    constructor() {
        super(Handlebars, TEMPLATES);
    }
}

export default TemplateService;
