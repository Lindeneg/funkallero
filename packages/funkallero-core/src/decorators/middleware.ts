import devLogger from '../dev-logger';
import META_DATA, { type MetaDataUnion } from '../enums/meta-data';

const middlewareFactory = (metaKey: MetaDataUnion) => {
    return function (...serviceKeys: string[]) {
        return function (target: any, key: string, _: PropertyDescriptor) {
            let middleware = Reflect.get(target, metaKey);

            if (!middleware) {
                middleware = {};
                Reflect.defineProperty(target, metaKey, {
                    get: () => middleware,
                });
            }

            if (Array.isArray(middleware[key])) {
                middleware[key].push(...serviceKeys);
            }

            middleware[key] = serviceKeys;

            devLogger('middleware factory for', metaKey, 'on', key, 'produced', middleware[key]);
        };
    };
};

export const after = middlewareFactory(META_DATA.MIDDLEWARE_AFTER);
export const before = middlewareFactory(META_DATA.MIDDLEWARE_BEFORE);
