import type { DynamicPromptsFunction, CustomActionFunction, ActionType } from 'node-plop';
import type { ScaffoldCore, ScaffoldRegister, AnyScaffoldModule } from '../module/types';

export type AnyScaffoldGenerator = ScaffoldGenerator<any>;

export interface ScaffoldGenerator<TAnswers extends AnyScaffoldAnswers> extends Required<ScaffoldCore> {
    modules: AnyScaffoldModule[];

    setAnswersFromArgumentVector(answers: Partial<TAnswers>, argv: ReadonlyArray<string>): Promise<void>;

    hasRequiredAnswers(answers: Partial<TAnswers>): boolean | Promise<boolean>;

    setAnswersFromInquirer(
        answers: Partial<TAnswers>,
        prompt: Parameters<DynamicPromptsFunction>[0]['prompt']
    ): Promise<void>;

    getActionsFromAnswers(
        destinationPath: string,
        answers: Partial<TAnswers>,
        register: ScaffoldRegister
    ): Promise<readonly ActionType[]>;
}
export type AnyScaffoldAnswers = Parameters<CustomActionFunction>[0];

export type ScaffoldCustomActionsApi = {
    get(): ReadonlyArray<ActionType>;
    add(...newActions: Array<ActionType | readonly ActionType[]>): void;
};

export interface ScaffoldGeneratorModulesOptions<TAnswers> {
    destPath: string;
    projectRoot: string;
    projectSrc: string;
    customActions: ScaffoldCustomActionsApi;
    dependantModules: AnyScaffoldModule[];
    answers: Partial<TAnswers>;
    register: ScaffoldRegister;
}

export type ScaffoldGeneratorModulesRequiredOptions<TAnswers, TOverrides extends Record<string, unknown>> = {
    destPath: string;
    root: string;
    srcFolderName?: string;
    answers: Partial<TAnswers>;
    register: ScaffoldRegister;
    extend: TOverrides;
};

export type ScaffoldGeneratorModule<TAnswers, TOverrides extends Record<string, unknown>> = (
    module: AnyScaffoldModule,
    cb: (config: ScaffoldGeneratorModulesOptions<TAnswers> & TOverrides) => void
) => void;
