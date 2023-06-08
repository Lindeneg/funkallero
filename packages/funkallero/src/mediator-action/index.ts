import { SERVICE, BaseMediatorAction, injectService, type IDataContextService } from '@lindeneg/funkallero-core';

class MediatorAction<TDataContext extends IDataContextService> extends BaseMediatorAction {
    @injectService(SERVICE.DATA_CONTEXT)
    protected readonly dataContext: TDataContext;
}

export default MediatorAction;
