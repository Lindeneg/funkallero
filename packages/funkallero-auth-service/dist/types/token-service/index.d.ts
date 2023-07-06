import { SingletonService, type ITokenService } from '@lindeneg/funkallero-core';
export declare class BaseTokenConfiguration {
    static expiresIn: number;
    static secret: string;
    static salt: number;
}
declare class BaseTokenService<TAuthModel = any> extends SingletonService implements ITokenService<TAuthModel> {
    private readonly logger;
    createToken(payload: TAuthModel): Promise<string>;
    verifyToken(token: string): Promise<TAuthModel | null>;
    hashPassword(password: string): Promise<string>;
    comparePassword(password: string, hash: string): Promise<boolean>;
}
export default BaseTokenService;
