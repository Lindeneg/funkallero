import { controller, httpGet, httpPatch, httpDelete, injectService } from '@lindeneg/funkallero';
import { validateBody, type Validated } from '@lindeneg/funkallero-zod-service';
import SERVICE from '../enums/service';
import Controller from './controller';
import updateAuthorDtoSchema from '../dtos/update-author-dto';
import type AuthenticationService from '../services/authentication-service';

@controller('authors')
class AuthorCoreController extends Controller {
    @httpGet('/:id')
    public async getAuthor() {
        return this.handleResult(await this.mediator.send('GetAuthorQuery', { id: this.request.params.id }));
    }

    @httpGet()
    public async getAuthors() {
        return this.handleResult(await this.mediator.send('GetAuthorsQuery'));
    }
}

@controller('authors')
class AuthorInjectedController extends Controller {
    @injectService(SERVICE.AUTHENTICATION)
    private readonly authService: AuthenticationService;

    @httpDelete('/', { authPolicy: 'authenticated' })
    public async deleteAuthor() {
        return this.handleResult(
            await this.mediator.send('DeleteAuthorCommand', { id: await this.authService.getUserId() })
        );
    }

    @httpPatch('/', { authPolicy: 'authenticated' })
    @validateBody(updateAuthorDtoSchema)
    public async updateAuthor(updateAuthorDto: Validated<typeof updateAuthorDtoSchema>) {
        return this.handleResult(
            await this.mediator.send('UpdateAuthorCommand', {
                ...updateAuthorDto,
                id: await this.authService.getUserId(),
            })
        );
    }
}
