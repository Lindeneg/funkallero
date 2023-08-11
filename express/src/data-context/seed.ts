import prisma from '../data-context';
import { hashPassword } from '../utils/auth';

interface ISeedOptions {
    reset?: boolean;
}

class DBSeed {
    public async seed({ reset = false }: ISeedOptions) {
        const hasData = await this.hasData();

        if (hasData) {
            if (reset) {
                await this.clear();
            } else {
                console.log('Database already seeded.');
                return;
            }
        }

        console.log('Seeding database...');

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

    private async clear() {
        console.log('Clearing database...');

        await prisma.book.deleteMany();
        await prisma.author.deleteMany();
    }

    private async seedAuthorWithBooks(name: string, email: string, books: Array<[string, string]>) {
        const author = await prisma.author.create({
            data: {
                name,
                email,
                password: await hashPassword(`${name.toLowerCase()}-mock`),
            },
        });

        return Promise.all(
            books.map(([name, description]) => prisma.book.create({ data: { name, description, authorId: author.id } }))
        );
    }

    private async hasData() {
        const authorsCount = await prisma.author.count();
        const booksCount = await prisma.book.count();
        return authorsCount + booksCount > 0;
    }
}

export default DBSeed;
