import {
    body,
    params,
    controller,
    httpGet,
    httpPost,
    httpPatch,
    httpDelete,
    auth,
    setHeaders,
    type ParsedSchema,
} from '@lindeneg/funkallero';
import Controller from './controller';
import { AUTH_POLICY } from '@/enums/auth';
import createBookDtoSchema from '@/dtos/create-book-dto';
import updateBookDtoSchema from '@/dtos/update-book-dto';

@controller('books')
class BookController extends Controller {
    private readonly userId: string;

    @httpGet()
    @setHeaders({
        'Custom-Header': 'Specific-Header-Value',
        'TimeStamp-Header': () => Date.now().toString(),
        'Request-ID': (req) => req.id,
    })
    public getBooks() {
        return this.mediator.send('GetBooksQuery');
    }

    @httpGet('/:id')
    public getBook(@params('id') id: string) {
        return this.mediator.send('GetBookQuery', { id });
    }

    @httpPatch('/:id')
    @auth(AUTH_POLICY.AUTHOR_IS_BOOK_OWNER)
    public updateBook(
        @params('id') id: string,
        @body(updateBookDtoSchema) updateBookDto: ParsedSchema<typeof updateBookDtoSchema>
    ) {
        return this.mediator.send('UpdateBookCommand', {
            ...updateBookDto,
            id,
        });
    }

    @httpDelete('/:id')
    @auth(AUTH_POLICY.AUTHOR_IS_BOOK_OWNER)
    public async deleteBook(@params('id') id: string) {
        return this.mediator.send('DeleteBookCommand', { id });
    }

    @httpPost()
    @auth(AUTH_POLICY.AUTHENTICATED, { srcProperty: 'id', destProperty: 'userId' })
    public createBook(@body(createBookDtoSchema) createBookDto: ParsedSchema<typeof createBookDtoSchema>) {
        return this.mediator.send('CreateBookCommand', {
            ...createBookDto,
            authorId: this.userId,
        });
    }
}
