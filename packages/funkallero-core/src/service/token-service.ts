import type { Promisify } from '../types';

interface ITokenService<TAuthModel = any> {
    createToken(payload: TAuthModel): Promisify<string>;
    verifyToken(token: string): Promisify<TAuthModel | null>;
    hashPassword(password: string): Promisify<string>;
    comparePassword(password: string, hash: string): Promisify<boolean>;
}

export default ITokenService;
