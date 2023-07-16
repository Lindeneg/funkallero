import { SingletonService, type IConfigurationService } from '@lindeneg/funkallero-core';

class BaseConfigurationService extends SingletonService implements IConfigurationService {
    public readonly port: IConfigurationService['port'];
    public readonly basePath: IConfigurationService['basePath'];
    public readonly logLevel: IConfigurationService['logLevel'];
    public readonly https: IConfigurationService['https'];
    public readonly globalHeaders: IConfigurationService['globalHeaders'];
    public readonly meta: IConfigurationService['meta'];
}

export default BaseConfigurationService;
