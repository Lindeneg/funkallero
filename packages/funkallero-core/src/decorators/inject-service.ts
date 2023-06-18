import 'reflect-metadata';
import META_DATA from '../enums/meta-data';
import type { IServiceInjection } from '../types';

function injectService(serviceKey: string) {
    return function (target: any, instanceMember: string) {
        const origin = target.constructor.name;

        if (!Reflect.hasMetadata(META_DATA.SERVICE_INJECTION, target)) {
            Reflect.defineMetadata(META_DATA.SERVICE_INJECTION, {}, target);
        }

        const serviceMetaData = Reflect.getMetadata(META_DATA.SERVICE_INJECTION, target);

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
