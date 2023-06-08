import { controller, httpGet, httpPost, httpPatch, httpDelete, injectService } from '@lindeneg/funkallero';
import { validateBody, type Validated } from '@lindeneg/funkallero-zod-service';
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
    public async getBook() {
        return this.handleResult(await this.mediator.send('GetBookQuery', { id: this.request.params.id }));
    }

    @httpPatch('/:id', { authPolicy: 'author-is-book-owner' })
    @validateBody(updateBookDtoSchema)
    public async updateBook(updateBookDto: Validated<typeof updateBookDtoSchema>) {
        return this.handleResult(
            await this.mediator.send('UpdateBookCommand', {
                ...updateBookDto,
                id: this.request.params.id,
            })
        );
    }

    @httpDelete('/:id', { authPolicy: 'author-is-book-owner' })
    public async deleteBook() {
        return this.handleResult(
            await this.mediator.send('DeleteBookCommand', {
                id: this.request.params.id,
            })
        );
    }
}

@controller('books')
class BookInjectedController extends Controller {
    @injectService(SERVICE.AUTHENTICATION)
    private readonly authService: AuthenticationService;

    @httpPost('/', { authPolicy: 'authenticated' })
    @validateBody(createBookDtoSchema)
    public async createBook(createBookDto: Validated<typeof createBookDtoSchema>) {
        return this.handleResult(
            await this.mediator.send('CreateBookCommand', {
                ...createBookDto,
                authorId: await this.authService.getUserId(),
            })
        );
    }
}
