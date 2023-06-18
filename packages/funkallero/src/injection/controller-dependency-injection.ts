import {
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
import devLogger from '../dev-logger';

class ControllerDependencyInjection extends DependencyInjection {
    private readonly CustomController: Constructor<IControllerService>;
    private readonly request: Request;
    private readonly response: Response;
    private readonly hasAuthorizationPolicy: boolean;
    private readonly scopedServices: Map<string, IScopedService>;
    private readonly filteredControllerInjections: IServiceInjection[];

    constructor(
        request: Request,
        response: Response,
        CustomController: Constructor<IControllerService>,
        hasAuthorizationPolicy: boolean
    ) {
        super();
        this.CustomController = CustomController;
        this.scopedServices = new Map();
        this.request = request;
        this.response = response;
        this.hasAuthorizationPolicy = hasAuthorizationPolicy;
        this.filteredControllerInjections = this.getServiceInjections(this.CustomController);
    }

    public async inject(): Promise<[IControllerService, Map<any, any>]> {
        await this.prepare();

        const controller = new this.CustomController();

        this.injectScopedServices();
        this.injectServicesIntoController(controller);

        return [controller, this.scopedServices];
    }

    private async prepare() {
        for (const injection of this.filteredControllerInjections) {
            this.setScopedDependencies(injection);
        }

        this.setDefaultAuthorizationService();
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

    private injectServicesIntoController(controller: IControllerService) {
        (controller as any).request = this.request;
        (controller as any).response = this.response;

        for (const injection of this.filteredControllerInjections) {
            const baseService = serviceContainer.getService<any>(injection.serviceKey);

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
                this.CustomController.name,
                'on request',
                this.request.id
            );

            (controller as any)[injection.instanceMember] = actualService;
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

    private setDefaultAuthorizationService() {
        if (this.hasAuthorizationPolicy && !this.scopedServices.has(SERVICE.AUTHORIZATION)) {
            this.setScopedDependencies({
                serviceKey: SERVICE.AUTHORIZATION,
                instanceMember: '__authorizationService',
            });
        }
    }
}

export default ControllerDependencyInjection;
