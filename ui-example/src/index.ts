import Funkallero, { BaseLoggerServicePalette, LOG_LEVEL } from '@lindeneg/funkallero';
import SERVICE from '@/enums/service';
import ExpressService from '@/services/express-service';
import MediatorService from '@/services/mediator-service';
import DataContextService from '@/services/data-context-service';
import TemplateService from '@/services/template-service';
import '@/views/home-controller';

BaseLoggerServicePalette.useDefaultPalette();

Funkallero.create({
    basePath: '/api',

    logLevel: LOG_LEVEL.VERBOSE,

    meta: {
        isDev: true,
    },

    setup(service) {
        service.registerSingletonService(SERVICE.EXPRESS, ExpressService);
        service.registerSingletonService(SERVICE.MEDIATOR, MediatorService);
        service.registerSingletonService(SERVICE.DATA_CONTEXT, DataContextService);
        service.registerSingletonService(SERVICE.TEMPLATE, TemplateService);
    },

    async startup(service) {
        const templateService = service.getSingletonService<TemplateService>(SERVICE.TEMPLATE);
        if (templateService) await templateService.initializeTemplates();
    },
}).then((app) => app.start());
