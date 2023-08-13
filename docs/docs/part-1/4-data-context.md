---
sidebar_position: 4
description: Put something in data context
---

# Data Context

The [example app](https://github.com/Lindeneg/funkallero/blob/master/example/src/services/data-context-service.ts) uses `prisma`, which is an excellent `ORM`. The [benchmark app](https://github.com/Lindeneg/funkallero/blob/master/example/__mock__/services/data-context-service.ts) uses an in-memory solution.

For now lets make a **simple** implementation of the latter.

## User Entity

Start by defining an entity interface.

###### src/domain/user.ts

```ts
interface IUser {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export default IUser;
```

## Data Context Service

Add simple functionality to data context service.

###### src/services/data-context-service.ts

```ts
// diff-add-next-line
import { randomUUID } from 'crypto';
import {
    injectService,
    SingletonService,
    type ILoggerService,
    type IDataContextService,
} from '@lindeneg/funkallero';
import SERVICE from '@/enums/service';
// diff-add-next-line
import type User from '@/domain/user';

class DataContextService
    extends SingletonService
    implements IDataContextService
{
    @injectService(SERVICE.LOGGER)
    private readonly logger: ILoggerService;

    // diff-add-start
    public readonly userRepository = new Map<User['id'], User>();

    public async createUser(
        user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>
    ) {
        const id = randomUUID();
        const now = new Date();
        const createdUser = { ...user, id, createdAt: now, updatedAt: now };
        this.userRepository.set(id, createdUser);
        return createdUser;
    }
    // diff-add-end
}

export default DataContextService;
```
