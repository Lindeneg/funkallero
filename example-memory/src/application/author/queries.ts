import { ACTION_RESULT, MediatorResultSuccess, MediatorResultFailure } from '@lindeneg/funkallero';
import Action from '../action';
import type Book from '../../domain/book';
import type IGetAuthorResponse from '../../dtos/get-author-response';

const getBooksDtoRelativeToAuthorId = (books: Book[], authorId: string) => {
    return books.reduce((acc, book) => {
        if (book.authorId === authorId) {
            acc.push({
                id: book.id,
                name: book.name,
                description: book.description,
            });
        }

        return acc;
    }, [] as IGetAuthorResponse['books']);
};

export class GetAuthorQuery extends Action {
    public async execute({ id }: Record<'id', string>) {
        const author = await this.dataContext.Author.get(id);

        if (!author) return new MediatorResultFailure(ACTION_RESULT.ERROR_NOT_FOUND);

        const books = getBooksDtoRelativeToAuthorId(await this.dataContext.Book.getAll(), author.id);

        const authorResponse: IGetAuthorResponse = {
            id: author.id,
            name: author.name,
            books,
        };

        return new MediatorResultSuccess(authorResponse);
    }
}

export class GetAuthorsQuery extends Action {
    public async execute() {
        const authors = await this.dataContext.Author.getAll();
        const books = await this.dataContext.Book.getAll();

        const authorsResponse: IGetAuthorResponse[] = authors.map((author) => ({
            id: author.id,
            name: author.name,
            books: getBooksDtoRelativeToAuthorId(books, author.id),
        }));

        return new MediatorResultSuccess(authorsResponse);
    }
}
