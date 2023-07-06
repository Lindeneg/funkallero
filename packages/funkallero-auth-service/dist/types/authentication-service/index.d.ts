import { ScopedService, type ILoggerService, type IAuthenticationService, type ITokenService, type IDataContextService, type IDomain, type Promisify } from '@lindeneg/funkallero-core';
declare abstract class BaseAuthenticationService<TUserModel extends IDomain = any, // user entity as saved in data-context
TDecodedToken = any, // payload as saved in token
TDataContext extends IDataContextService = any> extends ScopedService implements IAuthenticationService<TUserModel, TDecodedToken> {
    protected readonly tokenService: ITokenService<TDecodedToken>;
    protected readonly logger: ILoggerService;
    protected readonly dataContext: TDataContext;
    private user;
    private decodedToken;
    protected abstract getEncodedToken(): Promisify<string | null>;
    protected abstract getUserFromDecodedToken(decodedToken: TDecodedToken): Promise<TUserModel | null>;
    private setUser;
    private setDecodedToken;
    getUser(): Promise<TUserModel>;
    getUserSafe(): Promise<TUserModel | null>;
    getUserId(): Promise<string>;
    getUserIdSafe(): Promise<string | null>;
    getDecodedToken(): Promise<NonNullable<TDecodedToken>>;
    getDecodedTokenSafe(): Promise<NonNullable<TDecodedToken> | null>;
}
export default BaseAuthenticationService;
