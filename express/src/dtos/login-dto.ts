import { z } from 'zod';

const loginDtoSchema = z.object({
    email: z.string(),
    password: z.string(),
});

export default loginDtoSchema;
