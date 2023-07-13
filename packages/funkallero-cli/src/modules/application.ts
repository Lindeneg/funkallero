import { createModule, createTemplate } from '@lindeneg/scaffold-core';

interface IndexFileTemplateData {
    exports: Array<{
        name: string;
        path: string;
    }>;
}

const application = createModule({
    name: 'application',
    description: 'handles application layer operations',
    enabled: true,

    dependencies: [],

    templates: {
        action: createTemplate<{ actionName: string; type: 'Command' | 'Query'; actionResult: string }, []>({
            data: {},
            templateFile: 'plop-templates/application/action.ts.hbs',
        }),
        baseAction: createTemplate<Record<string, never>, []>({
            data: {},
            templateFile: 'plop-templates/application/base-action.ts.hbs',
        }),
        indexFile: createTemplate<IndexFileTemplateData, []>({
            data: {},
            templateFile: 'plop-templates/application/index.ts.hbs',
        }),
    },
});

export default application;
