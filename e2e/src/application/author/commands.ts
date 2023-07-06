import { ACTION_RESULT, MediatorResultSuccess, MediatorResultFailure } from '@lindeneg/funkallero';
import Action from '../action';
import type { IUpdateAuthorDto } from '../../../../example/src/dtos/update-author-dto';

export class UpdateAuthorCommand extends Action {
    public async execute({ name, email, id }: IUpdateAuthorDto) {
        const author = await this.dataContext.Author.get(id);

        if (!author) return new MediatorResultFailure(ACTION_RESULT.ERROR_NOT_FOUND);

        author.name = name ?? author.name;
        author.email = email ?? author.email;
        author.updatedAt = new Date();

        const success = await this.dataContext.Author.update(id, author);

        if (!success) return new MediatorResultFailure(ACTION_RESULT.ERROR_INTERNAL_ERROR);

        return new MediatorResultSuccess(ACTION_RESULT.UNIT, ACTION_RESULT.SUCCESS_UPDATE);
    }
}

export class DeleteAuthorCommand extends Action {
    public async execute({ id }: Record<'id', string>) {
        const author = await this.dataContext.Author.get(id);

        if (!author) return new MediatorResultFailure(ACTION_RESULT.ERROR_NOT_FOUND);

        const books = (await this.dataContext.Book.getAll()).filter((book) => {
            return book.authorId === author.id;
        });

        for (const book of books) {
            await this.dataContext.Book.delete(book.id);
        }

        await this.dataContext.Author.delete(id);

        return new MediatorResultSuccess(ACTION_RESULT.UNIT, ACTION_RESULT.SUCCESS_DELETE);
    }
}
