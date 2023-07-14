import { createGenerator, concatActions, formatWithPrettier } from '@lindeneg/scaffold-core';
import { application } from '@/modules';
import preparation from './preparation';
import actionHelpFactory from './action-help-factory';
import actionConfigureFactory from './action-configure-factory';
import type { ActionGeneratorAnswers } from './preparation';

const actionGeneratorFactory = (type: 'Command' | 'Query') =>
    createGenerator<ActionGeneratorAnswers>({
        name: type.toLowerCase(),
        formattedName: 'Mediator ' + type,
        description: `creates a mediator ${type.toLowerCase()} action`,
        enabled: true,
        help: actionHelpFactory(type),

        modules: [application],

        async setAnswersFromArgumentVector(answers, [actionName, ...args]) {
            let name = actionName || '';
            let flags: string[] = [];
            let hasPushedInitialFlag = false;

            for (const arg of args) {
                const isFlag = arg.startsWith('--');

                if (!isFlag && !hasPushedInitialFlag) {
                    name += ' ' + arg;
                }

                if (isFlag || hasPushedInitialFlag) {
                    if (!hasPushedInitialFlag) hasPushedInitialFlag = true;
                    flags.push(arg);
                }
            }

            answers.applicationActionName = name;
            answers.flags = flags;
        },

        hasRequiredAnswers(answers) {
            return !!answers.applicationActionName;
        },

        async setAnswersFromInquirer(answers, prompt) {
            if (!answers.applicationActionName) {
                answers.applicationActionName = (
                    await prompt({
                        type: 'input',
                        name: 'actionName',
                        message: type + ' Name',
                    })
                ).actionName;
            }

            answers.flags = answers.flags || [];

            if (answers.flags.length === 0) {
                const folder = (
                    await prompt({
                        type: 'input',
                        name: 'folder',
                        message: 'Folder Name',
                    })
                ).folder;

                answers.flags.push('--folder', folder);
            }
        },

        async getActionsFromAnswers(...args) {
            const [cxt, configureModule] = preparation(...args);

            actionConfigureFactory(type)(configureModule);

            return concatActions(
                cxt.customActions.get(),

                formatWithPrettier.prepare({
                    dirPath: cxt.applicationPath,
                })
            );
        },
    });

export default actionGeneratorFactory;
