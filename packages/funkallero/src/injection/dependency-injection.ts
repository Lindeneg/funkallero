import type { Constructor, IBaseService, Injection } from '@lindeneg/funkallero-core';
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

    protected filterServiceKeys(injections: Injection[]): Injection[] {
        const seen: string[] = [];

        return injections.filter((injection) => {
            if (seen.includes(injection.serviceKey)) return false;

            seen.push(injection.serviceKey);

            return true;
        });
    }

    private getBaseServiceInjection(Service: Constructor<IBaseService>) {
        const keys = Service.prototype.injection ? Object.keys(Service.prototype.injection) : [];
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
        const key = name ? name : Service.name;
        const specificInjections = Service.prototype.injection ? Service.prototype.injection[key] : [];

        return specificInjections || [];
    }
}

export default DependencyInjection;
