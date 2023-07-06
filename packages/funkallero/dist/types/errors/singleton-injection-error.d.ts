declare class SingletonInjectionError extends Error {
    constructor(injectionSource: string, injectionTarget: string);
}
export default SingletonInjectionError;
