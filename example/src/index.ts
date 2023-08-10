import Funkallero, { LOG_LEVEL, BaseZodParserService, BaseLoggerServicePalette } from '@lindeneg/funkallero';
import { BaseTokenService } from '@lindeneg/funkallero-auth-service';
import SERVICE from '@/enums/service';
import ExpressService from '@/services/express-service';
import MediatorService from '@/services/mediator-service';
import DataContextService from '@/services/data-context-service';
import DataContextSeedService from '@/services/data-context-seed-service';
import AuthenticationService from '@/services/authentication-service';
import AuthorizationService from '@/services/authorization-service';
import TemplateService from '@/services/template-service';
import CookieMiddlewareService from '@/middleware/cookie-middleware-service';
import Test1MiddlewareService from '@/middleware/test-1-middleware-service';
import Test2MiddlewareService from '@/middleware/test-2-middleware-service';
import '@/api/author-controller';
import '@/api/book-controller';
import '@/api/auth-controller';
import '@/api/versioning-example-controller';
import '@/views';

BaseLoggerServicePalette.useDefaultPalette();

Funkallero.create({
    // default: ''
    basePath: '/api',

    // default: 3000
    port: 3000,

    // default: null
    globalHeaders: {
        'Content-Type': 'application/json', // can easily be overwritten but nice default to have
        'Custom-Header': 'Global-Custom-Header-Value', // can also be function that is given the request to which the response belongs
    },

    // default: null
    versioning: {
        type: 'header', // can also be url
        headerName: 'api-version',
    },

    // default: LOG_LEVEL.INFO
    logLevel: LOG_LEVEL.VERBOSE,

    // default: null
    // can also be a function
    // https: {
    //     key: 'path/to/key.pem',
    //     cert: 'path/to/cert.pem',
    // },

    // default: {}
    // this object will, among other things, be available in the configuration service
    meta: {
        someApiKey: 'some-test-api-key', // or more realistically: process.env.SOME_API_KEY,
        isDev: process.argv.includes('--dev'),
    },

    setup(service) {
        // mediator and data-context services are always required
        service.registerSingletonService(SERVICE.MEDIATOR, MediatorService);
        service.registerSingletonService(SERVICE.DATA_CONTEXT, DataContextService);

        // optional singleton services
        service.registerSingletonService(SERVICE.TEMPLATE, TemplateService);
        service.registerSingletonService(SERVICE.EXPRESS, ExpressService);
        service.registerSingletonService(SERVICE.TOKEN, BaseTokenService);
        service.registerSingletonService(SERVICE.SCHEMA_PARSER, BaseZodParserService);
        service.registerSingletonService(SERVICE.DATA_CONTEXT_SEED, DataContextSeedService);

        // optional request scoped services
        service.registerScopedService(SERVICE.AUTHENTICATION, AuthenticationService);
        service.registerScopedService(SERVICE.AUTHORIZATION, AuthorizationService);

        // example middleware services
        service.registerSingletonService(SERVICE.COOKIE_MIDDLEWARE, CookieMiddlewareService);
        service.registerSingletonService(SERVICE.TEST_1_MIDDLEWARE, Test1MiddlewareService);
        service.registerScopedService(SERVICE.TEST_2_MIDDLEWARE, Test2MiddlewareService);
    },

    // optional function that is run after setup but before app start
    async startup(service) {
        await service.getSingletonService<TemplateService>(SERVICE.TEMPLATE)?.initializeTemplates();

        if (process.env.NODE_ENV !== 'production') {
            await service.getSingletonService<DataContextSeedService>(SERVICE.DATA_CONTEXT_SEED)?.seed({
                reset: false,
            });
        }
    },
}).then((app) => app.start());
