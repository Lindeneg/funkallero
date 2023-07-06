import {
    ACTION_RESULT,
    MediatorResultSuccess,
    MediatorResultFailure,
    injectService,
    type ITokenService,
} from '@lindeneg/funkallero';
import Action from '../action';
import SERVICE from '../../../../example/src/enums/service';
import type { ILoginDto } from '../../../../example/src/dtos/login-dto';
import type { ISignupDto } from '../../../../example/src/dtos/signup-dto';

export class LoginCommand extends Action {
    @injectService(SERVICE.TOKEN)
    private readonly tokenService: ITokenService;

    public async execute({ email, password }: ILoginDto) {
        const author = (await this.dataContext.Author.getAll()).find((e) => e.email === email);

        if (!author) return new MediatorResultFailure(ACTION_RESULT.ERROR_NOT_FOUND);

        const isValidPassword = await this.tokenService.comparePassword(password, author.password);

        if (!isValidPassword) return new MediatorResultFailure(ACTION_RESULT.ERROR_NOT_FOUND);

        return new MediatorResultSuccess({ id: author.id, name: author.name });
    }
}

export class SignupCommand extends Action {
    @injectService(SERVICE.TOKEN)
    private readonly tokenService: ITokenService;

    public async execute({ name, email, password }: ISignupDto) {
        const existingAuthor = (await this.dataContext.Author.getAll()).find((e) => e.email === email);

        if (existingAuthor) return new MediatorResultFailure(ACTION_RESULT.ERROR_UNPROCESSABLE);

        const author = this.dataContext.Author.new();

        author.name = name;
        author.email = email;
        author.password = await this.tokenService.hashPassword(password);
        author.createdAt = new Date();
        author.updatedAt = new Date();
        author.bookIds = [];

        const createdAuthor = await this.dataContext.Author.create(author);

        if (!createdAuthor) return new MediatorResultFailure(ACTION_RESULT.ERROR_INTERNAL_ERROR);

        return new MediatorResultSuccess(
            { id: createdAuthor.id, name: createdAuthor.name },
            ACTION_RESULT.SUCCESS_CREATE
        );
    }
}
