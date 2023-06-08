import type { z } from 'zod';
import {
    SingletonService,
    type IValidationService,
    type ValidateReturn,
    type Request,
} from '@lindeneg/funkallero-core';

export type Validated<TZod extends z.ZodType<any, any, any>> = z.infer<TZod>;

class BaseZodValidationService extends SingletonService implements IValidationService {
    public validate(payload: Request, property: string, validation: z.Schema): ValidateReturn {
        const result = validation.safeParse(payload[property]);

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

export default BaseZodValidationService;
