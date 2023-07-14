import { readFile, writeFile } from 'fs/promises';
import { createAction, createModule, createTemplate, joinPath, logger } from '@lindeneg/scaffold-core';

interface ControllerTemplateData {
    controllerName: string;
    handler: string;
    controllerPath?: string;
    handlerReturn?: string;
    routePath?: string;
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

    actions: {
        addControllerImportToMainIndex: createAction<{ rootDir: string; importString: string }>(
            'add-controller-import-to-main-index',
            async (_, { rootDir, importString }) => {
                try {
                    const path = joinPath(rootDir, 'index.ts');
                    const file = await readFile(path, { encoding: 'utf8' });
                    const lastImportRegex = /import.*;/g;
                    const matches = [...file.matchAll(lastImportRegex)];
                    const matchesMinusOne = matches.length - 1;
                    const lastImportIndex = matches.length > 0 ? matches[matchesMinusOne].index : -1;

                    if (typeof lastImportIndex !== 'undefined' && lastImportIndex !== -1) {
                        const newContents =
                            file.slice(0, lastImportIndex + matches[matchesMinusOne][0].length) +
                            '\n' +
                            importString +
                            file.slice(lastImportIndex + matches[matchesMinusOne][0].length);

                        await writeFile(path, newContents, { encoding: 'utf8' });
                    }

                    return 'successfully added controller import';
                } catch (err) {
                    const msg = 'failed to add controller import';

                    logger.error({
                        source: 'modules.api.actions.addControllerImportToMainIndex',
                        msg,
                        err,
                        rootDir,
                        importString,
                    });

                    throw msg;
                }
            }
        ),
    },
});

export default api;
