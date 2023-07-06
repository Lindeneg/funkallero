import { type IFunkalleroPartialConfiguration } from '@lindeneg/funkallero-core';
import FunkalleroBase from './funkallero-base';
declare class Funkallero extends FunkalleroBase {
    private constructor();
    start(): Promise<void>;
    private setup;
    private checkRegistryForRequiredServices;
    static create(config: IFunkalleroPartialConfiguration): Promise<Funkallero>;
}
export default Funkallero;
