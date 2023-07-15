import { createGenerator } from '@lindeneg/scaffold-core';
import { baseServices } from '@/modules';
import preparation from './preparation';
import serviceHelpFactory from './service-help-factory';
import serviceConfigureFactory from './service-configure-factory';
import type { ServiceGeneratorAnswers, ServiceType } from './preparation';

const serviceGeneratorFactory = (type: ServiceType) => {
    const name = type === 'SingletonService' ? 'singleton' : 'scoped';

    return createGenerator<ServiceGeneratorAnswers>({
        name,
        formattedName: type,
        description: `creates a ${name} service`,
        enabled: true,
        help: serviceHelpFactory(type),

        modules: [baseServices],

        async setAnswersFromArgumentVector(answers, [...actionNames]) {
            const name = actionNames.filter((e) => !e.startsWith('--')).join(' ');
            if (name) {
                answers.name = name;
            }
        },

        hasRequiredAnswers(answers) {
            return !!answers.name;
        },

        async setAnswersFromInquirer(answers, prompt) {
            if (!answers.name) {
                answers.name = (
                    await prompt({
                        type: 'input',
                        name: 'name',
                        message: 'Service Name',
                    })
                ).name;
            }
        },

        async getActionsFromAnswers(...args) {
            const [cxt, configureModule] = preparation(...args);

            serviceConfigureFactory(type)(configureModule);

            return cxt.customActions.get();
        },
    });
};

export default serviceGeneratorFactory;
