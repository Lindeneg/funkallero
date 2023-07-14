import { createModule, createTemplate, createAction, logger, joinPath } from '@lindeneg/scaffold-core';
import { readFile, writeFile } from 'fs/promises';

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
        action: createTemplate<{ actionClassName: string; actionResult: string }, []>({
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

    actions: {
        addExportToApplicationIndex: createAction<{ rootDir: string; exportString: string }>(
            'add-export-to-application-index',
            async (_, { rootDir, exportString }) => {
                try {
                    const path = joinPath(rootDir, 'index.ts');
                    const file = await readFile(path, { encoding: 'utf8' });

                    const newContents = file.trimEnd() + '\n' + exportString;

                    await writeFile(path, newContents, { encoding: 'utf8' });

                    return 'successfully added application export';
                } catch (err) {
                    const msg = 'failed to add application export';

                    logger.error({
                        source: 'modules.application.actions.addExportToApplicationIndex',
                        msg,
                        err,
                        rootDir,
                        exportString,
                    });

                    throw msg;
                }
            }
        ),
    },
});

export default application;
