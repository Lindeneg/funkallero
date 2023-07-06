import { BaseMediatorAction, type IDataContextService } from '@lindeneg/funkallero-core';
declare class MediatorAction<TDataContext extends IDataContextService> extends BaseMediatorAction {
    protected readonly dataContext: TDataContext;
}
export default MediatorAction;
