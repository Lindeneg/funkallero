import { z } from 'zod';

const createBookDtoSchema = z.object({
    name: z.string().trim().min(2).max(20),
    description: z.string().trim().min(2).max(100),
});

export interface ICreateBookDto extends z.infer<typeof createBookDtoSchema> {
    authorId: string;
}

export default createBookDtoSchema;
