import type { IDomain, Promisify } from '../types';

interface IAuthenticationService<TUserModel extends IDomain = any, TDecodedToken = any> {
    getUser(): Promisify<TUserModel | null>;
    getUserId(): Promisify<string | null>;
    getDecodedToken(): Promisify<TDecodedToken | null>;
}

export default IAuthenticationService;
