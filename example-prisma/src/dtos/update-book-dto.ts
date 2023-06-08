import { z } from 'zod';

const updateBookDtoSchema = z
    .object({
        name: z.string().min(2).max(20),
        description: z.string().min(2).max(100),
    })
    .partial()
    .superRefine((data, ctx) => {
        if (!data.name && !data.description) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['name', 'description'],
                message: 'Please specify either name or description',
            });
        }
    });

export interface IUpdateBookDto extends z.infer<typeof updateBookDtoSchema> {
    id: string;
}

export default updateBookDtoSchema;
