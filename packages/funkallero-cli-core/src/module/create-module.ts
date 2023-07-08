import logger from '../logger';
import type { SpecificPartial, ScaffoldModule } from './types';
import type { AnyScaffoldTemplate } from '../template/types';
import type { AnyScaffoldAction } from '../action/types';

type CreateModuleConditionalProperties = 'registerDependency' | 'getRequiredDependencies';
type ScaffoldModuleConditionalProperties = 'actions' | 'helpers';

type CreateModuleConstraint<
    TTemplates extends Record<string, AnyScaffoldTemplate>,
    TActions extends Record<string, AnyScaffoldAction>
> = SpecificPartial<
    Omit<ScaffoldModule<TTemplates, TActions>, CreateModuleConditionalProperties>,
    ScaffoldModuleConditionalProperties
>;
type CreateModuleReturn<
    TTemplates extends Record<string, AnyScaffoldTemplate>,
    TActions extends Record<string, AnyScaffoldAction>,
    TModule extends CreateModuleConstraint<TTemplates, TActions>
> = Omit<TModule, 'dependencies'> &
    Pick<ScaffoldModule<TTemplates, TActions>, CreateModuleConditionalProperties | ScaffoldModuleConditionalProperties>;

const createModule = <
    TTemplates extends Record<string, AnyScaffoldTemplate>,
    TActions extends Record<string, AnyScaffoldAction>,
    TModule extends CreateModuleConstraint<TTemplates, TActions>
>({
    dependencies,
    ...rest
}: TModule): CreateModuleReturn<TTemplates, TActions, TModule> => {
    return {
        actions: {},

        helpers: {},

        ...rest,

        getRequiredDependencies() {
            return Object.freeze(dependencies);
        },

        registerDependency(...deps) {
            logger.verbose({
                msg: 'registering module dependencies',
                source: rest.name,
                deps,
            });
            dependencies.push(...deps);
        },
    };
};

export default createModule;
