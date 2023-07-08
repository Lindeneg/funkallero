export { default as main } from './main';
export { default as logger } from './logger';
export { default as createAction } from './action/create-action';
export { default as extendAction } from './action/extend-action';
export { default as createGenerator } from './generator/create-generator';
export { default as createModule } from './module/create-module';
export { default as createPackageManager } from './package-manager/create-package-manager';
export { default as createTemplate } from './template/create-template';

export * from './action/logic';
export * from './action/common-actions';
export * from './argv-flags/logic';
export * from './generator/logic';
export * from './module/logic';
export * from './template/logic';

export * from './action/types';
export * from './logger/types';
export * from './generator/types';
export * from './module/types';
export * from './template/types';
export * from './package-manager/types';

export { join as joinPath } from 'path';
export type { NodePlopAPI, ActionType } from 'node-plop';
