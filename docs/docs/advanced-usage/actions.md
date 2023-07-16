---
sidebar_position: 3
description: More Actions
---

# More Actions

Lets think about two new actions. `GetUserQuery` and `CreateUserCommand`. Lets also fix `GetUsersQuery` that was created in the basic section.

## DTOs & Response contracts

###### src/dtos/get-user.ts

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

###### src/dtos/create-user.ts

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

## Get Users Query

###### src/application/user/get-users-query.ts

```ts
import { MediatorResultSuccess } from '@lindeneg/funkallero';
import BaseAction from '@/application/base-action';
import type { IGetUsersResponse } from '@/dtos/get-user';

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

###### src/application/user/get-user-query.ts

```ts
import { ACTION_RESULT, MediatorResultSuccess, MediatorResultFailure } from '@lindeneg/funkallero';
import BaseAction from '@/application/base-action';
import type { IGetUserDto, IGetUserResponse } from '@/dtos/get-user';

class GetUserQuery extends BaseAction {
    public async execute({ id }: IGetUserDto) {
        const user = this.dataContext.userRepository.get(id);

        if (!user) return new MediatorResultFailure(ACTION_RESULT.ERROR_NOT_FOUND);

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

###### src/application/user/create-user-command.ts

```ts
import { ACTION_RESULT, MediatorResultSuccess, MediatorResultFailure } from '@lindeneg/funkallero';
import BaseAction from '@/application/base-action';
import type { ICreateUserDto, ICreateUserResponse } from '@/dtos/create-user';

class CreateUserCommand extends BaseAction {
    public async execute(dto: ICreateUserDto) {
        const user = this.dataContext.createUser(dto);

        if (!user) return new MediatorResultFailure(ACTION_RESULT.ERROR_NOT_FOUND);

        const userResponse: ICreateUserResponse = {
            id: user.id,
        };

        return new MediatorResultSuccess(userResponse);
    }
}

export default CreateUserCommand;
```

## Export New Actions

###### src/application/index.ts

```ts
export { default as GetUserQuery } from './user/get-user-query';
export { default as CreateUserCommand } from './user/create-user-command';
```
