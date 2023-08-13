import Handlebars from 'handlebars';
import { BaseHandlebarTemplateService, createHandlebarTemplate } from '@lindeneg/funkallero';
import TEMPLATE_NAME from '@/enums/template-name';
import type IGetBookResponse from '@/dtos/get-book-response';

const TEMPLATES = {
    [TEMPLATE_NAME.HEAD]: createHandlebarTemplate({
        path: 'templates/partials/head.hbs',
        partial: true,
    }),
    [TEMPLATE_NAME.NAV]: createHandlebarTemplate({
        path: 'templates/partials/nav.hbs',
        partial: true,
    }),
    [TEMPLATE_NAME.HOME]: createHandlebarTemplate<{
        isLoggedIn: boolean;
        userId: string | null;
        books: IGetBookResponse[];
    }>({
        path: 'templates/pages/index.hbs',
    }),
    [TEMPLATE_NAME.CREATE]: createHandlebarTemplate({
        path: 'templates/pages/create.hbs',
    }),
    [TEMPLATE_NAME.LOGIN]: createHandlebarTemplate<{ mode: 'Login' | 'Signup' }>({
        path: 'templates/pages/login.hbs',
    }),
    [TEMPLATE_NAME.LOGOUT]: createHandlebarTemplate({
        path: 'templates/pages/logout.hbs',
    }),
} as const;

class TemplateService extends BaseHandlebarTemplateService<typeof TEMPLATES> {
    constructor() {
        super(Handlebars, TEMPLATES);
    }
}

export default TemplateService;
