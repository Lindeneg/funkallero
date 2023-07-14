import { joinPath, configureGeneratorModules, type ScaffoldRegister } from '@lindeneg/scaffold-core';

const preparation = (destPath: string, answers: Partial<ActionGeneratorAnswers>, register: ScaffoldRegister) => {
    const apiPath = joinPath(destPath, 'src', 'api');

    return configureGeneratorModules({
        destPath,
        root: destPath,
        answers,
        register,
        extend: {
            apiPath,
        },
    });
};

export interface ActionGeneratorAnswers {
    apiControllerName: string;
}

export type ConfigureModuleFn = ReturnType<typeof preparation>[1];

export default preparation;
