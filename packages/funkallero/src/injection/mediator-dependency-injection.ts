import { devLogger, SERVICE_TYPE, isServiceType, type BaseMediatorAction } from '@lindeneg/funkallero-core';
import SingletonInjectionError from '../errors/singleton-injection-error';
import DependencyInjection from './dependency-injection';
import serviceContainer from '../container/service-container';

class MediatorActionDependencyInjection extends DependencyInjection {
    private readonly Action: typeof BaseMediatorAction;
    private readonly action: BaseMediatorAction;

    constructor(action: typeof BaseMediatorAction) {
        super();
        this.Action = action;
        this.action = new this.Action();
    }

    public async inject() {
        const injections = this.getServiceInjections(this.Action);

        for (const injection of injections) {
            const injectedService = serviceContainer.getService<any>(injection.serviceKey);

            if (injectedService) {
                if (isServiceType(injectedService, SERVICE_TYPE.SCOPED)) {
                    throw new SingletonInjectionError(injection.serviceKey, this.Action.name);
                }

                devLogger(`injecting ${injectedService.constructor.name} into ${this.Action.name}`);

                (this.action as any)[injection.instanceMember] = injectedService;
            }
        }

        return this.action;
    }
}

export default MediatorActionDependencyInjection;
