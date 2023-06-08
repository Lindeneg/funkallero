import { ACTION_RESULT, MediatorResultSuccess, MediatorResultFailure } from '@lindeneg/funkallero';
import Action from '../action';
import type IGetAuthorResponse from '../../dtos/get-author-response';

export class GetAuthorQuery extends Action {
    public async execute({ id }: Record<'id', string>) {
        const authorResponse: IGetAuthorResponse | null = await this.dataContext.exec((p) =>
            p.author.findUnique({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    books: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                        },
                    },
                },
            })
        );

        if (!authorResponse) return new MediatorResultFailure(ACTION_RESULT.ERROR_NOT_FOUND);

        return new MediatorResultSuccess(authorResponse);
    }
}

export class GetAuthorsQuery extends Action {
    public async execute() {
        const authorsResponse: IGetAuthorResponse[] = await this.dataContext.exec((p) =>
            p.author.findMany({
                select: {
                    id: true,
                    name: true,
                    books: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                        },
                    },
                },
            })
        );

        return new MediatorResultSuccess(authorsResponse);
    }
}
