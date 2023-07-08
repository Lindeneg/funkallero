import logger from '../logger';
import type { AnyScaffoldModule } from './types';
import type { ScaffoldPackageDependency } from '../package-manager/types';

const getModuleDependenciesIfEnabled = (
    module: Omit<AnyScaffoldModule, 'dependencies'>
): readonly ScaffoldPackageDependency[] => {
    if (!module.enabled) {
        logger.warning({
            msg: 'trying to use disabled module',
            source: 'utils.getModuleDependencies',
            module: module.name,
        });

        return [];
    }

    return module.getRequiredDependencies();
};

type ModulePromptConstraint = Pick<AnyScaffoldModule, 'name' | 'formattedName' | 'enabled'>;

const createModulePrompt = (mod: ModulePromptConstraint | [ModulePromptConstraint, 'checked' | 'unchecked']) => {
    let module: ModulePromptConstraint;
    let checked = false;

    if (Array.isArray(mod)) {
        module = mod[0];
        checked = mod[1] === 'checked';
    } else {
        module = mod;
    }

    return {
        name: module.formattedName,
        value: module.name,
        disabled: !module.enabled,
        checked,
    };
};

export const getModuleDependencies = (
    modules: AnyScaffoldModule[],
    ...extraDeps: ScaffoldPackageDependency[]
): ScaffoldPackageDependency[] => {
    return modules.reduce((arr, mod) => arr.concat(getModuleDependenciesIfEnabled(mod)), [...extraDeps]);
};

export const modulePrompt = (
    ...modules: Array<ModulePromptConstraint | [ModulePromptConstraint, 'checked' | 'unchecked']>
) => {
    return modules.map(createModulePrompt);
};
