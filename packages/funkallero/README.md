# Funkallero

### Description

Funkallero is an opinionated framework to create web API's built on top of [express](https://expressjs.com/).

It's all just a bit of fun.. and I had loads of that!

It enforces the use of a mediator service to proxy communication between API and application layers in a type-safe manner and enforces the use of dependency-injection to inject services into other services.

The structure of consuming projects are then encouraged to follow the principles of clean architecture and command-query-segregation but neither of those are actually enforced.

Take a look at an example [here](https://github.com/Lindeneg/funkallero/tree/master/example).

### Install

`yarn install @lindeneg/funkallero`

### Usage

The best is just to take a look at the example. However, one thing to note, in order for new projects to work as intended, these two properties must be set in `tsconfig.json`:

```json
{
    "compilerOptions": {
        "experimentalDecorators": true,
        "strictPropertyInitialization": false
    }
}
```

### Overview

#### Services

Services are at the core of Funkallero. The main property that defines a service, is the fact that it can be injected into other services.

In the context of web APIs, it's quite easy to think of two distinct types of services: `Singleton` and `Scoped`. The former is instantiated once. The latter is instantiated per request and is always injected with the request as an instance member.

This of course has a direct influence on the lifetime of a given service instance but it also introduces the following constraint:

Singleton services can only have other singleton services as injection dependencies. Scoped services can have other scoped services as well as singletons as dependencies.

A bunch of defaults services are provided but any service can be extended/overwritten and custom services can be easily added.

### Application Layer

The application layer is effectively a bunch of `MediatorAction`'s. A default implementation is provided but a custom one can also be used if desired.

The default implementation is always injected with the registered `DataContextService`. It is recommend to extend the base action and provide the data context as a type.

```ts
// application/action/index.ts
import { MediatorAction } from '@lindeneg/funkallero';
import type DataContextService from '../../services/data-context-service';

class Action extends MediatorAction<DataContextService> {}

export default Action;
```

Suppose a simple application capable of creating a user and retrieving all users or a single user. That would require a command and two queries.

An action's name is simply its class name. The action itself is always implemented in an `execute` method.

###### Command

```ts
// application/user/commands.ts
import {
    ACTION_RESULT,
    MediatorResultSuccess,
    MediatorResultFailure,
    injectService,
    type ITokenService,
} from '@lindeneg/funkallero';
import SERVICE from '../../enums/service';
import Action from '../action';

interface ICreateUserDto {
    name: string;
    email: string;
    password: string;
}

interface ICreateUserResponse {
    token: string;
}

export class CreateUserCommand extends Action {
    // only singletons can be injected into mediator actions
    @injectService(SERVICE.TOKEN)
    private readonly tokenService: ITokenService;

    // by typing an object as an argument for the execute function
    // it is automatically picked up by the mediator and
    // thus when this query is dispatched, the payload type
    // is constrained to the function parameters.. type-safety!
    public async execute({ name, email, password }: ICreateUserDto) {
        const existingUser = await this.dataContext.User.get({
            where: {
                email,
            },
        });

        if (existingUser) {
            // could be any string but having known values is pretty neat..
            return new MediatorResultFailure(ACTION_RESULT.ERROR_UNPROCESSABLE);
        }

        try {
            const user = await this.dataContext.User.create({
                data: {
                    name,
                    email,
                    password: await this.tokenService.hashPassword(password),
                },
            });

            const data: ICreateUserResponse = {
                token: await this.tokenService.createToken({ id: user.id, email: user.email }),
            };

            return new MediatorResultSuccess(data, ACTION_RESULT.SUCCESS_CREATE);
        } catch (err) {
            return new MediatorResultFailure(ACTION_RESULT.ERROR_INTERNAL_ERROR, err);
        }
    }
}
```

###### Query

```ts
// application/user/queries.ts
import { ACTION_RESULT, MediatorResultSuccess, MediatorResultFailure } from '@lindeneg/funkallero';
import Action from '../action';

interface IGetUserDto {
    id: string;
}

interface IGetUserResponse {
    id: string;
    name: string;
}

export class GetUserQuery extends Action {
    public async execute({ id }: IGetUserDto) {
        const userResponse: IGetUserResponse | null = await this.dataContext.User.get({
            where: {
                id,
            },
            select: {
                id: true,
                name: true,
            },
        });

        if (!userResponse) return new MediatorResultFailure(ACTION_RESULT.ERROR_NOT_FOUND);

        return new MediatorResultSuccess(userResponse);
    }
}

export class GetUsersQuery extends Action {
    public async execute() {
        const usersResponse: IGetUserResponse[] = await this.dataContext.User.getMany({
            select: {
                id: true,
                name: true,
            },
        });

        return new MediatorResultSuccess(usersResponse);
    }
}
```

The mediator, from where the actions are ultimately dispatched, knows about the application layer when it is extended, as seen [here](https://github.com/Lindeneg/funkallero/blob/master/example/src/services/mediator-service.ts).

### API Layer

The API layer is composed of controllers that contain route definitions.

#### Controller

A controller is a special kind of scoped service that receives both the request and response context. A base implementation is provided that is injected with the mediator service. It is recommend to extend the base service and provide the mediator as a type.

```ts
// api/controller.ts
import { ControllerService } from '@lindeneg/funkallero';
import type MediatorService from '../services/mediator-service';

class Controller extends ControllerService<MediatorService> {
    // override handleResult if desired
    // public async handleResult(result: MediatorResult): Promise<void> {
    // }
}

export default Controller;
```

In order to create a controller, the `controller` decorator must be used and a `path` can be provided.

```ts
// api/user-controller.ts
import { controller } from '@lindeneg/funkallero';
import Controller from './controller';

@controller('user')
class UserController extends Controller {}
```

Assume the `basePath` is set to `/api` and assume the app is running on `localhost:3000`, the controller path would be `http://localhost:3000/api/user`.

#### Route Handler

In order to have routes and handlers, simply define methods and use the appropiate `http` decorator. The handler method must always return a `MediatorResult`.

```ts
import { body, params, controller, httpGet, httpPost } from '@lindeneg/funkallero';
import Controller from './controller';

@controller('user')
class UserController extends Controller {
    @httpPost()
    // if a schema parser service has been registered, such as zod
    // it can neatly be used here via the body decorator
    public createUser(@body(createUserZodSchema) createUserDto: ICreateUserDto) {
        // type-safe mediator!
        return this.mediator.send('CreateUserCommand', createUserDto);
    }

    @httpGet('/:id')
    public async getUser(@params('id') id: string) {
        return this.mediator.send('GetUserQuery', { id });
    }

    @httpGet()
    public async getUsers() {
        return this.mediator.send('GetUsersQuery');
    }
}
```

In order for the controller to be registered, just import the file itself inside the projects main file i.e

`import './api/user-controller';`

There's more to do with controllers, such as specifying middleware or authorization policies, both via decorators. Singletons and scoped services can also be injected into controllers.

#### Middleware

Middleware are attached to route handlers using `before` and `after` decorators. The before middleware is run before the route handler, after is run after the route handler and is given the handler result as an argument.

Middleware are again services and thus inherits all service properties. Middleware services are then guaranteed to contain two public methods: `beforeRequestHandler` and `afterRequestHandler`, which correlates to `before` and `after` decorators, respectively. However, both have an empty default implementation and thus one can implement only what's desired.

If multiple middleware services are added to a handler, then this rule applies:

If multiple `before` middleware services are added, they are executed in arbitrary order. If multiple `after` middleware services are added, they are always executed in the order they were provided.

###### Singleton Middleware

```ts
import {
    injectService,
    MiddlewareSingletonService,
    type ILoggerService,
    type Response,
    type Request,
    type MediatorResult,
} from '@lindeneg/funkallero';
import SERVICE from '../enums/service';

// can only have singleton services injected but is also only instantiated once
class Test1MiddlewareService extends MiddlewareSingletonService {
    @injectService(SERVICE.LOGGER)
    private readonly logger: ILoggerService;

    async beforeRequestHandler(request: Request, response: Response) {
        this.logger.info(`before test-1-middleware running on request: ${request.id}`);
    }
}

export default Test1MiddlewareService;
```

###### Scoped Middleware

```ts
import {
    injectService,
    MiddlewareScopedService,
    type ILoggerService,
    type Response,
    type MediatorResult,
} from '@lindeneg/funkallero';
import SERVICE from '../enums/service';

// can have scoped and singleton services injected but is instantiated per request
class Test2MiddlewareService extends MiddlewareScopedService {
    @injectService(SERVICE.LOGGER)
    private readonly logger: ILoggerService;

    async beforeRequestHandler(response: Response) {
        this.logger.info(`before test-2-middleware running on request: ${this.request.id}`);
    }

    async afterRequestHandler(response: Response, result: MediatorResult) {
        this.logger.info(`after test-2-middleware running on request: ${this.request.id}`);
        return result;
    }
}

export default Test2MiddlewareService;
```

Middleware must be registered exactly like other services and once done, they can be used via decorators:

```ts

@httpGet('/:id')
@before(SERVICE.TEST_1_MIDDLEWARE, SERVICE.TEST_2_MIDDLEWARE)
@after(SERVICE.TEST_2_MIDDLEWARE)
public async getUser(@params('id') id: string) {
    return this.mediator.send('GetUserQuery', { id });
}
```

##### Required Services

A `MediatorService` and `DataContextService` must always be registered as singleton services. In addition, three other singletons are required and if not registered by the consumer, a default implementation will automatically be used.

The core service are as such:

| Name                        | Required | Context                                                                                                                                                                                                                                                                                                                                                                                                     |
| --------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IMediatorService            | Yes      | [Interface](https://github.com/Lindeneg/funkallero/blob/master/packages/funkallero-core/src/service/mediator-service.ts#L77-L79), [Base Implementation](https://github.com/Lindeneg/funkallero/blob/master/packages/funkallero/src/service/base-mediator-service.ts#L12-L45), [Consumer Implementation](https://github.com/Lindeneg/funkallero/blob/master/example-prisma/src/services/mediator-service.ts) |
| IDataContextService         | Yes      | [Interface](https://github.com/Lindeneg/funkallero/blob/master/packages/funkallero-core/src/service/data-context-service.ts#L3), [Consumer Implementation](https://github.com/Lindeneg/funkallero/blob/master/example-prisma/src/services/data-context-service.ts)                                                                                                                                          |
| IExpressService             | No       | [Interface](https://github.com/Lindeneg/funkallero/blob/master/packages/funkallero-core/src/service/express-service.ts#L4-L8), [Base Implementation](https://github.com/Lindeneg/funkallero/blob/master/packages/funkallero/src/service/base-express-service.ts)                                                                                                                                            |
| IExpressErrorHandlerService | No       | [Interface](https://github.com/Lindeneg/funkallero/blob/master/packages/funkallero-core/src/service/express-error-handler-service.ts#L8-L10), [Base Implementation](https://github.com/Lindeneg/funkallero/blob/master/packages/funkallero/src/service/base-error-handler-service.ts)                                                                                                                       |
| IConfigurationService       | No       | [Interface](https://github.com/Lindeneg/funkallero/blob/master/packages/funkallero-core/src/service/configuration-service.ts#L15-L21), [Base Implementation](https://github.com/Lindeneg/funkallero/blob/master/packages/funkallero/src/service/base-configuration-service.ts)                                                                                                                              |
| ILoggerService              | No       | [Interface](https://github.com/Lindeneg/funkallero/blob/master/packages/funkallero-core/src/service/logger-service.ts#L18-L23), [Base Implementation](https://github.com/Lindeneg/funkallero/blob/master/packages/funkallero/src/service/base-logger-service.ts)                                                                                                                                            |
