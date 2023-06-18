import { META_DATA, type Constructor, type IBaseService, type IServiceInjection } from '@lindeneg/funkallero-core';
import devLogger from '../dev-logger';

const baseInjectionRegex = /^Base[a-zA-Z]+Service|Action$/;

export interface IDependencyInjection {
    inject(): Promise<any>;
}

abstract class DependencyInjection implements IDependencyInjection {
    public abstract inject(...args: any[]): Promise<any>;

    protected getServiceInjections(Service: Constructor<IBaseService>) {
        const injections = [...this.getBaseServiceInjection(Service), ...this.getSpecificInjections(Service)];
        return this.filterServiceKeys(injections);
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
        for (const key of keys) {
            if (baseInjectionRegex.test(key)) {
                const baseInjections = this.getSpecificInjections(Service, key);

                devLogger('found base injection for target', Service.name, baseInjections);

                return baseInjections;
            }
        }
        return [];
    }

    private getSpecificInjections(Service: Constructor<IBaseService>, name?: string) {
        const key = name || Service.name;
        const serviceInjections = Reflect.get(Service.prototype, META_DATA.SERVICE_INJECTION);
        const specificInjections = serviceInjections ? serviceInjections[key] : [];

        return specificInjections || [];
    }
}

export default DependencyInjection;
