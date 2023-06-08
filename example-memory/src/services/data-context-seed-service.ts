import { SingletonService, injectService, type ITokenService, type ILoggerService } from '@lindeneg/funkallero';
import SERVICE from '../enums/service';
import type DataContextService from './data-context-service';

// just a simple seed service to get some initial data..
class DataContextSeedService extends SingletonService {
    @injectService(SERVICE.DATA_CONTEXT)
    private readonly dataContext: DataContextService;

    @injectService(SERVICE.TOKEN)
    private readonly tokenService: ITokenService;

    @injectService(SERVICE.LOGGER)
    private readonly logger: ILoggerService;

    public async seed() {
        this.logger.verbose('Seeding mock data...');

        await this.seedAuthorWithBooks('Jane', 'jane@example.com', [
            ['Book 1', 'Book 1 description'],
            ['Book 2', 'Book 2 description'],
        ]);
        await this.seedAuthorWithBooks('Miles', 'miles@example.com', [
            ['Book 3', 'Book 3 description'],
            ['Book 4', 'Book 4 description'],
        ]);
        await this.seedAuthorWithBooks('Bill', 'bill@example.com', [
            ['Book 5', 'Book 5 description'],
            ['Book 6', 'Book 6 description'],
        ]);
    }

    private async seedAuthorWithBooks(name: string, email: string, books: Array<[string, string]>) {
        const author = this.dataContext.Author.new();
        author.name = name;
        author.email = email;
        author.password = await this.tokenService.hashPassword(`${name.toLowerCase()}-mock`);
        author.createdAt = new Date();
        author.updatedAt = new Date();
        author.bookIds = [];

        const createdAuthor = await this.dataContext.Author.create(author);

        if (!createdAuthor) return;

        for (const [name, description] of books) {
            const book = this.dataContext.Book.new();

            book.name = name;
            book.description = description;
            book.authorId = createdAuthor.id;
            book.createdAt = new Date();
            book.updatedAt = new Date();

            const createdBook = await this.dataContext.Book.create(book);

            if (!createdBook) return;

            createdAuthor.bookIds.push(createdBook.id);
        }
    }
}

export default DataContextSeedService;
