import { z } from 'zod';

const loginDtoSchema = z.object({
    email: z.string(),
    password: z.string(),
});

export interface ILoginDto extends z.infer<typeof loginDtoSchema> {}

export default loginDtoSchema;
