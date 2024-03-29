import { createGenerator } from '@lindeneg/scaffold-core';
import { api } from '@/modules';
import preparation from './preparation';
import HELP from './help';
import configureController from './configure-controller';
import type { ControllerGeneratorAnswers } from './preparation';

const controllerGenerator = createGenerator<ControllerGeneratorAnswers>({
    name: 'controller',
    formattedName: 'API Controller',
    description: 'creates an API controller',
    enabled: true,
    help: HELP,

    modules: [api],

    async setAnswersFromArgumentVector(answers, [...controllerNames]) {
        const controllerName = controllerNames.filter((e) => !e.startsWith('--')).join(' ');
        if (controllerName) {
            answers.apiControllerName = controllerName;
        }
    },

    hasRequiredAnswers(answers) {
        return !!answers.apiControllerName;
    },

    async setAnswersFromInquirer(answers, prompt) {
        if (!answers.apiControllerName) {
            answers.apiControllerName = (
                await prompt({
                    type: 'input',
                    name: 'controllerName',
                    message: 'Controller Name',
                })
            ).controllerName;
        }
    },

    async getActionsFromAnswers(...args) {
        const [cxt, configureModule] = preparation(...args);

        configureController(configureModule);

        return cxt.customActions.get();
    },
});

export default controllerGenerator;
