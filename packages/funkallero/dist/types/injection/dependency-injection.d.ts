import { type Constructor, type IBaseService, type IServiceInjection } from '@lindeneg/funkallero-core';
export interface IDependencyInjection {
    inject(): Promise<any>;
}
declare abstract class DependencyInjection implements IDependencyInjection {
    private static injectionCache;
    abstract inject(...args: any[]): Promise<any>;
    protected getServiceInjections(Service: Constructor<IBaseService>): IServiceInjection[];
    protected filterServiceKeys(injections: IServiceInjection[]): IServiceInjection[];
    private getBaseServiceInjection;
    private getSpecificInjections;
}
export default DependencyInjection;
