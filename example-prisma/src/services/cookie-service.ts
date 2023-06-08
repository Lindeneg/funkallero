import {
    ACTION_RESULT,
    ScopedService,
    MediatorResultSuccess,
    injectService,
    type IConfigurationService,
    type ITokenService,
    type Response,
    type MediatorResult,
} from '@lindeneg/funkallero';
import { BaseTokenConfiguration } from '@lindeneg/funkallero-auth-service';
import SERVICE from '../enums/service';
import AUTH from '../enums/auth';
import type IAuthModel from '../domain/auth-model';

class CookieService extends ScopedService {
    @injectService(SERVICE.TOKEN)
    private readonly tokenService: ITokenService;

    @injectService(SERVICE.CONFIGURATION)
    private readonly config: IConfigurationService;

    public async handleResponse(response: Response, result: MediatorResult<IAuthModel>) {
        if (result.success) {
            await this.setAuthCookieOnResponse(response, result.value);
            return new MediatorResultSuccess(ACTION_RESULT.UNIT, ACTION_RESULT.SUCCESS_OK);
        }

        return result;
    }

    private async setAuthCookieOnResponse(response: Response, payload: IAuthModel): Promise<void> {
        const token = await this.tokenService.createToken(payload);
        response.setHeader('Set-Cookie', this.createCookieString(token));
    }

    private createCookieString(token: string) {
        const cookieExpire = new Date(Date.now() + BaseTokenConfiguration.expiresIn);

        const secure = this.config.https !== null ? 'Secure=true;' : '';

        return `${AUTH.COOKIE_NAME}=${token}; Max-Age=${
            BaseTokenConfiguration.expiresIn / 1000
        }; Path=/; Expires=${cookieExpire}; SameSite=Strict; ${secure} HttpOnly=true;`;
    }
}

export default CookieService;
