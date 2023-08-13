import { z } from 'zod';

const updateAuthorDtoSchema = z
    .object({
        name: z.string().trim().min(2).max(20),
        email: z.string().trim().email(),
    })
    .partial()
    .superRefine((data, ctx) => {
        if (!data.name && !data.email) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['name', 'email'],
                message: 'Please specify either name or email',
            });
        }
    });

export interface IUpdateAuthorDto extends z.infer<typeof updateAuthorDtoSchema> {
    id: string;
}

export default updateAuthorDtoSchema;
