import { SingletonService, type IMediatorService, type MediatorActionsConstraint, type MediatorSendParameters, type MediatorSendResult } from '@lindeneg/funkallero-core';
declare class BaseMediatorService<TActions extends MediatorActionsConstraint> extends SingletonService implements IMediatorService {
    private readonly actions;
    private readonly instantiatedActions;
    constructor(actions: TActions);
    send<TKey extends keyof TActions>(...[action, args]: MediatorSendParameters<TActions, TKey>): Promise<Awaited<MediatorSendResult<TActions, TKey>>>;
    private getInstantiatedAction;
}
export default BaseMediatorService;
