import {
    devLogger,
    META_DATA,
    type Constructor,
    type IBaseService,
    type IServiceInjection,
} from '@lindeneg/funkallero-core';

const baseInjectionRegex = /^Base[a-zA-Z]+Service|Action|Controller$/;

export interface IDependencyInjection {
    inject(): Promise<any>;
}

abstract class DependencyInjection implements IDependencyInjection {
    private static injectionCache: Map<string, IServiceInjection[]> = new Map();

    public abstract inject(...args: any[]): Promise<any>;

    protected getServiceInjections(Service: Constructor<IBaseService>) {
        const cached = DependencyInjection.injectionCache.get(Service.name);

        if (cached) return cached;

        const injections = [...this.getBaseServiceInjection(Service), ...this.getSpecificInjections(Service)];
        const filteredInjections = this.filterServiceKeys(injections);

        DependencyInjection.injectionCache.set(Service.name, filteredInjections);

        return filteredInjections;
    }

    protected filterServiceKeys(injections: IServiceInjection[]): IServiceInjection[] {
        const seen: string[] = [];

        return injections.filter((injection) => {
            if (seen.includes(injection.serviceKey)) return false;

            seen.push(injection.serviceKey);

            return true;
        });
    }

    private getBaseServiceInjection(Service: Constructor<IBaseService>) {
        const serviceInjections = Reflect.get(Service.prototype, META_DATA.SERVICE_INJECTION);
        const keys = serviceInjections ? Object.keys(serviceInjections) : [];
        const injections = [];
        for (const key of keys) {
            if (baseInjectionRegex.test(key)) {
                const baseInjections = this.getSpecificInjections(Service, key);

                devLogger('found base injection for target', Service.name, baseInjections);

                injections.push(...baseInjections);
            }
        }
        return injections;
    }

    private getSpecificInjections(Service: Constructor<IBaseService>, name?: string) {
        const key = name || Service.name;
        const serviceInjections = Reflect.get(Service.prototype, META_DATA.SERVICE_INJECTION);
        const specificInjections = serviceInjections ? serviceInjections[key] : [];

        return specificInjections || [];
    }
}

export default DependencyInjection;
