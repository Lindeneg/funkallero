import 'reflect-metadata';
import META_DATA from '../enums/meta-data';
import type { InjectableArgUnion } from '../enums/injectable-arg';
import type { IArgumentInjection } from '../types';

function injectArgFactory<TSchema>(targetProperty: InjectableArgUnion, schema: TSchema | null, properties: string[]) {
    return function (target: any, propertyKey: string, index: number) {
        if (!Reflect.hasMetadata(META_DATA.ARGUMENT_INJECTION, target)) {
            Reflect.defineMetadata(META_DATA.ARGUMENT_INJECTION, {}, target);
        }

        const argumentMetaData = Reflect.getMetadata(META_DATA.ARGUMENT_INJECTION, target);

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
