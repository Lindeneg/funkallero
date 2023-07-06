import type { InjectableArgUnion } from '../enums/injectable-arg';
declare function injectArgFactory<TSchema>(targetProperty: InjectableArgUnion, schema: TSchema | null, properties: string[], transform: ((value: any) => any) | null): (target: any, propertyKey: string, index: number) => void;
export default injectArgFactory;
