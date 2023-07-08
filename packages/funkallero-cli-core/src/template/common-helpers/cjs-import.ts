import importFactory from './import-factory';

const cjsImport = importFactory((variable, module) => `const ${variable} = require('${module}')`);

export default cjsImport;
