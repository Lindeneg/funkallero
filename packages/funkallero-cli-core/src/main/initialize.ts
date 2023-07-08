import type { NodePlopAPI, ActionType } from 'node-plop';
import { registerPlopAction, registerPlopHelper } from './context';
import logger from '../logger';
import * as commonActions from '../action/common-actions';
import * as commonHelpers from '../template/common-helpers';
import { hasFlag } from '../argv-flags/logic';
import type { AnyScaffoldGenerator, AnyScaffoldAnswers } from '../generator/types';
import type { AnyScaffoldAction } from '../action/types';
import type { ScaffoldRegister } from '../module/types';

const initializeGeneratorModules = (plop: NodePlopAPI, generator: AnyScaffoldGenerator) => {
    generator.modules.forEach((mod) => {
        if (!mod.enabled) {
            logger.warning({
                msg: 'do not use disabled modules',
                source: 'main.initializeGeneratorModules',
                module: mod.name,
            });
            return;
        }

        logger.verbose({
            msg: 'initializing module',
            source: 'main.initializeGeneratorModules',
            module: mod.name,
        });

        Object.entries(mod.helpers).forEach(([key, val]) => {
            registerPlopHelper(plop, key, val);
        });

        Object.entries(mod.actions).forEach(([, val]) => {
            registerPlopAction(plop, (<AnyScaffoldAction>val).register);
        });
    });
};

export const initializeCommonActions = (plop: NodePlopAPI): void => {
    logger.verbose({
        msg: 'Initializing common actions',
        source: 'main.initializeCommonActions',
        data: Object.keys(commonActions),
    });

    Object.values(commonActions).forEach((commonAction) => {
        registerPlopAction(plop, commonAction.register);
    });
};

export const initializeCommonHelpers = (plop: NodePlopAPI): void => {
    logger.verbose({
        msg: 'Initializing common helpers',
        source: 'main.initializeCommonHelpers',
        data: Object.keys(commonHelpers),
    });

    Object.keys(commonHelpers).forEach((key) => {
        registerPlopHelper(plop, key, commonHelpers[<keyof typeof commonHelpers>key]);
    });
};

export const initializeScaffoldRegister = (plop: NodePlopAPI): ScaffoldRegister => {
    return {
        partial(key, partial) {
            plop.setPartial(key, partial);

            logger.verbose({
                msg: 'Registering handlebar partial',
                source: 'main.register.partial',
                key,
                partial,
            });
        },
        helper(key, helper) {
            registerPlopHelper(plop, key, helper);
        },
    };
};

export const initializeGenerator = (
    plop: NodePlopAPI,
    destPath: string,
    argv: string[],
    register: ScaffoldRegister,
    generator: AnyScaffoldGenerator
): void => {
    logger.verbose({
        msg: 'Initializing plop generator',
        source: 'main.initializeGenerator',
        generator: generator.name,
    });

    let actions: readonly ActionType[] | null = null;

    const setActionTypes = async (answers: AnyScaffoldAnswers) => {
        if (!answers || Object.keys(answers).length === 0) return;

        actions = await generator.getActionsFromAnswers(destPath, answers, register);
    };

    plop.setGenerator(generator.name, {
        description: generator.description,

        async prompts(inquirer) {
            if (hasFlag('help')) {
                logger.info({
                    msg: generator.help,
                });

                return {};
            }

            initializeGeneratorModules(plop, generator);

            const answers: AnyScaffoldAnswers = {};

            await generator.setAnswersFromArgumentVector(answers, argv);

            if (generator.hasRequiredAnswers(answers)) {
                await setActionTypes(answers);
                return answers;
            }

            await generator.setAnswersFromInquirer(answers, inquirer.prompt);

            await setActionTypes(answers);

            return answers;
        },

        actions(answers) {
            if (hasFlag('dry-run')) {
                logger.verbose({
                    msg: 'dry run detected, no actions dispatched',
                    source: 'main.initializeGenerator.actions',
                    answers,
                    actions,
                });
                return [];
            }

            if (!actions || actions.length === 0) {
                logger.warning({
                    msg: 'no actions detected, doing nothing',
                    source: 'main.initializeGenerator.actions',
                    answers,
                });
                return [];
            }

            logger.verbose({
                msg: 'dispatching actions from answers',
                source: 'main.initializeGenerator.actions',
                answers,
                actions,
            });

            return [...actions];
        },
    });
};
