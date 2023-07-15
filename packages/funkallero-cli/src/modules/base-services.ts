import { createModule, createTemplate, createAction, logger } from '@lindeneg/scaffold-core';
import { readFileAndFindLastIndexOfRegex } from './utils';

interface ServiceTemplateData {
    serviceName: string;
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

    actions: {
        addServiceToServiceEnum: createAction<{ rootDir: string; enumName: string }>(
            'add-service-to-service-enum',
            async (_, { rootDir, enumName }) => {
                try {
                    const { lastMatchIndex, fileContents, write } = await readFileAndFindLastIndexOfRegex(
                        rootDir,
                        'service.ts',
                        /}.*;/g
                    );

                    if (typeof lastMatchIndex !== 'undefined' && lastMatchIndex !== -1) {
                        const newContents =
                            fileContents.slice(0, lastMatchIndex) +
                            `    ${enumName}: '${enumName}',\n` +
                            fileContents.slice(lastMatchIndex);

                        await write(newContents);

                        return 'successfully added service to enum';
                    } else {
                        return 'service enum regex failed';
                    }
                } catch (err) {
                    const msg = 'failed to create service';

                    logger.error({
                        source: 'modules.base-services.actions.addServiceToServiceEnum',
                        msg,
                        err,
                        rootDir,
                        enumName,
                    });

                    throw msg;
                }
            }
        ),
        addServiceImportToMainIndex: createAction<{ rootDir: string; importString: string }>(
            'add-service-import-to-main-index',
            async (_, { rootDir, importString }) => {
                try {
                    return '';
                } catch (err) {
                    return '';
                }
            }
        ),
        registerServiceInMainIndex: createAction<{
            rootDir: string;
            type: 'SingletonService' | 'ScopedService';
            enumName: string;
            className: string;
        }>('register-service-in-main-index', async (_, { rootDir, type, enumName, className }) => {
            let registerString: string;

            if (type === 'SingletonService') {
                registerString = 'registerSingletonService';
            } else {
                registerString = 'registerScopedService';
            }

            const registerService = `service.${registerString}(SERVICE.${enumName}, ${className});`;

            console.log('registerService', registerService);

            return '';
        }),
    },
});
