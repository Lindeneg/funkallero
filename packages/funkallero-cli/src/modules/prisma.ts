import { createModule, createAction, logger, asyncExec } from '@lindeneg/scaffold-core';

export default createModule({
    name: 'prisma',
    formattedName: 'Prisma',
    description: 'handles prisma module operations',
    enabled: true,

    dependencies: [
        {
            name: '@prisma/client',
            type: 'normal',
        },
    ],

    templates: {},

    actions: {
        init: createAction<{ rootDir: string }>('init-prisma', async (_, { rootDir }) => {
            try {
                const cmd = 'npx -y prisma init';

                await asyncExec(cmd, { cwd: rootDir });

                return 'successfully initialized prisma';
            } catch (err) {
                const msg = 'failed to sort package json';

                logger.error({
                    source: 'modules.prisma.actions.init',
                    msg,
                    err,
                    rootDir,
                });

                throw msg;
            }
        }),
        generateClient: createAction<{ rootDir: string }>('generate-prisma', async (_, { rootDir }) => {
            try {
                const cmd = 'npx -y prisma generate';

                await asyncExec(cmd, { cwd: rootDir });

                return 'successfully generated prisma client';
            } catch (err) {
                const msg = 'failed to sort package json';

                logger.error({
                    source: 'modules.prisma.actions.generateClient',
                    msg,
                    err,
                    rootDir,
                });

                throw msg;
            }
        }),
    },
});
