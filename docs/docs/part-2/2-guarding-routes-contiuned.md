---
sidebar_position: 2
description: Setup authentication & authorization continued
---

# Guarding Routes Continued

## Update Create User

Update the create user action to satisfy the contract we updated in authentication part 1.

Now, we should return a token that has encoded the id and email of the created user. That also means, we need to inject the `tokenService`.

###### src/application/user/create-user-command.ts

```ts
import {
    // diff-add-start
    ACTION_RESULT,
    injectService,
    // diff-add-end
    MediatorResultSuccess,
    MediatorResultFailure,
    // diff-add-next-line
    type ITokenService,
} from '@lindeneg/funkallero';
// diff-add-next-line
import SERVICE from '@/enums/service';
import BaseAction from '@/application/base-action';
import type {
    ICreateUserDto,
    ICreateUserResponse,
} from '@/contracts/create-user';

class CreateUserCommand extends BaseAction {
    // diff-add-start
    @injectService(SERVICE.TOKEN)
    private readonly tokenService: ITokenService;
    // diff-add-end

    public async execute(dto: ICreateUserDto) {
        // diff-add-next-line
        const user = await this.dataContext.createUser(dto);

        if (!user) {
            return new MediatorResultFailure(
                ACTION_RESULT.ERROR_INTERNAL_ERROR
            );
        }

        const userResponse: ICreateUserResponse = {
            id: user.id,
            // diff-add-start
            token: await this.tokenService.createToken({
                id: user.id,
                email: user.email,
            }),
            // diff-add-end
        };

        return new MediatorResultSuccess(
            userResponse,
            ACTION_RESULT.SUCCESS_CREATE
        );
    }
}

export default CreateUserCommand;
```

## Login User

Add a new login user action in the application layer.

```sh
funkallero command login user --folder user
```

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
import type { ILoginUserDto, ILoginUserResponse } from '@/contracts/login-user';

class LoginUserCommand extends BaseAction {
    @injectService(SERVICE.TOKEN)
    private readonly tokenService: ITokenService;

    public async execute(dto: ILoginUserDto) {
        const user = Array.from(this.dataContext.userRepository.values()).find(
            (e) => e.email === dto.email
        );

        if (!user) {
            return new MediatorResultFailure(ACTION_RESULT.ERROR_NOT_FOUND);
        }

        const isPasswordValid = await this.tokenService.comparePassword(
            dto.password,
            user.password
        );

        if (!isPasswordValid) {
            return new MediatorResultFailure(ACTION_RESULT.ERROR_NOT_FOUND);
        }

        const loginResponse: ILoginUserResponse = {
            token: await this.tokenService.createToken({
                id: user.id,
                email: user.email,
            }),
        };

        return new MediatorResultSuccess(loginResponse);
    }
}

export default LoginUserCommand;
```

## Update Data Context

Hash password from new user. Inject and use `tokenService`.

###### src/services/data-context-service.ts

```ts
import { randomUUID } from 'crypto';
import {
    injectService,
    SingletonService,
    type ILoggerService,
    type IDataContextService,
    // diff-add-next-line
    type ITokenService,
} from '@lindeneg/funkallero';
import SERVICE from '@/enums/service';
import type User from '@/domain/user';
// diff-add-next-line
import type { ICreateUserDto } from '@/contracts/create-user';

class DataContextService
    extends SingletonService
    implements IDataContextService
{
    @injectService(SERVICE.LOGGER)
    private readonly logger: ILoggerService;

    // diff-add-start
    @injectService(SERVICE.TOKEN)
    private readonly tokenService: ITokenService;
    // diff-add-end

    public readonly userRepository = new Map<User['id'], User>();

    // diff-add-next-line
    public async createUser(user: ICreateUserDto) {
        const id = randomUUID();
        const now = new Date();
        const createdUser: User = {
            ...user,
            id,
            createdAt: now,
            updatedAt: now,
            // diff-add-next-line
            password: await this.tokenService.hashPassword(user.password),
        };
        this.userRepository.set(id, createdUser);
        return createdUser;
    }
}

export default DataContextService;
```

## Use Auth Policies

Add a new `auth` controller.

```sh
funkallero controller auth
```

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

## Next

Time to test it!
