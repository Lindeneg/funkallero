---
sidebar_position: 1
---

# Funkallero CLI

A CLI tool for to initialize and manage Funkallero projects.

## Install

`yarn global add @lindeneg/funkallero-cli`

`npm install -g @lindeneg/funkallero-cli`

`npx -y @lindeneg/funkallero-cli@latest`

## Usage

:::info
In order to make the most out of this tool, follow the [recommended](/docs/part-1/base-project#structure) project structure.
:::

### Init

Initializes a new Funkallero project.

```
Funkallero Init Generator

$ funkallero init NAME [--OPTIONS]

NAME:     Project name
OPTIONS:  (auth, prisma, zod, npm, yarn)

Examples:

$ funkallero init my-project

$ funkallero init my-project --auth --prisma --zod --npm
```

### Command

Adds a mediator action command to a current project

```
Funkallero Command Generator

Create a new mediator action in either src/application or src/application/FOLDER,
the action is automatically exported in src/application/index.ts.

$ funkallero command ...NAME [--folder FOLDER]

NAME:    Action name
FOLDER:  Optional name of folder to place action in

Examples:

$ funkallero command create user

$ funkallero command create event attendee --folder event
```

### Query

Adds a mediator action query to a current project

```
Funkallero Query Generator

Create a new mediator action in either src/application or src/application/FOLDER,
the action is automatically exported in src/application/index.ts.

$ funkallero query ...NAME [--folder FOLDER]

NAME:    Action name
FOLDER:  Optional name of folder to place action in

Examples:

$ funkallero query get user

$ funkallero query get event attendees --folder event
```

### Controller

Adds an api controller to a current project

```
Funkallero Controller Generator

Create a new API controller, places it in src/api/NAME-controller.ts and
automatically imports it in main index file src/index.ts.

$ funkallero controller ...NAME

NAME: Controller name

Examples:

$ funkallero controller some name

$ funkallero controller some other name
```

### Scoped

Adds a scoped service to a current project

```
Funkallero ScopedService Generator

Create a new service in src/services, adds the service to
src/enums/service.ts and registers the service in src/index.ts.

$ funkallero scoped ...NAME

NAME:    Service name

Examples:

$ funkallero scoped some name

$ funkallero scoped some other name
```

### Singleton

Adds a singleton service to a current project

```
Funkallero SingletonService Generator

Create a new service in src/services, adds the service to
src/enums/service.ts and registers the service in src/index.ts.

$ funkallero singleton ...NAME

NAME:    Service name

Examples:

$ funkallero singleton some name

$ funkallero singleton some other name
```
