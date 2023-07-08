import type { HelperDelegate as HandlebarHelperFn } from 'handlebars';
import type { AnyScaffoldAction } from '../action/types';
import type { AnyScaffoldTemplate } from '../template/types';
import type { ScaffoldPackageDependency } from '../package-manager/types';

export type SpecificPartial<TObj, TKey extends keyof TObj> = Partial<Pick<TObj, TKey>> & Omit<TObj, TKey>;

export interface ScaffoldCore {
    readonly name: string;
    readonly formattedName?: string;
    readonly help?: string;
    readonly description: string;
    enabled: boolean;
}

export interface ScaffoldRegister {
    helper: (key: string, helper: HandlebarHelperFn) => void;
    partial: (key: string, partial: string) => void;
}

export interface ScaffoldModule<
    TTemplates extends Record<string, AnyScaffoldTemplate>,
    TActions extends Record<string, AnyScaffoldAction>
> extends ScaffoldCore {
    readonly templates: TTemplates;

    readonly actions: TActions;

    readonly dependencies: ScaffoldPackageDependency[];

    readonly helpers: Record<string, HandlebarHelperFn>;

    registerDependency(...deps: ScaffoldPackageDependency[]): void;
    getRequiredDependencies(): ReadonlyArray<ScaffoldPackageDependency>;
}

export type AnyScaffoldModule = Omit<ScaffoldModule<any, any>, 'dependencies'>;
export type AnyScaffoldModuleWithDeps = ScaffoldModule<any, any>;
