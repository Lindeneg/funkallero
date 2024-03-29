import {
    controller,
    httpGet,
    httpPatch,
    httpDelete,
    body,
    params,
    auth,
    type ParsedSchema,
} from '@lindeneg/funkallero';
import Controller from './controller';
import { AUTH_POLICY } from '@/enums/auth';
import updateAuthorSchema from '@/dtos/update-author-dto';

// one can also just inject the authentication service itself
// but the auth decorator is quite handy to just inject, for example, the userId when needed
const userInjection = { srcProperty: 'id', destProperty: 'userId' };

@controller('authors')
class AuthorController extends Controller {
    private readonly userId: string;

    @httpGet('/:id')
    public async getAuthor(@params('id') id: string) {
        return this.mediator.send('GetAuthorQuery', { id });
    }

    @httpGet()
    public async getAuthors() {
        return this.mediator.send('GetAuthorsQuery');
    }

    @httpDelete()
    @auth(AUTH_POLICY.AUTHENTICATED, userInjection)
    public async deleteAuthor() {
        return this.mediator.send('DeleteAuthorCommand', { id: this.userId });
    }

    @httpPatch()
    @auth(AUTH_POLICY.AUTHENTICATED, userInjection)
    public async updateAuthor(@body(updateAuthorSchema) updateAuthorDto: ParsedSchema<typeof updateAuthorSchema>) {
        return this.mediator.send('UpdateAuthorCommand', {
            ...updateAuthorDto,
            id: this.userId,
        });
    }
}
