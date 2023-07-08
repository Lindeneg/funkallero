import type {
    NodePlopAPI,
    AddActionConfig,
    AddManyActionConfig,
    AppendActionConfig,
    ModifyActionConfig,
} from 'node-plop';
import type { AnyScaffoldAnswers } from '../generator/types';
import type { SpecificPartial } from '../module/types';

export type PlopActionsMap = {
    add: AddActionConfig;
    addMany: AddManyActionConfig;
    modify: SpecificPartial<ModifyActionConfig, 'pattern' | 'templateFile' | 'template'>;
    append: AppendActionConfig;
};

export type ScaffoldActionFn<TPayload, TAnswers = AnyScaffoldAnswers> = (
    answers: TAnswers,
    payload: TPayload,
    plop: NodePlopAPI
) => Promise<string>;

export interface ScaffoldAction<TPayload> {
    register(): [key: string, fn: ScaffoldActionFn<TPayload>];
    prepare(payload: TPayload): [TPayload & { type: string }];
}

export type AnyScaffoldAction = ScaffoldAction<any>;
