import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {
    SERVICE,
    injectService,
    SingletonService,
    type ITokenService,
    type ILoggerService,
} from '@lindeneg/funkallero-core';

export class BaseTokenConfiguration {
    public static expiresIn = 7 * 24 * 60 * 60;
    public static secret = 'super-duper-secret';
    public static salt = 12;
}

class BaseTokenService<TAuthModel = any> extends SingletonService implements ITokenService<TAuthModel> {
    @injectService(SERVICE.LOGGER)
    private readonly logger: ILoggerService;

    public async createToken(payload: TAuthModel): Promise<string> {
        return jwt.sign(payload as Parameters<typeof jwt['sign']>[0], BaseTokenConfiguration.secret, {
            expiresIn: BaseTokenConfiguration.expiresIn,
        });
    }

    public async verifyToken(token: string): Promise<TAuthModel | null> {
        try {
            return jwt.verify(token, BaseTokenConfiguration.secret) as TAuthModel;
        } catch (err) {
            this.logger.error({
                msg: 'TokenServiceError: failed to verify token',
                err,
            });
        }
        return null;
    }

    public async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, BaseTokenConfiguration.salt);
    }

    public async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}

export default BaseTokenService;
