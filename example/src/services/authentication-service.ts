import type { Author } from '@prisma/client';
import { BaseAuthenticationService } from '@lindeneg/funkallero-auth-service';
import AUTH from '@/enums/auth';
import type IAuthModel from '@/domain/auth-model';
import type DataContextService from './data-context-service';

class AuthenticationService extends BaseAuthenticationService<Author, IAuthModel, DataContextService> {
    protected getEncodedToken(): string | null {
        const encodedToken = this.request.cookies[AUTH.COOKIE_NAME];

        if (!encodedToken) return null;

        return encodedToken;
    }

    protected async getUserFromDecodedToken(decodedToken: IAuthModel): Promise<Author | null> {
        return this.dataContext.exec((p) =>
            p.author.findFirst({ where: { id: decodedToken.id, name: decodedToken.name } })
        );
    }
}

export default AuthenticationService;
