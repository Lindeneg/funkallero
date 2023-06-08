import {
    SERVICE,
    injectService,
    ScopedService,
    HttpException,
    type Request,
    type ILoggerService,
    type IAuthenticationService,
    type ITokenService,
    type IDataContextService,
    type IDomain,
} from '@lindeneg/funkallero-core';

abstract class BaseAuthenticationService<
        TUserModel extends IDomain = any, // user entity as saved in data-context
        TDecodedToken = any, // payload as saved in token
        TDataContext extends IDataContextService = any // data-context service
    >
    extends ScopedService
    implements IAuthenticationService<TUserModel, TDecodedToken>
{
    @injectService(SERVICE.TOKEN)
    protected readonly tokenService: ITokenService<TDecodedToken>;

    @injectService(SERVICE.LOGGER)
    protected readonly logger: ILoggerService;

    @injectService(SERVICE.DATA_CONTEXT)
    protected readonly dataContext: TDataContext;

    private user: TUserModel | null = null;
    private decodedToken: TDecodedToken | null = null;

    protected abstract getUserFromDataContext(decodedToken: TDecodedToken): Promise<TUserModel | null>;

    public abstract getTokenFromRequest(
        request: Request
    ): ReturnType<IAuthenticationService<any>['getTokenFromRequest']>;

    private async setUser() {
        if (!this.decodedToken) await this.setDecodedToken();

        const user = await this.getUserFromDataContext(this.decodedToken as TDecodedToken);
        if (!user) throw HttpException.unauthorized();

        this.user = user;

        this.logger.verbose({
            msg: 'setting authenticated user',
            requestId: this.request.id,
            userId: this.user.id,
        });
    }

    private async setDecodedToken() {
        let token: string | null = null;

        try {
            token = await this.getTokenFromRequest(this.request);
        } catch (err) {
            this.logger.error({ msg: 'getTokenFromRequest threw an error', err, requestId: this.request.id });
        }

        if (!token) throw HttpException.unauthorized();

        const decodedToken = await this.tokenService.verifyToken(token);
        if (!decodedToken) throw HttpException.unauthorized();

        this.decodedToken = decodedToken;

        this.logger.verbose({
            msg: 'setting decoded token',
            requestId: this.request.id,
            decodedToken,
        });
    }

    public async getUser() {
        if (!this.user) {
            await this.setUser();
        }

        if (!this.user) throw HttpException.unauthorized();

        return this.user;
    }

    public async getUserSafe() {
        try {
            const user = await this.getUser();
            return user;
        } catch (_) {
            // silent catch
        }

        return null;
    }

    public async getUserId() {
        const user = await this.getUser();

        return user.id;
    }

    public async getUserIdSafe() {
        const user = await this.getUserSafe();

        return user ? user.id : null;
    }

    public async getDecodedToken() {
        if (!this.decodedToken) {
            await this.setDecodedToken();
        }

        if (!this.decodedToken) throw HttpException.unauthorized();

        return this.decodedToken;
    }

    public async getDecodedTokenSafe() {
        try {
            const decodedToken = await this.getDecodedToken();
            return decodedToken;
        } catch (_) {
            // silent catch
        }

        return null;
    }
}

export default BaseAuthenticationService;
