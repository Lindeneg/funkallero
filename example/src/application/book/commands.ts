import { ACTION_RESULT, MediatorResultSuccess, MediatorResultFailure } from '@lindeneg/funkallero';
import Action from '../action';
import type { ICreateBookDto } from '../../dtos/create-book-dto';
import type { IUpdateBookDto } from '../../dtos/update-book-dto';
import type ICreateBookResponse from '../../dtos/create-book-response';

export class CreateBookCommand extends Action {
    public async execute({ name, description, authorId }: ICreateBookDto) {
        const createdBookResponse: ICreateBookResponse | null = await this.dataContext.exec((p) =>
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

        if (!createdBookResponse) return new MediatorResultFailure(ACTION_RESULT.ERROR_INTERNAL_ERROR);

        return new MediatorResultSuccess(createdBookResponse, ACTION_RESULT.SUCCESS_CREATE);
    }
}

export class UpdateBookCommand extends Action {
    public async execute({ name, description, id }: IUpdateBookDto) {
        const book = await this.dataContext.exec((p) => p.book.findUnique({ where: { id } }));

        if (!book) return new MediatorResultFailure(ACTION_RESULT.ERROR_NOT_FOUND);

        const success = await this.dataContext.exec((p) =>
            p.book.update({
                where: {
                    id: book.id,
                },
                data: this.createUpdatePayload({ name, description }),
            })
        );

        if (!success) return new MediatorResultFailure(ACTION_RESULT.ERROR_INTERNAL_ERROR);

        return new MediatorResultSuccess(ACTION_RESULT.UNIT, ACTION_RESULT.SUCCESS_UPDATE);
    }
}

export class DeleteBookCommand extends Action {
    public async execute({ id }: Record<'id', string>) {
        const book = await this.dataContext.exec((p) => p.book.findUnique({ where: { id } }));

        if (!book) return new MediatorResultFailure(ACTION_RESULT.ERROR_NOT_FOUND);

        const success = await this.dataContext.exec((p) => p.book.delete({ where: { id } }));

        if (!success) return new MediatorResultFailure(ACTION_RESULT.ERROR_INTERNAL_ERROR);

        return new MediatorResultSuccess(ACTION_RESULT.UNIT, ACTION_RESULT.SUCCESS_DELETE);
    }
}
