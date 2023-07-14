import { joinPath, configureGeneratorModules, getFlagValue, type ScaffoldRegister } from '@lindeneg/scaffold-core';

const preparation = (destPath: string, answers: Partial<ActionGeneratorAnswers>, register: ScaffoldRegister) => {
    const applicationPath = joinPath(destPath, 'src', 'application');

    return configureGeneratorModules({
        destPath,
        root: destPath,
        answers,
        register,
        extend: {
            applicationPath,
            folder: getFlagValue('folder', answers.flags),
        },
    });
};

export interface ActionGeneratorAnswers {
    actionName: string;
    flags?: string[];
}

export type ConfigureModuleFn = ReturnType<typeof preparation>[1];

export default preparation;
