---
sidebar_position: 3
description: Terse service overview
---

# Services

## Overview

Services are at the center in Funkallero. The main property that defines a service, is the fact that it can be injected into other services.

In the context of web APIs, it's quite easy to think of two distinct types of services: `Singleton` and `Scoped`. The former is instantiated once. The latter is instantiated per request and is always injected with the request as an instance member.

This of course has a direct influence on the lifetime of a given service instance but it also introduces the following constraint:

Singleton services can only have other singleton services as injection dependencies. Scoped services can have other scoped services as well as singletons as dependencies.

A bunch of defaults services are provided but any service can be extended/overwritten and custom services can be easily added.

At least two singleton services must always be registered, a `MediatorService` and a `DataContextService`.

## Data Context Service

The `init` command from the previous section, created those two services but the `DataContextService` is effectively empty.

Lets do something about that in the next section.
