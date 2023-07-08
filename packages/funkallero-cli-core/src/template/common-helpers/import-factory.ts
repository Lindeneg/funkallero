import handlebars from 'handlebars';
import getImportName from './get-import-name';

const importFactory = (createImportString: (name: string, text: handlebars.SafeString) => string) => {
    return (text: handlebars.SafeString, namedImport?: boolean, camelCase?: boolean) => {
        const casedName = getImportName(text, camelCase);
        const name = namedImport ? ' { ' + casedName + ' } ' : casedName;
        return new handlebars.SafeString(createImportString(name.toString(), text));
    };
};

export default importFactory;
