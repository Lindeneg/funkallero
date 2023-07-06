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
type HttpsConfigCore = IHttpsConfiguration | null;
type HttpsConfigFn = () => Promisify<IHttpsConfiguration>;
type HttpsConfigUnion = HttpsConfigCore | HttpsConfigFn;
interface IConfigurationService<THttps extends HttpsConfigUnion = HttpsConfigCore> {
    readonly basePath: string;
    readonly port: number;
    readonly logLevel: LogLevelUnion;
    readonly https: THttps;
    readonly meta: Record<string, any>;
}
export interface IFunkalleroConfiguration extends IConfigurationService<HttpsConfigUnion>, IConfigurationCallback {
}
export interface IFunkalleroPartialConfiguration extends Partial<IConfigurationService<HttpsConfigUnion>>, IConfigurationCallback {
}
export default IConfigurationService;
