import {
    devLogger,
    SERVICE,
    SERVICE_TYPE,
    isServiceType,
    type IScopedService,
    type IServiceInjection,
    type Constructor,
    type Request,
    type Response,
    type IControllerService,
} from '@lindeneg/funkallero-core';
import DependencyInjection from './dependency-injection';
import serviceContainer from '../container/service-container';

type ControllerOptions = {
    response: Response;
    hasAuthPolicies: boolean;
} | null;

class ScopedDependencyInjection<TService extends IScopedService | IControllerService> extends DependencyInjection {
    private readonly Service: Constructor<TService>;
    private readonly request: Request;
    private readonly controllerOptions: ControllerOptions;
    private readonly scopedServices: Map<string, IScopedService>;
    private readonly filteredServiceInjections: IServiceInjection[];

    constructor(
        request: Request,
        Service: Constructor<TService>,
        scopedServices: Map<string, IScopedService>,
        controllerOptions: ControllerOptions = null
    ) {
        super();
        this.Service = Service;
        this.scopedServices = scopedServices;
        this.request = request;
        this.controllerOptions = controllerOptions;
        this.filteredServiceInjections = this.getServiceInjections(this.Service);
    }

    public async inject(): Promise<TService> {
        await this.prepare();

        const service = new this.Service();
        (service as any).injections = this.filteredServiceInjections;

        this.injectScopedServices();
        this.injectServicesIntoService(service);

        return service;
    }

    private async prepare() {
        for (const injection of this.filteredServiceInjections) {
            this.setScopedDependencies(injection);
        }

        this.setDefaultAuthorizationServiceIfNeeded();
    }

    private injectScopedServices() {
        for (const [_, service] of this.scopedServices) {
            for (const injection of (service as any).injections) {
                const injectedService = this.scopedServices.get(injection.serviceKey);
                if (injectedService) {
                    devLogger(
                        'injecting',
                        injectedService.constructor.name,
                        'into',
                        service.constructor.name,
                        'on request',
                        this.request.id
                    );

                    (service as any)[injection.instanceMember] = injectedService;
                }
            }
        }
    }

    private injectServicesIntoService(service: TService) {
        (service as any).request = this.request;

        if (!!this.controllerOptions?.response) {
            (service as any).response = this.controllerOptions.response;
        }

        for (const injection of this.filteredServiceInjections) {
            const baseService = serviceContainer.getService<IScopedService>(injection.serviceKey);

            let actualService = baseService;

            if (isServiceType(baseService, SERVICE_TYPE.SCOPED)) {
                const injectedService = this.scopedServices.get(injection.serviceKey);
                if (injectedService) {
                    actualService = injectedService;
                }
            }

            devLogger(
                'injecting',
                actualService.constructor.name,
                'into',
                this.Service.name,
                'on request',
                this.request.id
            );

            (service as any)[injection.instanceMember] = actualService;
        }
    }

    private setScopedDependencies(injection: IServiceInjection, injections: IServiceInjection[] = []) {
        const Service = serviceContainer.getService<any>(injection.serviceKey);
        if (isServiceType(Service, SERVICE_TYPE.SCOPED) && !this.scopedServices.has(injection.serviceKey)) {
            const service = new Service();

            service.injections = this.getServiceInjections(Service);
            service.request = this.request;

            this.injectSingletonDependencies(service);
            this.scopedServices.set(injection.serviceKey, service);

            for (const injection of service.injections) {
                this.setScopedDependencies(injection, injections);
            }
        }
    }

    private injectSingletonDependencies(service: IScopedService) {
        for (const injection of (service as any).injections) {
            const injectedService = serviceContainer.getService<any>(injection.serviceKey);

            if (isServiceType(injectedService, SERVICE_TYPE.SINGLETON)) {
                devLogger(
                    'injecting',
                    injectedService.constructor.name,
                    'into',
                    service.constructor.name,
                    'on request',
                    this.request.id
                );

                (service as any)[injection.instanceMember] = injectedService;
            }
        }
    }

    private setDefaultAuthorizationServiceIfNeeded() {
        if (!!this.controllerOptions?.hasAuthPolicies && !this.scopedServices.has(SERVICE.AUTHORIZATION)) {
            this.setScopedDependencies({
                serviceKey: SERVICE.AUTHORIZATION,
                instanceMember: '__authorizationService',
            });
        }
    }
}

export default ScopedDependencyInjection;
