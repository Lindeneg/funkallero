import {
    ACTION_RESULT,
    MediatorResultSuccess,
    MediatorResultFailure,
    injectService,
    type ITokenService,
} from '@lindeneg/funkallero';
import SERVICE from '../../enums/service';
import Action from '../action';
import type { ILoginDto } from '../../dtos/login-dto';
import type { ISignupDto } from '../../dtos/signup-dto';
import type ISignupResponse from '../../dtos/signup-response';

export class LoginCommand extends Action {
    @injectService(SERVICE.TOKEN)
    private readonly tokenService: ITokenService;

    public async execute({ email, password }: ILoginDto) {
        const author = (await this.dataContext.Author.getAll()).find((e) => e.email === email);

        if (!author) return new MediatorResultFailure(ACTION_RESULT.ERROR_NOT_FOUND);

        const isValid = await this.tokenService.comparePassword(password, author.password);

        if (!isValid) return new MediatorResultFailure(ACTION_RESULT.ERROR_UNAUTHENTICATED);

        const token = await this.tokenService.createToken({
            id: author.id,
            name: author.name,
        });

        return new MediatorResultSuccess(token);
    }
}

export class SignupCommand extends Action {
    @injectService(SERVICE.TOKEN)
    private readonly tokenService: ITokenService;

    public async execute({ name, email, password }: ISignupDto) {
        const exitingAuthor = (await this.dataContext.Author.getAll()).find((e) => e.email === email);

        if (exitingAuthor) return new MediatorResultFailure(ACTION_RESULT.ERROR_UNPROCESSABLE);

        const author = this.dataContext.Author.new();

        author.name = name;
        author.email = email;
        author.password = await this.tokenService.hashPassword(password);
        author.createdAt = new Date();
        author.updatedAt = new Date();
        author.bookIds = [];

        const createdAuthor = await this.dataContext.Author.create(author);

        if (!createdAuthor) return new MediatorResultFailure(ACTION_RESULT.ERROR_INTERNAL_ERROR);

        const token = await this.tokenService.createToken({
            id: author.id,
            name: author.name,
        });

        const signupResponse: ISignupResponse = {
            id: createdAuthor.id,
            token,
        };

        return new MediatorResultSuccess(signupResponse, ACTION_RESULT.SUCCESS_CREATE);
    }
}
