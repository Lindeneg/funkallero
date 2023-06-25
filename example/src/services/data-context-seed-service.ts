import { SingletonService, injectService, type ITokenService, type ILoggerService } from '@lindeneg/funkallero';
import SERVICE from '../enums/service';
import type DataContextService from './data-context-service';

interface ISeedOptions {
    reset?: boolean;
}

// just a simple seed service to get some initial data..
class DataContextSeedService extends SingletonService {
    @injectService(SERVICE.DATA_CONTEXT)
    private readonly dataContext: DataContextService;

    @injectService(SERVICE.TOKEN)
    private readonly tokenService: ITokenService;

    @injectService(SERVICE.LOGGER)
    private readonly logger: ILoggerService;

    public async seed({ reset = false }: ISeedOptions) {
        const hasData = await this.hasData();

        if (hasData) {
            if (reset) {
                await this.clear();
            } else {
                this.logger.verbose('Database already seeded.');
                return;
            }
        }

        this.logger.verbose('Seeding database...');

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

    private clear() {
        this.logger.verbose('Clearing database...');
        return this.dataContext.exec(async (p) => {
            await p.book.deleteMany();
            await p.author.deleteMany();
        });
    }

    private async seedAuthorWithBooks(name: string, email: string, books: Array<[string, string]>) {
        await this.dataContext.exec(async (p) => {
            return p.author.create({
                data: {
                    name,
                    email,
                    password: await this.tokenService.hashPassword(`${name.toLowerCase()}-mock`),
                    books: {
                        createMany: {
                            data: books.map(([name, description]) => ({ name, description })),
                        },
                    },
                },
            });
        });
    }

    private async hasData() {
        return this.dataContext.exec(async (p) => {
            const authorsCount = await p.author.count();
            const booksCount = await p.book.count();
            return authorsCount + booksCount > 0;
        });
    }
}

export default DataContextSeedService;
