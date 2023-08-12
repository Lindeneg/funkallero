import { MediatorService as BaseMediatorService } from '@lindeneg/funkallero';
import * as application from '../application';

class MediatorService extends BaseMediatorService<typeof application> {
    constructor() {
        super(application);
    }
}

export default MediatorService;
