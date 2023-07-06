import { BaseAuthenticationService } from '@lindeneg/funkallero-auth-service';
import AUTH from '../../../example/src/enums/auth';
import type IAuthModel from '../../../example/src/domain/auth-model';
import type DataContextService from './data-context-service';
import type Author from '../domain/author';

class AuthenticationService extends BaseAuthenticationService<Author, IAuthModel, DataContextService> {
    protected getEncodedToken(): string | null {
        const encodedToken = this.request.cookies[AUTH.COOKIE_NAME];

        if (!encodedToken) return null;

        return encodedToken;
    }

    protected async getUserFromDecodedToken(decodedToken: IAuthModel): Promise<Author | null> {
        return this.dataContext.Author.get(decodedToken.id);
    }
}

export default AuthenticationService;
