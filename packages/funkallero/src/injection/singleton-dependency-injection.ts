import {
    devLogger,
    SERVICE_TYPE,
    isServiceType,
    type IServiceInjection,
    type Constructor,
    type ISingletonService,
} from '@lindeneg/funkallero-core';
import serviceContainer, {
    getUninstantiatedSingletons,
    registerInstantiatedSingletonService,
} from '../container/service-container';
import DependencyInjection from './dependency-injection';
import SingletonInjectionError from '../errors/singleton-injection-error';

class SingletonDependencyInjection extends DependencyInjection {
    private readonly mappedSingletonServices: Map<
        string,
        { injections: IServiceInjection[]; service: Constructor<ISingletonService> }
    > = new Map();

    public async inject(): Promise<void> {
        await this.prepare();

        for (const [_, { injections, service }] of this.mappedSingletonServices) {
            for (const injection of injections) {
                const injectedService = serviceContainer.getService<any>(injection.serviceKey);

                if (isServiceType(injectedService, SERVICE_TYPE.SINGLETON)) {
                    devLogger(`injecting ${injectedService.constructor.name} into ${service.constructor.name}`);

                    (service as any)[injection.instanceMember] = injectedService;
                } else {
                    throw new SingletonInjectionError(injection.serviceKey, service.constructor.name);
                }
            }
        }
    }

    private async prepare() {
        const uninstantiatedSingletons = await this.getFilteredUninstantiatedSingletons();
        for (const [serviceKey, Service] of uninstantiatedSingletons) {
            const service = new (Service as any)();
            const injections = this.getServiceInjections(Service);

            this.mappedSingletonServices.set(serviceKey, {
                injections,
                service,
            });

            registerInstantiatedSingletonService(serviceKey, service);
        }
    }

    private async getFilteredUninstantiatedSingletons() {
        const filteredMap = new Map<string, Constructor<ISingletonService>>();
        const uninstantiatedSingletons = getUninstantiatedSingletons();

        for (const [serviceKey, Service] of uninstantiatedSingletons) {
            try {
                if (filteredMap.has(serviceKey)) {
                    continue;
                }

                serviceContainer.getService(serviceKey);
            } catch (err) {
                filteredMap.set(serviceKey, Service);
            }
        }

        return filteredMap.entries();
    }
}

export default SingletonDependencyInjection;
