function injectService(serviceKey: string) {
    return function (target: any, instanceMember: string) {
        const origin = target.constructor.name;

        if (!target.injection) {
            target.injection = {};
        }

        if (!Array.isArray(target.injection[origin])) {
            target.injection[origin] = [];
        }

        target.injection[origin].push({
            serviceKey,
            instanceMember,
        });

        return target;
    };
}

export default injectService;
