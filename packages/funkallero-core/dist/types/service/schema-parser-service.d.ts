import type { Promisify } from '../types';
export type SchemaParserResult = ISchemaParserSuccess | ISchemaParserError;
export interface ISchemaParserSuccess<TSchema = any> {
    success: true;
    data: TSchema;
}
export interface ISchemaParserError {
    success: false;
    error: Record<string, string>;
}
interface ISchemaParserService<TSchemaType = any> {
    parse(payload: any, schema: TSchemaType): Promisify<SchemaParserResult>;
}
export default ISchemaParserService;
