import { injectService, SingletonService, type ILoggerService, type IDataContextService } from '@lindeneg/funkallero';
import SERVICE from '@/enums/service';

class DataContextService extends SingletonService implements IDataContextService {
    @injectService(SERVICE.LOGGER)
    private readonly logger: ILoggerService;
}

export default DataContextService;
