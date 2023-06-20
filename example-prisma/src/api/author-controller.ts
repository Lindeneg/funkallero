import { body, params, controller, httpGet, httpPatch, httpDelete, injectService } from '@lindeneg/funkallero';
import type { Validated } from '@lindeneg/funkallero-zod-service';
import SERVICE from '../enums/service';
import Controller from './controller';
import updateAuthorDtoSchema from '../dtos/update-author-dto';
import type AuthenticationService from '../services/authentication-service';

@controller('authors')
class AuthorCoreController extends Controller {
    @httpGet('/:id')
    public getAuthor(@params('id') id: string) {
        return this.mediator.send('GetAuthorQuery', { id });
    }

    @httpGet()
    public getAuthors() {
        return this.mediator.send('GetAuthorsQuery');
    }
}

@controller('authors')
class AuthorInjectedController extends Controller {
    @injectService(SERVICE.AUTHENTICATION)
    private readonly authService: AuthenticationService;

    @httpDelete('/', { authPolicy: 'authenticated' })
    public async deleteAuthor() {
        return this.mediator.send('DeleteAuthorCommand', { id: await this.authService.getUserId() });
    }

    @httpPatch('/', { authPolicy: 'authenticated' })
    public async updateAuthor(@body(updateAuthorDtoSchema) updateAuthorDto: Validated<typeof updateAuthorDtoSchema>) {
        return this.mediator.send('UpdateAuthorCommand', {
            ...updateAuthorDto,
            id: await this.authService.getUserId(),
        });
    }
}
