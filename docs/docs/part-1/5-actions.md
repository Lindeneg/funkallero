---
sidebar_position: 5
description: Time to create some contracts and some actions
---

# Actions

Create three actions, `GetUserQuery`, `GetUsersQuery` and `CreateUserCommand`. Two queries and a single command.

## DTOs & Response contracts

Firstly, make questions such as _"what is the shape of incoming data?"_ and _"what is the shape of outgoing data"_ be easily answered.

Later on we'll look at enforcing those contracts.

###### src/contracts/get-user.ts

```ts
import type User from '@/domain/user';

export interface IGetUserDto {
    id: User['id'];
}

export interface IGetUserResponse {
    id: User['id'];
    name: User['name'];
}

export interface IGetUsersResponse {
    users: IGetUserResponse[];
}
```

###### src/contracts/create-user.ts

```ts
import type User from '@/domain/user';

export interface ICreateUserDto {
    name: User['id'];
    email: User['email'];
}

export interface ICreateUserResponse {
    id: User['id'];
}
```

## Create action files

Utilize CLI to create actions and automatically export them.

```
funkallero query get users --folder user

funkallero query get user --folder user

funkallero command create user --folder user
```

:::info
After running the above commands, open up `src/api/example-controller.ts` and notice the type constraint
of the first argument to `mediator.send` already includes the new actions.

`this.mediator.send("NotApplicable");`

Argument of type `"NotApplicable"` is not assignable to parameter of type `"GetExamplesQuery" | "GetUsersQuery" | "GetUserQuery" | "CreateUserCommand"`.
:::

## Write Business Logic

Write some appropiate logic in new files.

## Get Users Query

Find all user entities, map them the response contract and return the result.

###### src/application/user/get-users-query.ts

```ts
import { MediatorResultSuccess } from '@lindeneg/funkallero';
import BaseAction from '@/application/base-action';
import type { IGetUsersResponse } from '@/contracts/get-user';

class GetUsersQuery extends BaseAction {
    public async execute() {
        const users = Array.from(this.dataContext.userRepository.values());

        const usersResponse: IGetUsersResponse = {
            users: users.map((user) => ({
                id: user.id,
                name: user.name,
            })),
        };

        return new MediatorResultSuccess(usersResponse);
    }
}

export default GetUsersQuery;
```

## Get User Query

Find a user entity given an `id` and map it to the response contract.

:::info
After updating the code as shown below, open up `src/api/example-controller.ts` and notice that the type constraint
of the second argument to `mediator.send` on `GetUserQuery` now is `IGetUserDto`.

`this.mediator.send("GetUserQuery");`

Expected 2 arguments, but got 1.

`this.mediator.send("GetUserQuery", {});`

Property `id` is missing in type `{}` but required in type `IGetUserDto`.
:::

###### src/application/user/get-user-query.ts

```ts
import {
    ACTION_RESULT,
    MediatorResultSuccess,
    MediatorResultFailure,
} from '@lindeneg/funkallero';
import BaseAction from '@/application/base-action';
import type { IGetUserDto, IGetUserResponse } from '@/contracts/get-user';

class GetUserQuery extends BaseAction {
    public async execute({ id }: IGetUserDto) {
        const user = this.dataContext.userRepository.get(id);

        if (!user)
            return new MediatorResultFailure(ACTION_RESULT.ERROR_NOT_FOUND);

        const userResponse: IGetUserResponse = {
            id: user.id,
            name: user.name,
        };

        return new MediatorResultSuccess(userResponse);
    }
}

export default GetUserQuery;
```

## Create User Command

We'll look into validating the DTO later.. but not here in the application layer, we'll do it in the API layer.

###### src/application/user/create-user-command.ts

```ts
import {
    ACTION_RESULT,
    MediatorResultSuccess,
    MediatorResultFailure,
} from '@lindeneg/funkallero';
import BaseAction from '@/application/base-action';
import type {
    ICreateUserDto,
    ICreateUserResponse,
} from '@/contracts/create-user';

class CreateUserCommand extends BaseAction {
    public async execute(dto: ICreateUserDto) {
        const user = await this.dataContext.createUser(dto);

        if (!user)
            return new MediatorResultFailure(ACTION_RESULT.ERROR_NOT_FOUND);

        const userResponse: ICreateUserResponse = {
            id: user.id,
        };

        return new MediatorResultSuccess(
            userResponse,
            ACTION_RESULT.SUCCESS_CREATE
        );
    }
}

export default CreateUserCommand;
```
