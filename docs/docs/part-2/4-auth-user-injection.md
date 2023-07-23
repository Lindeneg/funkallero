---
sidebar_position: 4
description: Inject user context utilizing auth services and decorators
---

# Auth User Injection

Suppose authentication context is needed within a controller itself. Say there is some action that expects a `userId` and that id needs to come from the authenticated user.

Well, there's a few ways to do this. One could use `injectService` decorator on authentication service and get access to the authenticated user that way.

For example:

```ts
@controller()
class SomeController extends BaseController {
    @injectService(SERVICE.AUTHENTICATION)
    private readonly authenticationService: IAuthenticationService;

    @httpPatch()
    public async updateBook(@body() payload: SomeDto) {
        return this.mediator.send('UpdateBook', {
            ...payload,
            userId: await this.authenticationService.getUserIdSafe(),
        });
    }
}
```

That has a disadvantage though. If another handler was added to this controller, for example `getBooks` and that handler does not make use of the authentication service,
then the service would still be injected, because it's scoped to the controller itself.

One solution would be to segregate controllers and have handlers within that consumes similar services. It is allowed for multiple controllers to have the same path and thus this solution works.

However, `auth` decorator can also be used. It takes an additional argument that allows user injection scoped to handlers.

## Auth Decorator

###### src/api/auth-controller.ts

```ts
import {
    controller,
    httpGet,
    httpPost,
    body,
    auth,
    MediatorResultSuccess,
} from '@lindeneg/funkallero';
import BaseController from './base-controller';
import { loginUserSchema, type ILoginUserDto } from '@/contracts/login-user';
// diff-add-next-line
import type User from '@/domain/user';

@controller('auth')
class AuthController extends BaseController {
    // diff-add-start
    private readonly userId: string;
    private readonly user: User;
    // diff-add-end

    @httpPost('/login')
    public async loginUser(@body(loginUserSchema) dto: ILoginUserDto) {
        return this.mediator.send('LoginUserCommand', dto);
    }

    @httpGet('/guard')
    // 'id' property from authenticated user injected into property 'userId'
    // diff-add-next-line
    @auth('authenticated', { srcProperty: 'id', destProperty: 'userId' })
    public async mustBeAuthenticated() {
        // diff-add-start
        this.logger.info({
            msg: 'user injection on /guard',
            // should be id of authenticated user
            userId: this.userId,
            // should be undefined
            user: this.user,
        });
        // diff-add-end
        // this will only be executed if the auth policy is satisfied
        return new MediatorResultSuccess('you are authenticated');
    }

    @httpGet('/miles')
    // everything from authenticated user injected into property 'user'
    // diff-add-next-line
    @auth('name-is-miles-davis', 'user')
    public async mustBeMilesDavis() {
        // diff-add-start
        this.logger.info({
            msg: 'user injection on /guard',
            // should be undefined
            userId: this.userId,
            // should be user entity
            user: this.user,
        });
        // diff-add-end
        // this will only be executed if the auth policy is satisfied
        return new MediatorResultSuccess('you are miles davis');
    }
}
```

## Test It

Build the project again and start the server.

Create Miles.

```bash
curl http://localhost:3000/user \
-d '{"name":"Miles Davis", "email":"miles@davis.org", "password": "some-password"}' \
-H "Content-Type: application/json" -X POST
```

Use the token to send a request to guard endpoint. Watch the terminal where the server is running.

```bash
curl http://localhost:3000/auth/guard \
-H "Authorization: Bearer MILES_TOKEN" -X GET
```

stdout:

```
Something
```