import Funkallero, { LOG_LEVEL, BaseZodParserService } from '@lindeneg/funkallero';
import { BaseTokenConfiguration, BaseTokenService } from '@lindeneg/funkallero-auth-service';

import MediatorService from './services/mediator-service';
import DataContextService from './services/data-context-service';
import DataContextSeedService from './services/data-context-seed-service';
import AuthenticationService from './services/authentication-service';
import AuthorizationService from './services/authorization-service';

import SERVICE from '../../example/src/enums/service';
import ExpressService from '../../example/src/services/express-service';
import CookieMiddlewareService from '../../example/src/middleware/cookie-middleware-service';
import Test1MiddlewareService from '../../example/src/middleware/test-1-middleware-service';
import Test2MiddlewareService from '../../example/src/middleware/test-2-middleware-service';
import '../../example/src/api/author-controller';
import '../../example/src/api/book-controller';
import '../../example/src/api/auth-controller';
import '../../example/src/api/versioning-example-controller';

Funkallero.create({
    basePath: '/api',
    port: 3000,
    logLevel: LOG_LEVEL.SILENT,
    versioning: {
        type: 'header',
        headerName: 'api-version',
    },

    setup(service) {
        BaseTokenConfiguration.salt = 6;

        service.registerSingletonService(SERVICE.MEDIATOR, MediatorService);
        service.registerSingletonService(SERVICE.DATA_CONTEXT, DataContextService);
        service.registerSingletonService(SERVICE.EXPRESS, ExpressService);
        service.registerSingletonService(SERVICE.TOKEN, BaseTokenService);
        service.registerSingletonService(SERVICE.SCHEMA_PARSER, BaseZodParserService);
        service.registerSingletonService(SERVICE.DATA_CONTEXT_SEED, DataContextSeedService);
        service.registerScopedService(SERVICE.AUTHENTICATION, AuthenticationService);
        service.registerScopedService(SERVICE.AUTHORIZATION, AuthorizationService);
        service.registerSingletonService(SERVICE.COOKIE_MIDDLEWARE, CookieMiddlewareService);
        service.registerSingletonService(SERVICE.TEST_1_MIDDLEWARE, Test1MiddlewareService);
        service.registerScopedService(SERVICE.TEST_2_MIDDLEWARE, Test2MiddlewareService);
    },
    async startup(service) {
        const seedService = service.getSingletonService<DataContextSeedService>(SERVICE.DATA_CONTEXT_SEED);
        await seedService?.seed();
    },
}).then((app) => {
    console.log('\nstarting e2e\n');
    app.start();
});
