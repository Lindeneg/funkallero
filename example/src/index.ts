import Funkallero, { LOG_LEVEL, BaseZodParserService } from '@lindeneg/funkallero';
import { BaseTokenService } from '@lindeneg/funkallero-auth-service';
import SERVICE from './enums/service';
import ExpressService from './services/express-service';
import MediatorService from './services/mediator-service';
import DataContextService from './services/data-context-service';
import DataContextSeedService from './services/data-context-seed-service';
import AuthenticationService from './services/authentication-service';
import AuthorizationService from './services/authorization-service';
import CookieMiddlewareService from './middleware/cookie-middleware-service';
import Test1MiddlewareService from './middleware/test-1-middleware-service';
import Test2MiddlewareService from './middleware/test-2-middleware-service';
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
    // uncomment to use https, if so remember to generate creds (see package.json for example)
    // https: async () => {
    //     const [path, process, fs] = await Promise.all([import('path'), import('process'), import('fs/promises')]);
    //     const getPath = (name: string) => path.join(process.cwd(), 'https', `${name}.pem`);

    //     const [key, cert] = await Promise.all([
    //         fs.readFile(getPath('key'), { encoding: 'utf-8' }),
    //         fs.readFile(getPath('cert'), { encoding: 'utf-8' }),
    //     ]);

    //     return { key, cert };
    // },

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
        if (process.env.NODE_ENV !== 'production') {
            const seedService = service.getSingletonService<DataContextSeedService>(SERVICE.DATA_CONTEXT_SEED);
            await seedService?.seed({
                reset: true,
            });
        }
    },
}).then((app) => app.start());
