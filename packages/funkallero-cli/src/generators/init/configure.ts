import { joinPath } from '@lindeneg/scaffold-core';
import * as mod from '@/modules';
import type { ConfigureModuleFn } from './preparation';

const core = (configure: ConfigureModuleFn) => {
    configure(mod.core, (cxt) => {
        const external: string[] = [];

        if (cxt.hasProperty.zod) external.push('zod');
        if (cxt.hasProperty.auth) external.push('@lindeneg/funkallero-auth-service');
        if (cxt.hasProperty.prisma) external.push('@prisma/client');

        cxt.customActions.add(
            mod.core.templates.packageJson.addFile(cxt.packageJsonPath, {
                packageManager: cxt.manager,
            }),
            mod.core.templates.tsConfig.addFile(cxt.projectRoot, {}),
            mod.core.templates.rollupConfig.addFile(cxt.projectRoot, {
                inputFile: './src/index.ts',
                outputs: [
                    {
                        file: './dist/index.mjs',
                        format: 'esm',
                        exports: 'named',
                    },
                ],
                external,
                plugins: [],
            }),
            mod.core.templates.mainIndex.addFile(cxt.projectSrc, {
                zod: cxt.hasProperty.zod,
                authentication: cxt.hasProperty.auth,
                controllerImport: "import '@/api/example-controller';",
            })
        );
    });
};

const baseServices = (configure: ConfigureModuleFn) => {
    configure(mod.baseServices, (cxt) => {
        cxt.customActions.add(
            mod.baseServices.templates.dataContextService.addFile(joinPath(cxt.projectSrc, 'services'), {
                prisma: cxt.hasProperty.prisma,
            }),
            mod.baseServices.templates.mediatorService.addFile(joinPath(cxt.projectSrc, 'services'), {}),
            mod.baseServices.templates.serviceEnum.addFile(joinPath(cxt.projectSrc, 'enums', 'service.ts'), {})
        );
    });
};

const api = (configure: ConfigureModuleFn) => {
    configure(mod.api, (cxt) => {
        cxt.customActions.add(
            mod.api.templates.baseController.addFile(joinPath(cxt.projectSrc, 'api'), {}),
            mod.api.templates.controller.addFile(joinPath(cxt.projectSrc, 'api', 'example-controller.ts'), {
                controllerName: 'Example',
                handler: 'getExamples',
                handlerReturn: "this.mediator.send('GetExamplesQuery');",
                controllerPath: 'example',
            })
        );
    });
};

const application = (configure: ConfigureModuleFn) => {
    configure(mod.application, (cxt) => {
        cxt.customActions.add(
            mod.application.templates.baseAction.addFile(
                joinPath(cxt.projectSrc, 'application', 'base-action', 'index.ts'),
                {}
            ),
            mod.application.templates.action.addFile(
                joinPath(cxt.projectSrc, 'application', 'example', 'get-examples-query.ts'),
                {
                    actionClassName: 'GetExamplesQuery',
                    actionResult: "['data-1', 'data-2', 'data-3']",
                }
            ),
            mod.application.templates.indexFile.addFile(joinPath(cxt.projectSrc, 'application'), {
                exports: [
                    {
                        name: 'GetExamplesQuery',
                        path: './example/get-examples-query',
                    },
                ],
            })
        );
    });
};

const prisma = (configure: ConfigureModuleFn) => {
    configure(mod.prisma, (cxt) => {
        cxt.customActions.add(
            mod.prisma.actions.init.prepare({ rootDir: cxt.projectRoot }),
            mod.prisma.actions.generateClient.prepare({ rootDir: cxt.projectRoot })
        );
    });
};

const zod = (configure: ConfigureModuleFn) => {
    configure(mod.zod, (cxt) => {});
};

const auth = (configure: ConfigureModuleFn) => {
    configure(mod.authServices, (cxt) => {
        cxt.customActions.add(
            mod.authServices.templates.authentication.addFile(joinPath(cxt.projectSrc, 'services'), {}),
            mod.authServices.templates.authorization.addFile(joinPath(cxt.projectSrc, 'services'), {})
        );
    });
};

export default {
    core,
    baseServices,
    api,
    application,
    prisma,
    zod,
    auth,
};
