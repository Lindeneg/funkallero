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
                    const { fileContents, matchesMinusOne, lastMatchIndex, matches, write } =
                        await readFileAndFindLastIndexOfRegex(rootDir, 'index.ts', /import.*;/g);

                    if (typeof lastMatchIndex !== 'undefined' && lastMatchIndex !== -1) {
                        const newContents =
                            fileContents.slice(0, lastMatchIndex + matches[matchesMinusOne][0].length) +
                            '\n' +
                            importString +
                            fileContents.slice(lastMatchIndex + matches[matchesMinusOne][0].length);

                        await write(newContents);

                        return 'successfully added service import';
                    } else {
                        return 'file or import not found';
                    }
                } catch (err) {
                    const msg = 'failed to add service import';

                    logger.error({
                        source: 'modules.base-services.actions.addServiceImportToMainIndex',
                        msg,
                        err,
                        rootDir,
                        importString,
                    });

                    throw msg;
                }
            }
        ),
        registerServiceInMainIndex: createAction<{
            rootDir: string;
            type: 'SingletonService' | 'ScopedService';
            enumName: string;
            className: string;
        }>('register-service-in-main-index', async (_, { rootDir, type, enumName, className }) => {
            try {
                let registerString: string;

                if (type === 'SingletonService') {
                    registerString = 'registerSingletonService';
                } else {
                    registerString = 'registerScopedService';
                }

                const registerService = `    service.${registerString}(SERVICE.${enumName}, ${className});`;
                const { fileContents, matchesMinusOne, lastMatchIndex, matches, write } =
                    await readFileAndFindLastIndexOfRegex(
                        rootDir,
                        'index.ts',
                        /(registerSingletonService|registerScopedService).*;/g
                    );

                if (typeof lastMatchIndex !== 'undefined' && lastMatchIndex !== -1) {
                    const newContents =
                        fileContents.slice(0, lastMatchIndex + matches[matchesMinusOne][0].length) +
                        '\n' +
                        registerService +
                        fileContents.slice(lastMatchIndex + matches[matchesMinusOne][0].length);

                    await write(newContents);

                    return 'successfully registered service';
                } else {
                    return 'file or import not found';
                }
            } catch (err) {
                const msg = 'failed to register service';

                logger.error({
                    source: 'modules.base-services.actions.registerServiceInMainIndex',
                    msg,
                    err,
                    rootDir,
                    type,
                    enumName,
                    className,
                });

                throw msg;
            }
        }),
    },
});
