---
sidebar_position: 2
description: Data context layer
---

# Data Context

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

```ts
import { randomUUID } from 'crypto';
import { SingletonService, type IDataContextService } from '@lindeneg/funkallero';
import User from '../domain/user';

class DataContextService extends SingletonService implements IDataContextService {
    public readonly users = new Map<User['id'], User>();

    public readonly createUser = (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
        const id = randomUUID();
        const now = new Date();
        const createdUser = { ...user, id, createdAt: now, updatedAt: now };
        this.users.set(id, createdUser);
        return createdUser;
    };
}

export default DataContextService;
```
