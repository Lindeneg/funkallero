import { randomUUID } from 'crypto';
import { SingletonService, type IDataContextService, type IDomain } from '@lindeneg/funkallero';
import Author from '../domain/author';
import Book from '../domain/book';

// just an example, most appropiate would be an adapter to an actual ORM..
class DataContextService extends SingletonService implements IDataContextService {
    private readonly data = new Map<any, Map<any, IDomain>>([
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

export default DataContextService;
