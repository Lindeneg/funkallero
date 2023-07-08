export interface ScaffoldTemplate<TData extends Record<string, any>, TPartials extends Record<string, string>> {
    readonly partials: TPartials;
    addFile(
        path: string,
        data: TData
    ): readonly [
        {
            type: 'add';
            path: string;
            templateFile: string;
            data: TData;
        }
    ];
}

export type ScaffoldTemplateLibraryImport = { name: string; camelCase?: boolean; namedImport?: boolean };
export type KeyValueObj = Record<'key' | 'value', string>;
export type KeyValueArr = KeyValueObj[];
export type ScaffoldTemplatePluginImport = ScaffoldTemplateLibraryImport & { options?: Record<string, any> };
export type AnyScaffoldTemplate = ScaffoldTemplate<any, any>;
