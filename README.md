Funkallero is a prototype for a 'mini-framework' to create web API's built on top of [express](https://expressjs.com/).

It's all just a bit of fun.. and I had loads of that!

It enforces the use of a mediator service to proxy communication between API and application layers in a type-safe manner and enforces the use of dependency-injection to inject services into other services.

The structure of consuming projects are then encouraged to follow the principles of clean architecture and command-query-segregation but neither of those are actually enforced.

Take a look at the two example applications, [in-memory](https://github.com/Lindeneg/funkallero/tree/master/example-memory) or [prisma](https://github.com/Lindeneg/funkallero/tree/master/example-prisma). I'll also probably write documentation at some point and publish the packages.

---

###### Clone project

`git clone git@github.com:Lindeneg/funkallero.git`

###### Bootstrap

`yarn bootstrap`

###### Build

`yarn build`
