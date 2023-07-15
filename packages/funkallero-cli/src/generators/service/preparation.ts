import { joinPath, configureGeneratorModules, type ScaffoldRegister } from '@lindeneg/scaffold-core';

const preparation = (destPath: string, answers: Partial<ServiceGeneratorAnswers>, register: ScaffoldRegister) => {
    const servicesPath = joinPath(destPath, 'src', 'services');
    const enumPath = joinPath(destPath, 'src', 'enums');

    return configureGeneratorModules({
        destPath,
        root: destPath,
        answers,
        register,
        extend: {
            servicesPath,
            enumPath,
        },
    });
};

export interface ServiceGeneratorAnswers {
    name: string;
}

export type ConfigureModuleFn = ReturnType<typeof preparation>[1];

export type ServiceType = 'SingletonService' | 'ScopedService';

export default preparation;
