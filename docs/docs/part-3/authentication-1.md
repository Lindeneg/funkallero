---
sidebar_position: 2
description: Guarding routes part 1
---

# Authentication Part 1

In order to make use of these features, these interfaces must be implemented and registered [IAuthentication](https://github.com/Lindeneg/funkallero/blob/master/packages/funkallero-core/src/service/authentication-service.ts), [IAuthorization](https://github.com/Lindeneg/funkallero/blob/master/packages/funkallero-core/src/service/authorization-service.ts) and [ITokenService](https://github.com/Lindeneg/funkallero/blob/master/packages/funkallero-core/src/service/token-service.ts). These can be used either by being injected like any other service or via the `auth` decorator on route handlers.

There is an optional package available that offers an implementation using `jsonwebtoken` and `bcrypt`.

Add that package to the project.

`yarn add @lindeneg/funkallero-auth-service`

## Update Entities & DTOs

#### Update User Entity

Add `password` field to `User` entity

###### src/domain/user.ts

```ts
password: string;
```

Also add fields to `createUserSchema` & `ICreateUserResponse`

###### src/dtos/create-user.ts

```ts
createUserSchema = {
    ...,
    password: z.string().min(8).max(20),
};

ICreateUserResponse {
    ...,
    token: string;
}
```

Define new entity that describes encoded data

###### src/domain/auth-model.ts

```ts
class AuthModel {
    id: string;
    email: string;
}

export default AuthModel;
```

Create a new user login contract

###### src/dtos/login-user.ts

```ts
import { z } from 'zod';

export const loginUserSchema = z.object({
    email: z.string(),
    password: z.string(),
});

export interface ILoginUserDto extends z.infer<typeof loginUserSchema> {}

export interface ILoginUserResponse {
    token: string;
}
```

## Implement Authentication Service

###### src/services/authentication-service.ts

[Alternative Implementation](https://github.com/Lindeneg/funkallero/blob/master/example/src/services/authentication-service.ts)

```ts
import { BaseAuthenticationService } from '@lindeneg/funkallero-auth-service';
import type User from '@/domain/user';
import type AuthModel from '@/domain/auth-model';
import type DataContextService from '@/services/data-context-service';

class AuthenticationService extends BaseAuthenticationService<User, AuthModel, DataContextService> {
    protected getEncodedToken(): string | null {
        // bearer strategy is taken here, could also be cookies etc..
        const authHeader: string[] = this.request.headers.authorization?.split(' ') || [];
        if (authHeader.length === 2) {
            const token: string = authHeader[1];
            return token;
        }
        return null;
    }

    protected async getUserFromDecodedToken(decodedToken: AuthModel): Promise<User | null> {
        const user = this.dataContext.userRepository.get(decodedToken.id);

        if (user && user.email === decodedToken.email) return user;

        return null;
    }
}

export default AuthenticationService;
```

#### Implement Authorization Service

###### src/services/authorization-service.ts

[Alternative Implementation](https://github.com/Lindeneg/funkallero/blob/master/example/src/services/authorization-service.ts)

```ts
import { BaseAuthorizationService, type AuthorizationPolicyHandlerFn } from '@lindeneg/funkallero-auth-service';
import type AuthModel from '@/domain/auth-model';
import type AuthenticationService from './authentication-service';

type AuthHandler = AuthorizationPolicyHandlerFn<{ authService: AuthenticationService }, AuthModel>;

class AuthorizationService extends BaseAuthorizationService<AuthHandler> {
    protected async getCustomPolicyArgs() {
        return {
            authService: this.authService as AuthenticationService,
        };
    }
}

const authenticatedPolicy: AuthHandler = async ({ authService }) => {
    const user = await authService.getUserSafe();

    return user !== null;
};

const isMilesDavisPolicy: AuthHandler = async ({ authService }) => {
    const user = await authService.getUserSafe();

    return user !== null && user.name.toLowerCase() === 'miles davis';
};

AuthorizationService.addPolicy(['authenticated', authenticatedPolicy], ['name-is-miles-davis', isMilesDavisPolicy]);

export default AuthorizationService;
```

## Register Auth Services

###### src/index.ts

```ts
import { BaseTokenService } from '@lindeneg/funkallero-auth-service';
import AuthenticationService from '@/services/authentication-service';
import AuthorizationService from '@/services/authorization-service';

setup(service) {
    service.registerSingletonService(SERVICE.TOKEN, BaseTokenService);
    service.registerScopedService(SERVICE.AUTHENTICATION, AuthenticationService);
    service.registerScopedService(SERVICE.AUTHORIZATION, AuthorizationService);
}
```
