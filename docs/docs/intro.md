---
sidebar_position: 1
---

# Funkallero - What is it?

I quite like developing web APIs using mediator pattern, dependency injection and command-query segregation. Funkallero is effectively a wrapper on top of [Express](https://expressjs.com) that enforces those patterns with strong type safety.

It's all just a bit of fun.. and I had loads of that!

Since the framework is still in its infancy, features are missing, performance is not optimized and tests are lacking. The features being worked on at the moment are caching, views, versioning and benchmarks.

Needless to say, for anything serious, please use [Express](https://expressjs.com) directly or [NestJS](https://nestjs.com/).

## Packages

Funkallero is composed of the following packages:

-   [funkallero-cli](https://github.com/Lindeneg/funkallero/tree/master/packages/funkallero-cli)
    -   CLI tool to initialize and develop `Funkallero` projects.
-   [funkallero](https://github.com/Lindeneg/funkallero/tree/master/packages/funkallero)
    -   Serves as the main package that wraps everything together.
    -   Dependant upon `funkallero-core` and `express`.
-   [funkallero-auth-service](https://github.com/Lindeneg/funkallero/tree/master/packages/funkallero-auth-service)
    -   Optional addon package.
    -   Provides a default implementation of `IAuthenticationService`, `IAuthorizationService` and `ITokenService`.
    -   Dependant upon `funkallero-core`, `bcryptjs` and `jsonwebtoken`.
-   [funkallero-core](https://github.com/Lindeneg/funkallero/tree/master/packages/funkallero-core)
    -   Defines core interfaces, abstracts, enums and decorators.
    -   No dependencies.

## Example

There's an example application available on GitHub that demonstrates Funkallero [here](https://github.com/Lindeneg/funkallero/tree/master/example).
