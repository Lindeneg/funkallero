import type { LogLevelUnion } from '../enums/log-level';
import type { Promisify } from '../types';
import type { PublicServiceGetter, PublicServiceRegister } from '../core/public-service';

interface IConfigurationCallback {
    setup(service: PublicServiceRegister): Promisify<void>;
    startup?(service: PublicServiceGetter): Promisify<void>;
}

export interface IHttpsConfiguration {
    readonly key: string;
    readonly cert: string;
}

interface IConfigurationService {
    readonly basePath: string;
    readonly port: number;
    readonly logLevel: LogLevelUnion;
    readonly https: IHttpsConfiguration | null;
    readonly meta: Record<string, any>;
}

export interface IFunkalleroConfiguration extends IConfigurationService, IConfigurationCallback {}
export interface IFunkalleroPartialConfiguration extends Partial<IConfigurationService>, IConfigurationCallback {}

export default IConfigurationService;
