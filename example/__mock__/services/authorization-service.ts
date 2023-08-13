import { injectService } from '@lindeneg/funkallero';
import { BaseAuthorizationService, type AuthorizationPolicyHandlerFn } from '@lindeneg/funkallero-auth-service';
import SERVICE from '@/enums/service';
import { AUTH_POLICY } from '@/enums/auth';
import type IAuthModel from '@/domain/auth-model';
import type DataContextService from './data-context-service';
import type AuthenticationService from './authentication-service';

type AuthHandler = AuthorizationPolicyHandlerFn<{ dataContext: DataContextService }, IAuthModel>;

class AuthorizationService extends BaseAuthorizationService<AuthHandler, AuthenticationService> {
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

    return book !== null && book.authorId === decodedToken.id;
};

AuthorizationService.addPolicy(
    [AUTH_POLICY.AUTHENTICATED, authenticatedPolicy],
    [AUTH_POLICY.AUTHOR_IS_BOOK_OWNER, authorIsBookOwnerPolicy]
);

export default AuthorizationService;
