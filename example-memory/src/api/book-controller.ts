import {
    body,
    params,
    controller,
    httpGet,
    httpPost,
    httpPatch,
    httpDelete,
    auth,
    type ParsedSchema,
} from '@lindeneg/funkallero';
import AUTH_POLICY from '../enums/auth-policy';
import Controller from './controller';
import createBookDtoSchema from '../dtos/create-book-dto';
import updateBookDtoSchema from '../dtos/update-book-dto';

@controller('books')
class BookCoreController extends Controller {
    private readonly userId: string;

    @httpGet()
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
    public async deleteBook() {
        return this.mediator.send('DeleteBookCommand', {
            id: this.request.params.id,
        });
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
