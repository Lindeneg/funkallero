import { createAction, createModule, createTemplate, logger } from '@lindeneg/scaffold-core';
import { readFileAndFindLastIndexOfRegex } from './utils';

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
                    const { fileContents, matchesMinusOne, lastMatchIndex, matches, write } =
                        await readFileAndFindLastIndexOfRegex(rootDir, 'index.ts', /import.*;/g);

                    if (typeof lastMatchIndex !== 'undefined' && lastMatchIndex !== -1) {
                        const newContents =
                            fileContents.slice(0, lastMatchIndex + matches[matchesMinusOne][0].length) +
                            '\n' +
                            importString +
                            fileContents.slice(lastMatchIndex + matches[matchesMinusOne][0].length);

                        await write(newContents);

                        return 'successfully added controller import';
                    } else {
                        return 'file or import not found';
                    }
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
