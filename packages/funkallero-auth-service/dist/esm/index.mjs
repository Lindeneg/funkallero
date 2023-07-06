import { injectService, SERVICE, ScopedService, HttpException, SingletonService } from '@lindeneg/funkallero-core';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

class BaseAuthenticationService extends ScopedService {
    tokenService;
    logger;
    dataContext;
    user = null;
    decodedToken = null;
    async setUser() {
        if (!this.decodedToken)
            await this.setDecodedToken();
        const user = await this.getUserFromDecodedToken(this.decodedToken);
        if (!user)
            throw HttpException.unauthorized();
        this.user = user;
        this.logger.verbose({
            msg: 'setting authenticated user',
            requestId: this.request.id,
            userId: this.user.id,
        });
    }
    async setDecodedToken() {
        let token = null;
        try {
            token = await this.getEncodedToken();
        }
        catch (err) {
            this.logger.error({ msg: 'getEncodedToken threw an error', err, requestId: this.request.id });
        }
        if (!token)
            throw HttpException.unauthorized();
        const decodedToken = await this.tokenService.verifyToken(token);
        if (!decodedToken)
            throw HttpException.unauthorized();
        this.decodedToken = decodedToken;
        this.logger.verbose({
            msg: 'setting decoded token',
            requestId: this.request.id,
            decodedToken,
        });
    }
    async getUser() {
        if (!this.user) {
            await this.setUser();
        }
        if (!this.user)
            throw HttpException.unauthorized();
        return this.user;
    }
    async getUserSafe() {
        try {
            const user = await this.getUser();
            return user;
        }
        catch (_) {
            // silent catch
        }
        return null;
    }
    async getUserId() {
        const user = await this.getUser();
        return user.id;
    }
    async getUserIdSafe() {
        const user = await this.getUserSafe();
        return user ? user.id : null;
    }
    async getDecodedToken() {
        if (!this.decodedToken) {
            await this.setDecodedToken();
        }
        if (!this.decodedToken)
            throw HttpException.unauthorized();
        return this.decodedToken;
    }
    async getDecodedTokenSafe() {
        try {
            const decodedToken = await this.getDecodedToken();
            return decodedToken;
        }
        catch (_) {
            // silent catch
        }
        return null;
    }
}
__decorate([
    injectService(SERVICE.TOKEN)
], BaseAuthenticationService.prototype, "tokenService", void 0);
__decorate([
    injectService(SERVICE.LOGGER)
], BaseAuthenticationService.prototype, "logger", void 0);
__decorate([
    injectService(SERVICE.DATA_CONTEXT)
], BaseAuthenticationService.prototype, "dataContext", void 0);

class BaseTokenConfiguration {
    static expiresIn = 7 * 24 * 60 * 60;
    static secret = 'super-duper-secret';
    static salt = 10;
}
class BaseTokenService extends SingletonService {
    logger;
    async createToken(payload) {
        return jwt.sign(payload, BaseTokenConfiguration.secret, {
            expiresIn: BaseTokenConfiguration.expiresIn,
        });
    }
    async verifyToken(token) {
        try {
            return jwt.verify(token, BaseTokenConfiguration.secret);
        }
        catch (err) {
            this.logger.error({
                msg: 'TokenServiceError: failed to verify token',
                err,
            });
        }
        return null;
    }
    async hashPassword(password) {
        return bcrypt.hash(password, BaseTokenConfiguration.salt);
    }
    async comparePassword(password, hash) {
        return bcrypt.compare(password, hash);
    }
}
__decorate([
    injectService(SERVICE.LOGGER)
], BaseTokenService.prototype, "logger", void 0);

class BaseAuthorizationService extends ScopedService {
    static policies = [];
    authService;
    tokenService;
    logger;
    static addPolicy(...policies) {
        policies.forEach(([name, handler]) => BaseAuthorizationService.policies.push({ name, handler }));
        return BaseAuthorizationService;
    }
    async isAuthorized(policyName) {
        const policy = BaseAuthorizationService.policies.find((p) => p.name === policyName);
        if (!policy) {
            this.logger.error({
                msg: `BaseAuthorizationServiceError: policy '${policyName}' not found`,
                requestId: this.request.id,
            });
            return false;
        }
        const decodedToken = await this.authService.getDecodedTokenSafe();
        if (!decodedToken)
            return false;
        const handlerArgs = await this.getCustomPolicyArgs();
        const authorized = await policy.handler({
            ...handlerArgs,
            decodedToken,
            request: this.request,
        });
        this.logger.verbose({
            msg: 'authorization policy result',
            requestId: this.request.id,
            policyName,
            authorized,
        });
        return authorized;
    }
}
__decorate([
    injectService(SERVICE.AUTHENTICATION)
], BaseAuthorizationService.prototype, "authService", void 0);
__decorate([
    injectService(SERVICE.TOKEN)
], BaseAuthorizationService.prototype, "tokenService", void 0);
__decorate([
    injectService(SERVICE.LOGGER)
], BaseAuthorizationService.prototype, "logger", void 0);

export { BaseAuthenticationService, BaseAuthorizationService, BaseTokenConfiguration, BaseTokenService };
