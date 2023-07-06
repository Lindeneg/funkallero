import type { z } from 'zod';
import { SingletonService, type ISchemaParserService, type SchemaParserResult } from '@lindeneg/funkallero-core';
export type ParsedSchema<TZod extends z.ZodType<any, any, any>> = z.infer<TZod>;
declare class BaseZodParserService extends SingletonService implements ISchemaParserService {
    parse(payload: any, validation: z.Schema): Promise<SchemaParserResult>;
}
export default BaseZodParserService;
