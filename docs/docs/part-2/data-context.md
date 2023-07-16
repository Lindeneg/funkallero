---
sidebar_position: 2
description: Data context layer
---

# Data Context

The [example app](https://github.com/Lindeneg/funkallero/blob/master/example/src/services/data-context-service.ts) uses `prisma`, which is an excellent `ORM`. The [e2e test app](https://github.com/Lindeneg/funkallero/blob/master/e2e/src/services/data-context-service.ts) uses an in-memory solution.

For now lets make a simple implementation of the latter.

## Domain Layer

Start by creating an entity.

###### src/domain/user.ts

```ts
class User {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export default User;
```

## Data Context Service

Extend data context service with some simple functionality.

###### src/services/data-context-service.ts

```ts
import { randomUUID } from 'crypto';
import {
    injectService,
    SingletonService,
    type ILoggerService,
    type IDataContextService,
} from '@lindeneg/funkallero';
import SERVICE from '@/enums/service';
import type User from '@/domain/user';

class DataContextService extends SingletonService implements IDataContextService {
    @injectService(SERVICE.LOGGER)
    private readonly logger: ILoggerService;

    public readonly userRepository = new Map<User['id'], User>();

    public readonly createUser = (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
        const id = randomUUID();
        const now = new Date();
        const createdUser = { ...user, id, createdAt: now, updatedAt: now };
        this.userRepository.set(id, createdUser);
        return createdUser;
    };
}

export default DataContextService;
```
