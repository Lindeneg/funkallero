import { injectService } from '@lindeneg/funkallero';
import { BaseAuthorizationService, type AuthorizationPolicyHandlerFn } from '@lindeneg/funkallero-auth-service';
import SERVICE from '@/enums/service';
import { AUTH_POLICY } from '@/enums/auth';
import type IAuthModel from '@/domain/auth-model';
import type DataContextService from './data-context-service';
import type AuthenticationService from './authentication-service';

type AuthHandler = AuthorizationPolicyHandlerFn<
    { dataContext: DataContextService; authService: AuthenticationService },
    IAuthModel
>;

class AuthorizationService extends BaseAuthorizationService<AuthHandler, AuthenticationService> {
    @injectService(SERVICE.DATA_CONTEXT)
    private readonly dataContext: DataContextService;

    protected async getCustomPolicyArgs() {
        return {
            dataContext: this.dataContext,
            authService: this.authService,
        };
    }
}

const authenticatedPolicy: AuthHandler = async ({ authService }) => {
    const user = await authService.getUser();

    return user !== null;
};

const authorIsBookOwnerPolicy: AuthHandler = async ({ request, authService, dataContext }) => {
    const user = await authService.getUser();

    if (!user) return false;

    const book = await dataContext.exec((p) =>
        p.book.findFirst({ where: { id: request.params.id, authorId: user.id } })
    );

    return book !== null;
};

AuthorizationService.addPolicy(
    [AUTH_POLICY.AUTHENTICATED, authenticatedPolicy],
    [AUTH_POLICY.AUTHOR_IS_BOOK_OWNER, authorIsBookOwnerPolicy]
);

export default AuthorizationService;
