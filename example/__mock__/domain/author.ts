import type { IDomain } from '@lindeneg/funkallero';

class Author implements IDomain {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    bookIds: string[];
}

export default Author;
