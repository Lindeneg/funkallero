import importFactory from './import-factory';

const esmImport = importFactory((variable, module) => `import ${variable} from '${module}'`);

export default esmImport;
