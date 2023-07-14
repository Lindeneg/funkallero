import { joinPath, logger, toKebabCase, toPascalCase } from '@lindeneg/scaffold-core';
import { api } from '@/modules';
import type { ConfigureModuleFn } from './preparation';

const configureController = (configure: ConfigureModuleFn) => {
    configure(api, (cxt) => {
        if (!cxt.answers.apiControllerName) return;
        const controllerName = toPascalCase(cxt.answers.apiControllerName);
        const name = toKebabCase(cxt.answers.apiControllerName) + '-controller';
        const fileName = name + '.ts';
        const filePath = joinPath(cxt.apiPath, fileName);

        logger.verbose({
            msg: 'Creating api controller',
            controllerName,
            name,
            filePath,
            fileName,
        });

        cxt.customActions.add(
            api.templates.controller.addFile(filePath, {
                controllerName,
                handler: 'getSomething',
            }),
            api.actions.addControllerImportToMainIndex.prepare({
                rootDir: cxt.projectSrc,
                importString: `import '@/api/${name}';`,
            })
        );
    });
};

export default configureController;
