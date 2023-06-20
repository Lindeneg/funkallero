import META_DATA from '../enums/meta-data';
import devLogger from '../dev-logger';
import type { InjectableArgUnion } from '../enums/injectable-arg';
import type { IArgumentInjection } from '../types';

function injectArgFactory<TSchema>(
    targetProperty: InjectableArgUnion,
    schema: TSchema | null,
    properties: string[],
    transform: ((value: any) => any) | null
) {
    return function (target: any, propertyKey: string, index: number) {
        devLogger('inject factory for', propertyKey, 'on', targetProperty, 'produced config', {
            properties,
            schema: !!schema,
            transform: !!transform,
        });

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
            transform: transform || ((e) => e),
        };

        argumentMetaData[propertyKey][targetProperty] = argumentInjection;
    };
}

export default injectArgFactory;
