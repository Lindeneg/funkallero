import { ACTION_RESULT, MediatorResultSuccess, MediatorResultFailure } from '@lindeneg/funkallero';
import Action from '../action';
import type { ICreateBookDto } from '../../dtos/create-book-dto';
import type { IUpdateBookDto } from '../../dtos/update-book-dto';
import type ICreateBookResponse from '../../dtos/create-book-response';

export class CreateBookCommand extends Action {
    public async execute({ name, description, authorId }: ICreateBookDto) {
        try {
            const createdBookId: ICreateBookResponse = await this.dataContext.exec((p) =>
                p.book.create({
                    data: {
                        name,
                        description,
                        authorId,
                    },
                    select: {
                        id: true,
                    },
                })
            );
            return new MediatorResultSuccess(createdBookId, ACTION_RESULT.SUCCESS_CREATE);
        } catch (err) {
            return new MediatorResultFailure(ACTION_RESULT.ERROR_INTERNAL_ERROR, err);
        }
    }
}

export class UpdateBookCommand extends Action {
    public async execute({ name, description, id }: IUpdateBookDto) {
        const book = await this.dataContext.exec((p) => p.book.findUnique({ where: { id } }));

        if (!book) return new MediatorResultFailure(ACTION_RESULT.ERROR_NOT_FOUND);

        try {
            await this.dataContext.exec((p) =>
                p.book.update({
                    where: {
                        id: book.id,
                    },
                    data: this.createUpdatePayload({ name, description }),
                })
            );
        } catch (err) {
            return new MediatorResultFailure(ACTION_RESULT.ERROR_INTERNAL_ERROR, err);
        }

        return new MediatorResultSuccess(ACTION_RESULT.UNIT, ACTION_RESULT.SUCCESS_UPDATE);
    }
}

export class DeleteBookCommand extends Action {
    public async execute({ id }: Record<'id', string>) {
        const book = await this.dataContext.exec((p) => p.book.findUnique({ where: { id } }));

        if (!book) return new MediatorResultFailure(ACTION_RESULT.ERROR_NOT_FOUND);

        await this.dataContext.exec((p) => p.book.delete({ where: { id } }));

        return new MediatorResultSuccess(ACTION_RESULT.UNIT, ACTION_RESULT.SUCCESS_DELETE);
    }
}
