import type { IDomain, Promisify } from '../types';

interface IAuthenticationService<TUserModel extends IDomain = any, TDecodedToken = any> {
    getUser(): Promisify<TUserModel>;
    getUserSafe(): Promisify<TUserModel | null>;
    getUserId(): Promisify<string>;
    getUserIdSafe(): Promisify<string | null>;
    getDecodedToken(): Promisify<TDecodedToken>;
    getDecodedTokenSafe(): Promisify<TDecodedToken | null>;
}

export default IAuthenticationService;
