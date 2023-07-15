---
sidebar_position: 1
description: Introduction to advanced usage
---

# Intro

This section continues from where the [basic](/docs/category/funkallero---basic) section ended.

## Improvements

It was a bit of work to not really achieve a whole lot. However, now we have the foundations to actually build something neat.

##### Persistence

Lets improve the `DataContextService`. The [example app](https://github.com/Lindeneg/funkallero/blob/master/example/src/services/data-context-service.ts) uses `prisma`, which is an excellent `ORM`.

However, for now lets keep it simple and make an in-memory "persistence" layer.

<!-- Lets think about two new actions. `GetUser` and `CreateUser`, a query and a command respectively. -->
