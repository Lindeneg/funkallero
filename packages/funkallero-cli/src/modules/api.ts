import { createModule, createTemplate } from '@lindeneg/scaffold-core';

interface ControllerTemplateData {
    controllerName: string;
    handler: string;
    actionId: string;
    controllerPath?: string;
    routePath?: string;
    args?: any;
}

const api = createModule({
    name: 'api',
    description: 'handles api layer operations',
    enabled: true,

    dependencies: [],

    templates: {
        baseController: createTemplate<Record<string, never>, []>({
            data: {},
            templateFile: 'plop-templates/api/base-controller.ts.hbs',
        }),
        controller: createTemplate<ControllerTemplateData, []>({
            data: {},
            templateFile: 'plop-templates/api/controller.ts.hbs',
        }),
    },
});

export default api;
