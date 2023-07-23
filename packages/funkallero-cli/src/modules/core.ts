import {
    createModule,
    createAction,
    createTemplate,
    logger,
    asyncExec,
    type ScaffoldPackageManager,
    type ScaffoldTemplatePluginImport,
} from '@lindeneg/scaffold-core';
import type { OutputOptions } from 'rollup';

export default createModule({
    name: 'core',
    description: 'handles core package operations',
    enabled: true,

    dependencies: [
        {
            name: '@lindeneg/funkallero',
            type: 'normal',
        },
        {
            name: '@types/node',
            type: 'dev',
        },
        {
            name: '@types/express',
            type: 'dev',
        },
        {
            name: 'typescript',
            type: 'dev',
        },
        {
            name: 'rollup',
            type: 'dev',
        },
        {
            name: 'rollup-plugin-typescript2',
            type: 'dev',
        },
        {
            name: '@rollup/plugin-commonjs',
            type: 'dev',
        },
        {
            name: '@rollup/plugin-node-resolve',
            type: 'dev',
        },
        {
            name: 'rollup-plugin-cleaner',
            type: 'dev',
        },
    ],

    templates: {
        packageJson: createTemplate<{ packageManager: ScaffoldPackageManager }, []>({
            data: {},
            templateFile: 'plop-templates/core/package.json.hbs',
        }),
        mainIndex: createTemplate<{ zod: boolean; authentication: boolean; controllerImport: string }, []>({
            data: {},
            templateFile: 'plop-templates/core/index.ts.hbs',
        }),
        rollupConfig: createTemplate<
            {
                inputFile: string;
                outputs: OutputOptions[];
                plugins: ScaffoldTemplatePluginImport[];
                external: string[];
            },
            []
        >({
            data: {},
            templateFile: 'plop-templates/core/rollup.config.mjs.hbs',
        }),
        tsConfig: createTemplate<Record<string, never>, []>({
            data: {},
            templateFile: 'plop-templates/core/tsconfig.json.hbs',
        }),
    },

    actions: {
        sortPackageJson: createAction<{ rootDir: string }>('sort-package-json', async (_, { rootDir }) => {
            try {
                const cmd = 'npx -y sort-package-json ./package.json';

                logger.info({
                    msg: 'sorting package json.. please wait..',
                    source: 'modules.core.actions.sortPackageJson',
                    cmd,
                    rootDir,
                });

                await asyncExec(cmd, { cwd: rootDir });

                return 'successfully sorted package json';
            } catch (err) {
                const msg = 'failed to sort package json';

                logger.error({
                    source: 'modules.core.actions.sortPackageJson',
                    msg,
                    err,
                    rootDir,
                });

                throw msg;
            }
        }),
    },
});
