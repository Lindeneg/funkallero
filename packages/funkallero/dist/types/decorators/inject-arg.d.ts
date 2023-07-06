import { type TransformFn } from '@lindeneg/funkallero-core';
type ArgUnionCore = string | string[] | TransformFn;
type ArgUnion = ArgUnionCore | Record<any, any>;
export declare const body: (arg1?: ArgUnion, arg2?: ArgUnion, arg3?: ArgUnion) => (target: any, propertyKey: string, index: number) => void;
export declare const query: (arg1?: ArgUnion, arg2?: ArgUnion, arg3?: ArgUnion) => (target: any, propertyKey: string, index: number) => void;
export declare const params: (arg1?: ArgUnion, arg2?: ArgUnion, arg3?: ArgUnion) => (target: any, propertyKey: string, index: number) => void;
export declare const headers: (arg1?: ArgUnion, arg2?: ArgUnion, arg3?: ArgUnion) => (target: any, propertyKey: string, index: number) => void;
export {};
