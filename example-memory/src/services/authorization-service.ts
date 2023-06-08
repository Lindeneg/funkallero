import { injectService } from '@lindeneg/funkallero';
import { BaseAuthorizationService, type AuthorizationPolicyHandlerFn } from '@lindeneg/funkallero-auth-service';
import SERVICE from '../enums/service';
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
    const user = await dataContext.Author.get(decodedToken.id);
    return user !== null && user.name === decodedToken.name;
};

const authorIsBookOwnerPolicy: AuthHandler = async ({ request, decodedToken, dataContext }) => {
    const book = await dataContext.Book.get(request.params.id);

    if (book && book.authorId === decodedToken.id) return true;

    return false;
};

AuthorizationService.addPolicy(
    ['authenticated', authenticatedPolicy],
    ['author-is-book-owner', authorIsBookOwnerPolicy]
);

export default AuthorizationService;
