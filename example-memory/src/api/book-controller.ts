import {
    controller,
    httpGet,
    httpPost,
    httpPatch,
    httpDelete,
    injectService,
    body,
    params,
} from '@lindeneg/funkallero';
import type { Validated } from '@lindeneg/funkallero-zod-service';
import SERVICE from '../enums/service';
import Controller from './controller';
import createBookDtoSchema from '../dtos/create-book-dto';
import updateBookDtoSchema from '../dtos/update-book-dto';
import type AuthenticationService from '../services/authentication-service';

@controller('books')
class BookCoreController extends Controller {
    @httpGet()
    public async getBooks() {
        return this.handleResult(await this.mediator.send('GetBooksQuery'));
    }

    @httpGet('/:id')
    public async getBook(@params('id') id: string) {
        return this.handleResult(await this.mediator.send('GetBookQuery', { id }));
    }

    @httpPatch('/:id', { authPolicy: 'author-is-book-owner' })
    public async updateBook(
        @body(updateBookDtoSchema) updateBookDto: Validated<typeof updateBookDtoSchema>,
        @params('id') id: string
    ) {
        return this.handleResult(
            await this.mediator.send('UpdateBookCommand', {
                ...updateBookDto,
                id,
            })
        );
    }

    @httpDelete('/:id', { authPolicy: 'author-is-book-owner' })
    public async deleteBook(@params('id') id: string) {
        return this.handleResult(
            await this.mediator.send('DeleteBookCommand', {
                id,
            })
        );
    }
}

@controller('books')
class BookInjectedController extends Controller {
    @injectService(SERVICE.AUTHENTICATION)
    private readonly authService: AuthenticationService;

    @httpPost('/', { authPolicy: 'authenticated' })
    public async createBook(@body(createBookDtoSchema) createBookDto: Validated<typeof createBookDtoSchema>) {
        return this.handleResult(
            await this.mediator.send('CreateBookCommand', {
                ...createBookDto,
                authorId: await this.authService.getUserId(),
            })
        );
    }
}
