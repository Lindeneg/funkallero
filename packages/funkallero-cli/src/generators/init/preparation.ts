import {
    joinPath,
    configureGeneratorModules,
    toKebabCase,
    parseOptionals,
    packageManager,
    type ScaffoldRegister,
} from '@lindeneg/scaffold-core';

const preparation = (destPath: string, answers: Partial<InitGeneratorAnswers>, register: ScaffoldRegister) => {
    const root = joinPath(destPath, toKebabCase(String(answers.name)));
    const hasProperty = parseOptionals(answers.optionals, true);
    return configureGeneratorModules({
        destPath,
        root,
        answers,
        register,
        extend: {
            hasProperty,
            packageJsonPath: joinPath(root, 'package.json'),
            manager: hasProperty.npm ? packageManager.npm : packageManager.yarn,
        },
    });
};

export interface InitGeneratorAnswers {
    name: string;
    optionals: string[];
}

export type ConfigureModuleFn = ReturnType<typeof preparation>[1];

export default preparation;
