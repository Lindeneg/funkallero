import handlebars from 'handlebars';
import { toCamelCase, toPascalCase } from '../logic';

const getImportName = (text: handlebars.SafeString, camelCase = false) => {
    const casedName = (camelCase ? toCamelCase(text) : toPascalCase(text)).toString().replace(/[^a-z]/gi, '');
    return new handlebars.SafeString(casedName);
};

export default getImportName;
