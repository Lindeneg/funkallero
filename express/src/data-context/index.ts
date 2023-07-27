import { randomUUID } from 'crypto';
import { hashPassword } from '../utils/auth';
import Author from '../models/author';
import Book from '../models/book';

class DataContextService {
    private readonly data = new Map<any, Map<any, Record<'id', string>>>([
        [Author, new Map<typeof Author, Author>()],
        [Book, new Map<typeof Book, Book>()],
    ]);

    public Author = this.api(Author);
    public Book = this.api(Book);

    private api<TTarget extends typeof Author | typeof Book>(target: TTarget) {
        return {
            new: () => new target() as InstanceType<TTarget>,

            get: async (id: string) => {
                return (this.data.get(target)?.get(id) || null) as InstanceType<TTarget> | null;
            },

            getAll: async (): Promise<InstanceType<TTarget>[]> => {
                return Array.from(this.data.get(target)?.values() || []) as unknown as InstanceType<TTarget>[];
            },

            create: async (entity: InstanceType<TTarget>): Promise<InstanceType<TTarget> | null> => {
                const repository = this.data.get(target);

                if (!repository) return null;

                const id = randomUUID();
                entity.id = id;
                repository.set(id, entity);

                return entity;
            },

            update: async (id: string, updatedEntity: InstanceType<TTarget>): Promise<InstanceType<TTarget> | null> => {
                const repository = this.data.get(target);

                if (!repository) return null;

                const entity = repository.get(id);

                if (!entity) return null;

                repository.set(id, updatedEntity);

                return entity as InstanceType<TTarget>;
            },

            delete: async (id: string): Promise<InstanceType<TTarget> | null> => {
                const repository = this.data.get(target);

                if (!repository) return null;

                const entity = repository.get(id);

                if (!entity) return null;

                repository.delete(id);

                return entity as InstanceType<TTarget>;
            },
        };
    }
}

const seedDatabase = async (dataContext: DataContextService) => {
    const seedAuthorWithBooks = async (name: string, email: string, books: Array<[string, string]>) => {
        const author = dataContext.Author.new();
        author.name = name;
        author.email = email;
        author.password = await hashPassword(`${name.toLowerCase()}-mock`);
        author.createdAt = new Date();
        author.updatedAt = new Date();
        author.bookIds = [];

        const createdAuthor = await dataContext.Author.create(author);

        if (!createdAuthor) return;

        for (const [name, description] of books) {
            const book = dataContext.Book.new();

            book.name = name;
            book.description = description;
            book.authorId = createdAuthor.id;
            book.createdAt = new Date();
            book.updatedAt = new Date();

            const createdBook = await dataContext.Book.create(book);

            if (!createdBook) return;

            createdAuthor.bookIds.push(createdBook.id);
        }
    };

    const p1 = seedAuthorWithBooks('Jane', 'jane@example.com', [
        ['Book 1', 'Book 1 description'],
        ['Book 2', 'Book 2 description'],
    ]);
    const p2 = seedAuthorWithBooks('Miles', 'miles@example.com', [
        ['Book 3', 'Book 3 description'],
        ['Book 4', 'Book 4 description'],
    ]);
    const p3 = seedAuthorWithBooks('Bill', 'bill@example.com', [
        ['Book 5', 'Book 5 description'],
        ['Book 6', 'Book 6 description'],
    ]);

    await Promise.all([p1, p2, p3]);

    return dataContext;
};

const dataContext = await seedDatabase(new DataContextService());

export default dataContext;
