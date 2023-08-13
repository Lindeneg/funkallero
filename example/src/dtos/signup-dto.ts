import { z } from 'zod';

const signupDtoSchema = z.object({
    name: z.string().trim().min(2).max(20),
    email: z.string().trim().email(),
    password: z.string().trim().min(6).max(20),
});

export interface ISignupDto extends z.infer<typeof signupDtoSchema> {}

export default signupDtoSchema;
