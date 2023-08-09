import { MediatorAction } from '@lindeneg/funkallero';
import type DataContextService from '@/services/data-context-service';

class BaseAction extends MediatorAction<DataContextService> {}

export default BaseAction;
