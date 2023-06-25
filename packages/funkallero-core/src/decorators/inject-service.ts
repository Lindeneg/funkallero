import META_DATA from '../enums/meta-data';
import type { IServiceInjection } from '../types';

function injectService(serviceKey: string) {
    return function (target: any, instanceMember: string) {
        const origin = target.constructor.name;
        let serviceMetaData = Reflect.get(target, META_DATA.SERVICE_INJECTION);

        if (!serviceMetaData) {
            serviceMetaData = {};
            Reflect.defineProperty(target, META_DATA.SERVICE_INJECTION, {
                get: () => serviceMetaData,
            });
        }

        if (!Array.isArray(serviceMetaData[origin])) {
            serviceMetaData[origin] = [];
        }

        const serviceInjection: IServiceInjection = {
            serviceKey,
            instanceMember,
        };

        serviceMetaData[origin].push(serviceInjection);

        return target;
    };
}

export default injectService;
