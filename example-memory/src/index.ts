import Funkallero, { LOG_LEVEL } from '@lindeneg/funkallero';
import { BaseTokenService } from '@lindeneg/funkallero-auth-service';
import BaseZodValidationService from '@lindeneg/funkallero-zod-service';
import SERVICE from './enums/service';
import MediatorService from './services/mediator-service';
import DataContextService from './services/data-context-service';
import AuthenticationService from './services/authentication-service';
import AuthorizationService from './services/authorization-service';
import DataContextSeedService from './services/data-context-seed-service';
import ExampleSingletonService from './services/example-singleton-service';
import ExampleScopedService from './services/example-scoped-service';
import './api/author-controller';
import './api/book-controller';
import './api/auth-controller';
import './api/example-controller-1';
import './api/example-controller-2';

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
        service.registerSingletonService(SERVICE.VALIDATION, BaseZodValidationService);
        service.registerSingletonService(SERVICE.DATA_CONTEXT_SEED, DataContextSeedService);
        service.registerSingletonService(SERVICE.EXAMPLE_SINGLETON_SERVICE, ExampleSingletonService);

        // optional request scoped services
        service.registerScopedService(SERVICE.AUTHENTICATION, AuthenticationService);
        service.registerScopedService(SERVICE.AUTHORIZATION, AuthorizationService);
        service.registerScopedService(SERVICE.EXAMPLE_SCOPED_SERVICE, ExampleScopedService);
    },

    // optional function that is run after setup but before app start
    async startup(service) {
        const dataContextSeedService = service.getSingletonService<DataContextSeedService>(SERVICE.DATA_CONTEXT_SEED);
        await dataContextSeedService?.seed();
    },
}).then((app) => app.start());
