import { ACTION_RESULT, MediatorResultSuccess, MediatorResultFailure } from '@lindeneg/funkallero';
import Action from '../action';
import type { IUpdateAuthorDto } from '../../dtos/update-author-dto';

export class UpdateAuthorCommand extends Action {
    public async execute({ name, email, id }: IUpdateAuthorDto) {
        const author = await this.dataContext.exec((p) => p.author.findUnique({ where: { id } }));

        if (!author) return new MediatorResultFailure(ACTION_RESULT.ERROR_NOT_FOUND);

        try {
            await this.dataContext.exec((p) =>
                p.author.update({
                    where: {
                        id: author.id,
                    },
                    data: this.createUpdatePayload({ name, email }),
                })
            );
        } catch (err) {
            return new MediatorResultFailure(ACTION_RESULT.ERROR_INTERNAL_ERROR, err);
        }

        return new MediatorResultSuccess(ACTION_RESULT.UNIT, ACTION_RESULT.SUCCESS_UPDATE);
    }
}

export class DeleteAuthorCommand extends Action {
    public async execute({ id }: Record<'id', string>) {
        const author = await this.dataContext.exec((p) => p.author.findUnique({ where: { id } }));

        if (!author) return new MediatorResultFailure(ACTION_RESULT.ERROR_NOT_FOUND);

        await this.dataContext.exec(async (p) => p.author.delete({ where: { id } }));

        return new MediatorResultSuccess(ACTION_RESULT.UNIT, ACTION_RESULT.SUCCESS_DELETE);
    }
}
