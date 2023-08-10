import { ACTION_RESULT, MediatorResultSuccess, MediatorResultFailure, injectService } from '@lindeneg/funkallero';
import Action from '../action';
import SERVICE from '@/enums/service';
import TEMPLATE_NAME from '@/enums/template-name';
import type TemplateService from '@/services/template-service';

abstract class BaseViewAction extends Action {
    @injectService(SERVICE.TEMPLATE)
    protected readonly templateService: TemplateService;
}

type IndexPageProps = {
    userId: string | null;
    query: Record<string, string>;
};

export class GetIndexPage extends BaseViewAction {
    public async execute({ userId, query }: IndexPageProps) {
        const books =
            (await this.dataContext.exec((p) =>
                p.book.findMany({
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        author: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                })
            )) || [];

        const template = await this.templateService.render(TEMPLATE_NAME.HOME, {
            books,
            isLoggedIn: userId !== null,
        });

        if (!template) return new MediatorResultFailure(ACTION_RESULT.ERROR_NOT_FOUND);

        return new MediatorResultSuccess(template);
    }
}

export class GetCreatePage extends BaseViewAction {
    public async execute() {
        const template = await this.templateService.render(TEMPLATE_NAME.CREATE);

        if (!template) return new MediatorResultFailure(ACTION_RESULT.ERROR_NOT_FOUND);

        return new MediatorResultSuccess(template);
    }
}

export class GetLoginPage extends BaseViewAction {
    public async execute() {
        const template = await this.templateService.render(TEMPLATE_NAME.LOGIN, { mode: 'Login' });

        if (!template) return new MediatorResultFailure(ACTION_RESULT.ERROR_NOT_FOUND);

        return new MediatorResultSuccess(template);
    }
}

export class GetSignupPage extends BaseViewAction {
    public async execute() {
        const template = await this.templateService.render(TEMPLATE_NAME.LOGIN, { mode: 'Signup' });

        if (!template) return new MediatorResultFailure(ACTION_RESULT.ERROR_NOT_FOUND);

        return new MediatorResultSuccess(template);
    }
}

export class GetLogoutPage extends BaseViewAction {
    public async execute() {
        const template = await this.templateService.render(TEMPLATE_NAME.LOGOUT);

        if (!template) return new MediatorResultFailure(ACTION_RESULT.ERROR_NOT_FOUND);

        return new MediatorResultSuccess(template);
    }
}
