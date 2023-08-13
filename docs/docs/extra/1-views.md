---
sidebar_position: 1
description: Serve HTML
---

# Views

Views can be implemented a few different ways. One could serve the index file for a single-page-application as the last route on the express context.

However, one could also use templates and return server rendered HTML to the client.

Funkallero offers a base service for this purpose making use of `Handlebars` as template engine. This can of course be extended or overwritten completely.

## Example App

The example app uses the handlebar template service, it can be broken down as such:

-   Express Service
    -   serve `public` folder containing js, css etc.
    -   [Code](https://github.com/Lindeneg/funkallero/blob/master/example/src/services/express-service.ts#L10)
-   Handlebar Templates
    -   page and partial templates
    -   [Code](https://github.com/Lindeneg/funkallero/tree/master/example/templates)
-   Template Service
    -   register templates (and use them with excellent type-safety)
    -   [Code](https://github.com/Lindeneg/funkallero/blob/master/example/src/services/template-service.ts#L6-L39)
-   Controller Layer
    -   connect routes to actions
    -   [Code](https://github.com/Lindeneg/funkallero/blob/master/example/src/api/view-controller.ts#L15-L66)
-   Application Layer
    -   connect actions to templates
    -   [Code](https://github.com/Lindeneg/funkallero/blob/master/example/src/application/views/index.ts#L17-L86)

Take a look at the `dev` script [here](https://github.com/Lindeneg/funkallero/blob/master/example/package.json#L16) to see how one could run it all with hot-reloading while developing.
