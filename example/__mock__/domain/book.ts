import type { IDomain } from '@lindeneg/funkallero';

class Book implements IDomain {
    id: string;
    name: string;
    description: string;
    authorId: string;
    createdAt: Date;
    updatedAt: Date;
}

export default Book;
