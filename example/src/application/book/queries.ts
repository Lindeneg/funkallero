import { ACTION_RESULT, MediatorResultSuccess, MediatorResultFailure } from '@lindeneg/funkallero';
import Action from '../action';
import type IGetBookResponse from '@/dtos/get-book-response';

export class GetBooksQuery extends Action {
    public async execute() {
        const books: IGetBookResponse[] =
            (await this.dataContext.exec((p) =>
                p.book.findMany({
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        author: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                })
            )) || [];

        return new MediatorResultSuccess(books);
    }
}

export class GetBookQuery extends Action {
    public async execute({ id }: Record<'id', string>) {
        const book: IGetBookResponse | null = await this.dataContext.exec((p) =>
            p.book.findUnique({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    author: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            })
        );

        if (!book) return new MediatorResultFailure(ACTION_RESULT.ERROR_NOT_FOUND);

        return new MediatorResultSuccess(book);
    }
}
