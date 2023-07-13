import { createModule, createTemplate } from '@lindeneg/scaffold-core';

interface ServiceTemplateData {
    name: string;
    BaseService: 'SingletonService' | 'ScopedService';
}

export default createModule({
    name: 'base-services',
    description: 'handles base service operations',
    enabled: true,

    dependencies: [],

    templates: {
        service: createTemplate<ServiceTemplateData, []>({
            data: {},
            templateFile: 'plop-templates/services/core/service.ts.hbs',
        }),
        dataContextService: createTemplate<{ prisma: boolean }, []>({
            data: {},
            templateFile: 'plop-templates/services/core/data-context-service.ts.hbs',
        }),
        mediatorService: createTemplate<Record<string, never>, []>({
            data: {},
            templateFile: 'plop-templates/services/core/mediator-service.ts.hbs',
        }),
        serviceEnum: createTemplate<Record<string, never>, []>({
            data: {},
            templateFile: 'plop-templates/services/core/service-enum.ts.hbs',
        }),
    },
});
