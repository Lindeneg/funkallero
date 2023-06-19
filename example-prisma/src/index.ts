import { join as joinPath } from 'path';
import { readFileSync } from 'fs';
import { cwd as getCurrentDirectory } from 'process';
import Funkallero, { LOG_LEVEL } from '@lindeneg/funkallero';
import { BaseTokenService } from '@lindeneg/funkallero-auth-service';
import BaseZodValidationService from '@lindeneg/funkallero-zod-service';
import SERVICE from './enums/service';
import ExpressService from './services/express-service';
import MediatorService from './services/mediator-service';
import DataContextService from './services/data-context-service';
import DataContextSeedService from './services/data-context-seed-service';
import AuthenticationService from './services/authentication-service';
import AuthorizationService from './services/authorization-service';
import CookieMiddlewareService from './services/cookie-middleware-service';
import './api/author-controller';
import './api/book-controller';
import './api/auth-controller';

Funkallero.create({
    // default: ''
    basePath: '/api',

    // default: 3000
    port: 3000,

    // default: LOG_LEVEL.INFO
    logLevel: LOG_LEVEL.VERBOSE,

    // default: null
    // remember to generate creds or alternatively, comment out the https property to run the example on http
    https: {
        key: readFileSync(joinPath(getCurrentDirectory(), 'https', 'key.pem')).toString(),
        cert: readFileSync(joinPath(getCurrentDirectory(), 'https', 'cert.pem')).toString(),
    },

    // default: {}
    // this object will, among other things, be available in the configuration service
    meta: {
        someApiKey: 'some-test-api-key', // or more realistically: process.env.SOME_API_KEY
    },

    setup(service) {
        // mediator and data-context services are always required
        service.registerSingletonService(SERVICE.MEDIATOR, MediatorService);
        service.registerSingletonService(SERVICE.DATA_CONTEXT, DataContextService);

        // optional singleton services
        service.registerSingletonService(SERVICE.EXPRESS, ExpressService);
        service.registerSingletonService(SERVICE.TOKEN, BaseTokenService);
        service.registerSingletonService(SERVICE.VALIDATION, BaseZodValidationService);
        service.registerSingletonService(SERVICE.DATA_CONTEXT_SEED, DataContextSeedService);

        // optional request scoped services
        service.registerScopedService(SERVICE.COOKIE_MIDDLEWARE, CookieMiddlewareService);
        service.registerScopedService(SERVICE.AUTHENTICATION, AuthenticationService);
        service.registerScopedService(SERVICE.AUTHORIZATION, AuthorizationService);
    },

    // optional function that is run after setup but before app start
    async startup(service) {
        if (process.env.NODE_ENV !== 'production') {
            const seedService = service.getSingletonService<DataContextSeedService>(SERVICE.DATA_CONTEXT_SEED);
            await seedService?.seed({
                reset: true,
            });
        }
    },
}).then((app) => app.start());
