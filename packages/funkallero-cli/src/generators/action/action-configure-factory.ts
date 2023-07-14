import { joinPath, logger, toKebabCase, toPascalCase } from '@lindeneg/scaffold-core';
import { application } from '@/modules';
import type { ConfigureModuleFn } from './preparation';

const actionConfigureFactory = (type: 'Command' | 'Query') => (configure: ConfigureModuleFn) => {
    configure(application, (cxt) => {
        if (!cxt.answers.actionName) return;
        const name = toKebabCase(cxt.answers.actionName) + '-' + type.toLowerCase();
        const fileName = name + '.ts';
        const actionClassName = toPascalCase(cxt.answers.actionName) + type;

        let actionPath: string;
        let exportPath: string;

        if (cxt.folder) {
            actionPath = joinPath(cxt.applicationPath, cxt.folder, fileName);
            exportPath = cxt.folder + '/' + name;
        } else {
            actionPath = joinPath(cxt.applicationPath, fileName);
            exportPath = name;
        }

        const exportString = `export { default as ${actionClassName}} from './${exportPath}';`;

        logger.verbose({
            msg: 'Creating action',
            type,
            fileName,
            actionClassName,
            actionPath,
            exportString,
        });

        cxt.customActions.add(
            application.templates.action.addFile(actionPath, {
                actionClassName,
                actionResult: 'ACTION_RESULT.UNIT',
            }),
            application.actions.addExportToApplicationIndex.prepare({
                rootDir: cxt.applicationPath,
                exportString,
            })
        );
    });
};

export default actionConfigureFactory;
