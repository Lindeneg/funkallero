import type { z } from 'zod';
import { SingletonService, type ISchemaParserService, type SchemaParserResult } from '@lindeneg/funkallero-core';

export type ParsedSchema<TZod extends z.ZodType<any, any, any>> = z.infer<TZod>;

class BaseZodParserService extends SingletonService implements ISchemaParserService {
    public async parse(payload: any, validation: z.Schema): Promise<SchemaParserResult> {
        const result = await validation.safeParseAsync(payload);

        if (result.success) {
            return {
                success: true,
                data: result.data,
            };
        }

        const error: Record<string, string> = {};

        for (const zodErr of result.error.errors) {
            for (const path of zodErr.path) {
                error[path] = zodErr.message;
            }
        }

        return {
            success: false,
            error,
        };
    }
}

export default BaseZodParserService;
