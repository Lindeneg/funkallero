import { createModule, createTemplate } from '@lindeneg/scaffold-core';

const authServices = createModule({
    name: 'auth',
    formattedName: 'Authentication & Authorization',
    description: 'handles auth service operations',
    enabled: true,

    dependencies: [
        {
            name: '@lindeneg/funkallero-auth-service',
            type: 'normal',
        },
    ],

    templates: {
        authentication: createTemplate<Record<string, never>, []>({
            data: {},
            templateFile: 'plop-templates/services/auth/authentication-service.ts.hbs',
        }),
        authorization: createTemplate<Record<string, never>, []>({
            data: {},
            templateFile: 'plop-templates/services/auth/authorization-service.ts.hbs',
        }),
    },
});

export default authServices;
