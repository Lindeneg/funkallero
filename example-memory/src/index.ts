import Funkallero, { LOG_LEVEL, BaseZodParserService } from '@lindeneg/funkallero';
import { BaseTokenService } from '@lindeneg/funkallero-auth-service';
import SERVICE from './enums/service';
import MediatorService from './services/mediator-service';
import DataContextService from './services/data-context-service';
import AuthenticationService from './services/authentication-service';
import AuthorizationService from './services/authorization-service';
import DataContextSeedService from './services/data-context-seed-service';
import ExampleSingletonMiddlewareService from './services/example-singleton-middleware-service';
import ExampleScopedMiddlewareService from './services/example-scoped-middleware-service';

import './api/author-controller';
import './api/book-controller';
import './api/auth-controller';
import './api/example-middleware-controller';

Funkallero.create({
    // default: ''
    basePath: '/api',

    // default: 3000
    port: 3000,

    // default: LOG_LEVEL.INFO
    logLevel: LOG_LEVEL.VERBOSE,

    // default: {}
    // this object will, among other things, be available in the configuration service
    meta: {
        someApiKey: 'some-test-api-key', // or more realistically: process.env.SOME_API_KEY,
    },

    setup(service) {
        // mediator and data-context services are always required
        service.registerSingletonService(SERVICE.MEDIATOR, MediatorService);
        service.registerSingletonService(SERVICE.DATA_CONTEXT, DataContextService);

        // optional singleton services
        service.registerSingletonService(SERVICE.TOKEN, BaseTokenService);
        service.registerSingletonService(SERVICE.SCHEMA_PARSER, BaseZodParserService);
        service.registerSingletonService(SERVICE.DATA_CONTEXT_SEED, DataContextSeedService);

        // optional request scoped services
        service.registerScopedService(SERVICE.AUTHENTICATION, AuthenticationService);
        service.registerScopedService(SERVICE.AUTHORIZATION, AuthorizationService);

        // example middleware services
        service.registerSingletonService(SERVICE.EXAMPLE_SINGLETON_MIDDLEWARE, ExampleSingletonMiddlewareService);
        service.registerScopedService(SERVICE.EXAMPLE_SCOPED_MIDDLEWARE, ExampleScopedMiddlewareService);
    },

    // optional function that is run after setup but before app start
    async startup(service) {
        const dataContextSeedService = service.getSingletonService<DataContextSeedService>(SERVICE.DATA_CONTEXT_SEED);
        await dataContextSeedService?.seed();
    },
}).then((app) => app.start());
