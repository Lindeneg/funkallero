import { z } from 'zod';

const createBookDtoSchema = z.object({
    name: z.string().min(2).max(20),
    description: z.string().min(2).max(100),
});

export default createBookDtoSchema;
