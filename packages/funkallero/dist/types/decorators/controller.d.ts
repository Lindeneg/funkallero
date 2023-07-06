import { type IControllerService, type ControllerSettings, type Constructor } from '@lindeneg/funkallero-core';
export declare function controller<T extends Constructor<IControllerService>>(basePath?: string): (target: T) => void;
export declare function httpGet(route?: string, opts?: ControllerSettings): (target: any, key: string, _: PropertyDescriptor) => void;
export declare function httpPost(route?: string, opts?: ControllerSettings): (target: any, key: string, _: PropertyDescriptor) => void;
export declare function httpPut(route?: string, opts?: ControllerSettings): (target: any, key: string, _: PropertyDescriptor) => void;
export declare function httpPatch(route?: string, opts?: ControllerSettings): (target: any, key: string, _: PropertyDescriptor) => void;
export declare function httpDelete(route?: string, opts?: ControllerSettings): (target: any, key: string, _: PropertyDescriptor) => void;
