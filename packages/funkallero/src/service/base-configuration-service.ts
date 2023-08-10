import { SingletonService, type IConfigurationService } from '@lindeneg/funkallero-core';

class BaseConfigurationService<TMeta extends IConfigurationService['meta'] = IConfigurationService['meta']>
    extends SingletonService
    implements IConfigurationService
{
    public readonly port: IConfigurationService['port'];
    public readonly basePath: IConfigurationService['basePath'];
    public readonly logLevel: IConfigurationService['logLevel'];
    public readonly https: IConfigurationService['https'];
    public readonly versioning: IConfigurationService['versioning'];
    public readonly globalHeaders: IConfigurationService['globalHeaders'];
    public readonly meta: TMeta;
}

export default BaseConfigurationService;
