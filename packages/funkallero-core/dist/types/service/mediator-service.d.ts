import SingletonService from './singleton-service';
import type IBaseService from './base-service';
type BaseMediatorSendParameters<TActions extends MediatorActionsConstraint, TKey extends keyof TActions> = [
    action: TKey
];
type MediatorActionInstanceType<TActions extends MediatorActionsConstraint, TKey extends keyof TActions> = InstanceType<TActions[TKey]>;
type MediatorActionCustomParameters<TActions extends MediatorActionsConstraint, TKey extends keyof TActions> = Parameters<MediatorActionInstanceType<TActions, TKey>['execute']>[0];
type AdditionalSendParameters<TActions extends MediatorActionsConstraint, TKey extends keyof TActions> = MediatorActionCustomParameters<TActions, TKey> extends undefined ? [] : [args: MediatorActionCustomParameters<TActions, TKey>];
export type MediatorActionsConstraint = Record<string, typeof BaseMediatorAction>;
export type MediatorSendParameters<TActions extends MediatorActionsConstraint, TKey extends keyof TActions> = [
    ...BaseMediatorSendParameters<TActions, TKey>,
    ...AdditionalSendParameters<TActions, TKey>
];
export type MediatorSendResult<TActions extends MediatorActionsConstraint, TKey extends keyof TActions> = Awaited<ReturnType<MediatorActionInstanceType<TActions, TKey>['execute']>>;
export type MediatorResult<TValue = any> = IMediatorResultSuccess<TValue> | IMediatorResultFailure;
export interface IMediatorResultSuccess<TValue> {
    success: true;
    value: TValue;
    context?: any;
}
export interface IMediatorResultFailure {
    success: false;
    error: string;
    context?: any;
}
export declare class MediatorResultSuccess<TValue> implements IMediatorResultSuccess<TValue> {
    success: true;
    value: TValue;
    context?: any;
    constructor(value: TValue, context?: any);
}
export declare class MediatorResultFailure implements IMediatorResultFailure {
    success: false;
    error: string;
    context?: any;
    constructor(err: string, context?: any);
}
export declare class BaseMediatorAction extends SingletonService implements IBaseService {
    execute(..._: unknown[]): Promise<MediatorResult>;
}
interface IMediatorService {
    send(...args: any[]): Promise<MediatorSendResult<any, any>>;
}
export default IMediatorService;
