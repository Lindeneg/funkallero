import { ACTION_RESULT, MediatorResultSuccess, MediatorResultFailure } from '@lindeneg/funkallero';
import Action from '../action';
import type { ICreateBookDto } from '../../../dtos/create-book-dto';
import type { IUpdateBookDto } from '../../../dtos/update-book-dto';
import type ICreateBookResponse from '../../../dtos/create-book-response';

export class CreateBookCommand extends Action {
    public async execute({ name, description, authorId }: ICreateBookDto) {
        const book = this.dataContext.Book.new();

        book.name = name;
        book.description = description;
        book.authorId = authorId;
        book.createdAt = new Date();
        book.updatedAt = new Date();

        const createdBook = await this.dataContext.Book.create(book);

        if (!createdBook) return new MediatorResultFailure(ACTION_RESULT.ERROR_INTERNAL_ERROR);

        const createBookResponse: ICreateBookResponse = {
            id: createdBook.id,
        };

        return new MediatorResultSuccess(createBookResponse, ACTION_RESULT.SUCCESS_CREATE);
    }
}

export class UpdateBookCommand extends Action {
    public async execute({ name, description, id }: IUpdateBookDto) {
        const book = await this.dataContext.Book.get(id);

        if (!book) return new MediatorResultFailure(ACTION_RESULT.ERROR_NOT_FOUND);

        book.name = name ?? book.description;
        book.description = description ?? book.description;
        book.updatedAt = new Date();

        const updatedBook = await this.dataContext.Book.update(id, book);

        if (!updatedBook) return new MediatorResultFailure(ACTION_RESULT.ERROR_INTERNAL_ERROR);

        return new MediatorResultSuccess(ACTION_RESULT.UNIT, ACTION_RESULT.SUCCESS_UPDATE);
    }
}

export class DeleteBookCommand extends Action {
    public async execute({ id }: Record<'id', string>) {
        const book = await this.dataContext.Book.get(id);

        if (!book) return new MediatorResultFailure(ACTION_RESULT.ERROR_NOT_FOUND);

        const deletedBook = await this.dataContext.Book.delete(id);

        if (!deletedBook) return new MediatorResultFailure(ACTION_RESULT.ERROR_INTERNAL_ERROR);

        const author = await this.dataContext.Author.get(book.authorId);

        if (author) {
            author.bookIds = author.bookIds.filter((bookId) => bookId !== book.id);
            author.updatedAt = new Date();

            await this.dataContext.Author.update(author.id, author);
        }

        return new MediatorResultSuccess(ACTION_RESULT.UNIT, ACTION_RESULT.SUCCESS_DELETE);
    }
}
