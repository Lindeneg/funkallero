import { ACTION_RESULT, MediatorResultSuccess, MediatorResultFailure } from '@lindeneg/funkallero';
import Action from '../action';
import type IGetBookResponse from '../../../../example/src/dtos/get-book-response';

export class GetBooksQuery extends Action {
    public async execute() {
        const books = await this.dataContext.Book.getAll();

        const booksResponse: IGetBookResponse[] = await Promise.all(
            books.map(async (book) => {
                const author = await this.dataContext.Author.get(book.authorId);

                const bookDto: IGetBookResponse = {
                    id: book.id,
                    name: book.name,
                    description: book.description,
                    author: { id: author?.id || '', name: author?.name || '' },
                };

                return bookDto;
            })
        );

        return new MediatorResultSuccess(booksResponse);
    }
}

export class GetBookQuery extends Action {
    public async execute({ id }: Record<'id', string>) {
        const book = await this.dataContext.Book.get(id);

        if (!book) return new MediatorResultFailure(ACTION_RESULT.ERROR_NOT_FOUND);

        const author = await this.dataContext.Author.get(book.authorId);

        const bookResponse: IGetBookResponse = {
            id: book.id,
            name: book.name,
            description: book.description,
            author: { id: author?.id || '', name: author?.name || '' },
        };

        return new MediatorResultSuccess(bookResponse);
    }
}
