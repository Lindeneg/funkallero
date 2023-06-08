import type { z } from 'zod';
import { validateDecoratorFactory } from '@lindeneg/funkallero-core';

function validateBody<TSchema extends z.Schema>(schema: TSchema) {
    return validateDecoratorFactory('body', schema);
}

export default validateBody;
