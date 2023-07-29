---
sidebar_position: 1
description: Setup authentication & authorization
---

# Guarding Routes

In order to make use of auth services, these interfaces must be implemented and registered [IAuthentication](https://github.com/Lindeneg/funkallero/blob/master/packages/funkallero-core/src/service/authentication-service.ts), [IAuthorization](https://github.com/Lindeneg/funkallero/blob/master/packages/funkallero-core/src/service/authorization-service.ts) and [ITokenService](https://github.com/Lindeneg/funkallero/blob/master/packages/funkallero-core/src/service/token-service.ts). These can be used either by being injected like any other service or via the `auth` decorator on route handlers.

There is an optional package available that offers an implementation using `jsonwebtoken` and `bcrypt`.

Add that package to the project.

`yarn add @lindeneg/funkallero-auth-service`

## Update Entities & DTOs

#### Update User Entity

Add password field to user entity.

###### src/domain/user.ts

```ts
interface IUser {
    id: string;
    name: string;
    email: string;
    // diff-add-next-line
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export default IUser;
```

Also update `createUserSchema` & `ICreateUserResponse`.

###### src/contracts/create-user.ts

```ts
import { z } from 'zod';
import type User from '@/domain/user';

export const createUserSchema = z.object({
    name: z.string().min(2).max(20),
    email: z.string().email(),
    // diff-add-next-line
    password: z.string().min(8).max(20),
});

export interface ICreateUserDto extends z.infer<typeof createUserSchema> {}

export interface ICreateUserResponse {
    id: User['id'];
    // diff-add-next-line
    token: string;
}
```

Define new entity that describes encoded data.

###### src/domain/auth-model.ts

```ts
class AuthModel {
    id: string;
    email: string;
}

export default AuthModel;
```

Create a new user login contract

###### src/contracts/login-user.ts

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

When `BaseAuthenticationService` is extended, only two method implementations are required.

-   getEncodedToken
    -   A method that returns an encoded token from a request.
-   getUserFromDecodedToken
    -   A method that returns the entity to which a token belongs.

###### src/services/authentication-service.ts

```ts
import { BaseAuthenticationService } from '@lindeneg/funkallero-auth-service';
import type User from '@/domain/user';
import type AuthModel from '@/domain/auth-model';
import type DataContextService from '@/services/data-context-service';

// BaseAuthenticationService is a scoped service
class AuthenticationService extends BaseAuthenticationService<
    User,
    AuthModel,
    DataContextService
> {
    protected getEncodedToken(): string | null {
        // bearer strategy is taken here, could also be cookies etc..
        const authHeader: string[] =
            this.request.headers.authorization?.split(' ') || [];
        if (authHeader.length === 2) {
            const token: string = authHeader[1];
            return token;
        }
        return null;
    }

    protected async getUserFromDecodedToken(
        decodedToken: AuthModel
    ): Promise<User | null> {
        const user = this.dataContext.userRepository.get(decodedToken.id);

        if (user && user.email === decodedToken.email) return user;

        return null;
    }
}

export default AuthenticationService;
```

#### Implement Authorization Service

`BaseAuthorizationService` is based upon policies. Each policy has a name and a handler function.

By default, each handler is always given an object with a `decodedToken` and the `request` to which that token belongs.

However, it is possible to provide custom arguments via the method `getCustomPolicyArgs`.

###### src/services/authorization-service.ts

```ts
import {
    BaseAuthorizationService,
    type AuthorizationPolicyHandlerFn,
} from '@lindeneg/funkallero-auth-service';
import type AuthModel from '@/domain/auth-model';
import type AuthenticationService from './authentication-service';

type CustomHandlerArgs = {
    authService: AuthenticationService;
};

type AuthHandler = AuthorizationPolicyHandlerFn<CustomHandlerArgs, AuthModel>;

// BaseAuthorizationService is a scoped service
class AuthorizationService extends BaseAuthorizationService<AuthHandler> {
    protected async getCustomPolicyArgs() {
        return {
            authService: this.authService as AuthenticationService,
        };
    }
}

const authenticatedPolicy: AuthHandler = async ({ authService }) => {
    const user = await authService.getUserSafe();

    // auth service already checks user.email === decodedToken.email
    return user !== null;
};

const isMilesDavisPolicy: AuthHandler = async ({ authService }) => {
    const user = await authService.getUserSafe();

    // auth service already checks user.email === decodedToken.email
    return user !== null && user.name.toLowerCase() === 'miles davis';
};

AuthorizationService.addPolicy(
    ['authenticated', authenticatedPolicy],
    ['name-is-miles-davis', isMilesDavisPolicy]
);

export default AuthorizationService;
```

## Register Auth Services

Register auth services in main project file.

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
