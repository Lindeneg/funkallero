import { join as joinPath } from 'path';
import type { ActionType } from 'node-plop';
import logger from '../logger';
import type {
    ScaffoldGeneratorModulesOptions,
    ScaffoldCustomActionsApi,
    ScaffoldGeneratorModulesRequiredOptions,
    ScaffoldGeneratorModule,
} from './types';
import type { LoggerPayload } from '../logger/types';

const customActions = (): ScaffoldCustomActionsApi => {
    const actions: Array<ActionType> = [];

    return {
        get() {
            return Object.freeze(actions);
        },
        add(...newActions: Array<ActionType | readonly ActionType[]>) {
            newActions.forEach((action) => {
                if (Array.isArray(action)) {
                    actions.push(...action);
                } else {
                    actions.push(action as ActionType);
                }
            });
        },
    };
};

export const configureGeneratorModules = <TAnswers, TOverrides extends Record<string, unknown>>({
    root,
    destPath,
    answers,
    register,
    extend,
    srcFolderName = 'src',
}: ScaffoldGeneratorModulesRequiredOptions<TAnswers, TOverrides>): [
    ScaffoldGeneratorModulesOptions<TAnswers> & TOverrides,
    ScaffoldGeneratorModule<TAnswers, TOverrides>
] => {
    const config = {
        projectRoot: root,
        projectSrc: joinPath(root, srcFolderName),
        customActions: customActions(),
        dependantModules: [],
        destPath,
        answers,
        register,
        ...extend,
    } as ScaffoldGeneratorModulesOptions<TAnswers> & TOverrides;

    return [
        config,
        (module, cb) => {
            config.dependantModules.push(module);

            cb(config);
        },
    ];
};

export const exitWithMessage = (args: LoggerPayload, exitCode = 1) => {
    logger.info(args);
    process.exit(exitCode);
};
