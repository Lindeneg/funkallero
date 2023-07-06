import { SingletonService, type IConfigurationService } from '@lindeneg/funkallero-core';
declare class BaseConfigurationService extends SingletonService implements IConfigurationService {
    readonly port: IConfigurationService['port'];
    readonly basePath: IConfigurationService['basePath'];
    readonly logLevel: IConfigurationService['logLevel'];
    readonly https: IConfigurationService['https'];
    readonly meta: IConfigurationService['meta'];
}
export default BaseConfigurationService;
