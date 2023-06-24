import type { Author } from '@prisma/client';
import { BaseAuthenticationService } from '@lindeneg/funkallero-auth-service';
import AUTH from '../enums/auth';
import type IAuthModel from '../domain/auth-model';
import type DataContextService from './data-context-service';

class AuthenticationService extends BaseAuthenticationService<Author, IAuthModel, DataContextService> {
    public getTokenFromRequest(): string | null {
        const token = this.request.cookies[AUTH.COOKIE_NAME];

        if (!token) return null;

        return token;
    }

    protected async getUserFromDataContext(payload: IAuthModel): Promise<Author | null> {
        return this.dataContext.exec((p) => p.author.findUnique({ where: { id: payload.id } }));
    }
}

export default AuthenticationService;
