---
sidebar_position: 3
description: Guarding routes part 2
---

# Authentication Part 2

## Update Create User

Update the create user action to satisfy the contract we updated in authentication part 1.

Now, we should return a token that has encoded the id and email of the created user. That also means, we need to inject the `tokenService`.

###### src/application/user/create-user-command.ts

```ts
import {
    ACTION_RESULT,
    MediatorResultSuccess,
    MediatorResultFailure,
    injectService,
    type ITokenService,
} from '@lindeneg/funkallero';
import SERVICE from '@/enums/service';
import BaseAction from '@/application/base-action';
import type { ICreateUserDto, ICreateUserResponse } from '@/dtos/create-user';

class CreateUserCommand extends BaseAction {
    @injectService(SERVICE.TOKEN)
    private readonly tokenService: ITokenService;

    public async execute(dto: ICreateUserDto) {
        const user = await this.dataContext.createUser(dto);

        if (!user) return new MediatorResultFailure(ACTION_RESULT.ERROR_INTERNAL_ERROR);

        const userResponse: ICreateUserResponse = {
            id: user.id,
            token: await this.tokenService.createToken({ id: user.id, email: user.email }),
        };

        return new MediatorResultSuccess(userResponse, ACTION_RESULT.SUCCESS_CREATE);
    }
}

export default CreateUserCommand;
```

## Login User

Add a new login user action in the application layer.

:::info
Remember to export new action in `src/application/index.ts`.
:::

###### src/application/user/login-user-command.ts

```ts
import {
    ACTION_RESULT,
    MediatorResultSuccess,
    MediatorResultFailure,
    injectService,
    type ITokenService,
} from '@lindeneg/funkallero';
import SERVICE from '@/enums/service';
import BaseAction from '@/application/base-action';
import type { ILoginUserDto, ILoginUserResponse } from '@/dtos/login-user';

class LoginUserCommand extends BaseAction {
    @injectService(SERVICE.TOKEN)
    private readonly tokenService: ITokenService;

    public async execute(dto: ILoginUserDto) {
        const user = Array.from(this.dataContext.userRepository.values()).find((e) => e.email === dto.email);

        if (!user) return new MediatorResultFailure(ACTION_RESULT.ERROR_NOT_FOUND);

        const isPasswordValid = await this.tokenService.comparePassword(dto.password, user.password);

        if (!isPasswordValid) return new MediatorResultFailure(ACTION_RESULT.ERROR_NOT_FOUND);

        const loginResponse: ILoginUserResponse = {
            token: await this.tokenService.createToken({ id: user.id, email: user.email }),
        };

        return new MediatorResultSuccess(loginResponse);
    }
}

export default LoginUserCommand;
```

## Update Data Context

We need to hash the password we get when creating a user. Just inject and use the `tokenService`.

###### src/services/data-context-service.ts

```ts
import { randomUUID } from 'crypto';
import { SingletonService, injectService, type IDataContextService, type ITokenService } from '@lindeneg/funkallero';
import SERVICE from '@/enums/service';
import type User from '@/domain/user';

class DataContextService extends SingletonService implements IDataContextService {
    @injectService(SERVICE.TOKEN)
    private readonly tokenService: ITokenService;

    public readonly userRepository = new Map<User['id'], User>();

    public readonly createUser = async (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
        const id = randomUUID();
        const now = new Date();
        const createdUser: User = {
            ...user,
            id,
            createdAt: now,
            updatedAt: now,
            password: await this.tokenService.hashPassword(user.password),
        };
        this.userRepository.set(id, createdUser);
        return createdUser;
    };
}

export default DataContextService;
```

## Use Auth Policies

Lets add a new `auth` controller.

:::info
Remember to import new controller in `src/index.ts`.

`import '@/api/auth-controller';`
:::

###### src/api/auth-controller.ts

```ts
import { controller, httpGet, httpPost, body, auth, MediatorResultSuccess } from '@lindeneg/funkallero';
import BaseController from './base-controller';
import { loginUserSchema, type ILoginUserDto } from '@/dtos/login-user';

@controller('auth')
class AuthController extends BaseController {
    @httpPost('/login')
    public async loginUser(@body(loginUserSchema) dto: ILoginUserDto) {
        return this.mediator.send('LoginUserCommand', dto);
    }

    @httpGet('/guard')
    @auth('authenticated')
    public async mustBeAuthenticated() {
        // this will only be executed if the auth policy is satisfied
        return new MediatorResultSuccess('you are authenticated');
    }

    @httpGet('/miles')
    @auth('name-is-miles-davis')
    public async mustBeMilesDavis() {
        // this will only be executed if the auth policy is satisfied
        return new MediatorResultSuccess('you are miles davis');
    }
}
```

## Test it out

Alright, now we can test out the new auth usage. Build the project anew and start the server again.

Lets try to hit a guarded route with no credentials.

```bash
curl http://localhost:3000/auth/guard
```

###### 401 Unauthorized

```json
{
    "message": "The provided credentials are either invalid or has insufficient privilege to perform the requested action."
}
```

Create a new user that is **not** Miles Davis

```bash
curl http://localhost:3000/user \
-d '{"name":"john doe", "email":"john@doe.org", "password": "some-password"}' \
-H "Content-Type: application/json" -X POST -o john.json
```

A new file is created `jonn.json` that contains the response, including the generated token. We'll use that now.

Open the `john.json` file and copy the token, send a request to the guarded endpoint again and include the token as a bearer.

```bash
curl http://localhost:3000/auth/guard \
-H "Authorization: Bearer JOHN_TOKEN" -X GET
```

###### 200 OK

```json
{ "data": "you are authenticated" }
```

Nice! It worked.

Lets see how the other policy works. Reuse John's token.

```bash
curl http://localhost:3000/auth/miles \
-H "Authorization: Bearer JOHN_TOKEN" -X GET
```

###### 401 Unauthorized

```json
{
    "message": "The provided credentials are either invalid or has insufficient privilege to perform the requested action."
}
```

Ok, lets create a new user, Miles Davis and use that token with the miles endpoint. We should see 200 OK response.

```bash
curl http://localhost:3000/user \
-d '{"name":"Miles Davis", "email":"miles@davis.org", "password": "some-password"}' \
-H "Content-Type: application/json" -X POST -o miles.json
```

A new file is created `miles.json` that contains the generated token. Use that now.

```bash
curl http://localhost:3000/auth/miles \
-H "Authorization: Bearer MILES_TOKEN" -X GET
```

###### 200 OK

```json
{ "data": "you are miles davis" }
```
