import DependencyInjection from './dependency-injection';
declare class SingletonDependencyInjection extends DependencyInjection {
    private readonly mappedSingletonServices;
    inject(): Promise<void>;
    private prepare;
    private getFilteredUninstantiatedSingletons;
}
export default SingletonDependencyInjection;
