import { injectService } from '@lindeneg/funkallero';
import { BaseAuthorizationService, type AuthorizationPolicyHandlerFn } from '@lindeneg/funkallero-auth-service';
import SERVICE from '../enums/service';
import { AUTH_POLICY } from '../enums/auth';
import type IAuthModel from '../domain/auth-model';
import type DataContextService from './data-context-service';

type AuthHandler = AuthorizationPolicyHandlerFn<{ dataContext: DataContextService }, IAuthModel>;

class AuthorizationService extends BaseAuthorizationService<AuthHandler> {
    @injectService(SERVICE.DATA_CONTEXT)
    private readonly dataContext: DataContextService;

    protected async getCustomPolicyArgs() {
        return {
            dataContext: this.dataContext,
        };
    }
}

const authenticatedPolicy: AuthHandler = async ({ decodedToken, dataContext }) => {
    const user = await dataContext.exec((p) =>
        p.author.findFirst({ where: { id: decodedToken.id, name: decodedToken.name } })
    );
    return user !== null;
};

const authorIsBookOwnerPolicy: AuthHandler = async ({ request, decodedToken, dataContext }) => {
    const book = await dataContext.exec((p) =>
        p.book.findFirst({ where: { id: request.params.id, authorId: decodedToken.id } })
    );

    return book !== null;
};

AuthorizationService.addPolicy(
    [AUTH_POLICY.AUTHENTICATED, authenticatedPolicy],
    [AUTH_POLICY.AUTHOR_IS_BOOK_OWNER, authorIsBookOwnerPolicy]
);

export default AuthorizationService;
