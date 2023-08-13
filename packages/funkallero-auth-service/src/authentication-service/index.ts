import {
    SERVICE,
    injectService,
    ScopedService,
    type ILoggerService,
    type IAuthenticationService,
    type ITokenService,
    type IDataContextService,
    type IDomain,
    type Promisify,
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

    protected abstract getEncodedToken(): Promisify<string | null>;
    protected abstract getUserFromDecodedToken(decodedToken: TDecodedToken): Promise<TUserModel | null>;

    public async getUser() {
        if (!this.user) {
            await this.setUser();
        }

        return this.user;
    }

    public async getUserId() {
        const user = await this.getUser();

        if (!user) return null;

        return user.id;
    }

    public async getDecodedToken() {
        if (!this.decodedToken) {
            await this.setDecodedToken();
        }

        return this.decodedToken;
    }

    private async setUser() {
        if (!this.decodedToken) await this.setDecodedToken();

        const user = await this.getUserFromDecodedToken(this.decodedToken as TDecodedToken);

        if (!user) return;

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
            token = await this.getEncodedToken();
        } catch (err) {
            this.logger.error({ msg: 'getEncodedToken threw an error', err, requestId: this.request.id });
        }

        if (!token) return;

        const decodedToken = await this.tokenService.verifyToken(token);

        if (!decodedToken) return;

        this.decodedToken = decodedToken;

        this.logger.verbose({
            msg: 'setting decoded token',
            requestId: this.request.id,
            decodedToken,
        });
    }
}

export default BaseAuthenticationService;
