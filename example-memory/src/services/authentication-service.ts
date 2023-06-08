import { BaseAuthenticationService } from '@lindeneg/funkallero-auth-service';
import type Author from '../domain/author';
import type IAuthModel from '../domain/auth-model';
import type DataContextService from './data-context-service';

class AuthenticationService extends BaseAuthenticationService<Author, IAuthModel, DataContextService> {
    public getTokenFromRequest(): string | null {
        const authHeader: string[] = this.request.headers.authorization?.split(' ') || [];
        if (authHeader.length === 2) {
            const token: string = authHeader[1];
            return token;
        }
        return null;
    }

    protected async getUserFromDataContext(payload: IAuthModel): Promise<Author | null> {
        return this.dataContext.Author.get(payload.id);
    }
}

export default AuthenticationService;
