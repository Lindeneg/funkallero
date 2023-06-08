class SingletonInjectionError extends Error {
    constructor(injectionSource: string, injectionTarget: string) {
        super(`Cannot inject ${injectionSource} (scoped) into ${injectionTarget} (singleton)`);
    }
}

export default SingletonInjectionError;
