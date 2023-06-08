import {
    SingletonService,
    type BaseMediatorAction,
    type IMediatorService,
    type MediatorActionsConstraint,
    type MediatorSendParameters,
    type MediatorSendResult,
} from '@lindeneg/funkallero-core';
import MediatorActionDependencyInjection from '../injection/mediator-dependency-injection';
import devLogger from '../dev-logger';

class BaseMediatorService<TActions extends MediatorActionsConstraint>
    extends SingletonService
    implements IMediatorService
{
    private readonly actions: TActions;
    private readonly instantiatedActions: Map<keyof TActions, BaseMediatorAction>;

    constructor(actions: TActions) {
        super();
        this.actions = actions;
        this.instantiatedActions = new Map();
    }

    public async send<TKey extends keyof TActions>(
        ...[action, args]: MediatorSendParameters<TActions, TKey>
    ): Promise<Awaited<MediatorSendResult<TActions, TKey>>> {
        const instantiatedAction = await this.getInstantiatedAction(action);

        devLogger(`executing mediator action ${instantiatedAction.constructor.name} with payload`, args);

        return instantiatedAction.execute(args) as Promise<Awaited<MediatorSendResult<TActions, TKey>>>;
    }

    private async getInstantiatedAction<TKey extends keyof TActions>(action: TKey) {
        let instantiatedAction = this.instantiatedActions.get(action);

        if (!instantiatedAction) {
            instantiatedAction = await new MediatorActionDependencyInjection(this.actions[action]).inject();
            this.instantiatedActions.set(action, instantiatedAction);
        }

        return instantiatedAction;
    }
}

export default BaseMediatorService;
