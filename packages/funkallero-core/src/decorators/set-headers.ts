import META_DATA from '../enums/meta-data';
import devLogger from '../dev-logger';
import type { IResponseHeaderInjection } from '../types';

const setHeaders = (headers: IResponseHeaderInjection) => {
    return function (target: any, key: string, _: PropertyDescriptor) {
        let responseHeadersMap: Record<string, IResponseHeaderInjection> = Reflect.get(
            target,
            META_DATA.RESPONSE_HEADERS
        );

        if (!responseHeadersMap) {
            responseHeadersMap = {};
            Reflect.defineProperty(target, META_DATA.RESPONSE_HEADERS, {
                get: () => responseHeadersMap,
            });
        }

        if (!responseHeadersMap[key]) {
            responseHeadersMap[key] = {};
        }

        responseHeadersMap[key] = {
            ...responseHeadersMap[key],
            ...headers,
        };

        devLogger('response headers on', key, responseHeadersMap[key]);
    };
};

export default setHeaders;
