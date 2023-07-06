import { type BaseMediatorAction } from '@lindeneg/funkallero-core';
import DependencyInjection from './dependency-injection';
declare class MediatorActionDependencyInjection extends DependencyInjection {
    private readonly Action;
    private readonly action;
    constructor(action: typeof BaseMediatorAction);
    inject(): Promise<BaseMediatorAction>;
}
export default MediatorActionDependencyInjection;
