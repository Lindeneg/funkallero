import META_DATA from '../enums/meta-data';
import type { InjectableArgUnion } from '../enums/injectable-arg';
import type { IArgumentInjection } from '../types';

function injectArgFactory<TSchema>(targetProperty: InjectableArgUnion, schema: TSchema | null, properties: string[]) {
    return function (target: any, propertyKey: string, index: number) {
        let argumentMetaData = Reflect.get(target, META_DATA.ARGUMENT_INJECTION);

        if (!argumentMetaData) {
            argumentMetaData = {};
            Reflect.defineProperty(target, META_DATA.ARGUMENT_INJECTION, {
                get: () => argumentMetaData,
            });
        }

        if (!argumentMetaData[propertyKey]) {
            argumentMetaData[propertyKey] = {};
        }

        const argumentInjection: IArgumentInjection = {
            index,
            schema,
            properties,
        };

        argumentMetaData[propertyKey][targetProperty] = argumentInjection;
    };
}

export default injectArgFactory;
