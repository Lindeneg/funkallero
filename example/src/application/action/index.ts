import { MediatorAction } from '@lindeneg/funkallero';
import type DataContextService from '../../services/data-context-service';

class Action extends MediatorAction<DataContextService> {
    protected createUpdatePayload<T extends Record<string, unknown>>(obj: T) {
        const payload = Object.entries(obj).reduce((acc, [key, value]) => {
            if (typeof value !== 'undefined') acc[key] = value;
            return acc;
        }, {} as Record<string, unknown>);

        return payload as T;
    }
}

export default Action;
