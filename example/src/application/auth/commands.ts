import {
    ACTION_RESULT,
    MediatorResultSuccess,
    MediatorResultFailure,
    injectService,
    type ITokenService,
} from '@lindeneg/funkallero';
import Action from '../action';
import SERVICE from '../../enums/service';
import type { ILoginDto } from '../../dtos/login-dto';
import type { ISignupDto } from '../../dtos/signup-dto';

export class LoginCommand extends Action {
    @injectService(SERVICE.TOKEN)
    private readonly tokenService: ITokenService;

    public async execute({ email, password }: ILoginDto) {
        const author = await this.dataContext.exec((p) =>
            p.author.findUnique({
                where: { email },
            })
        );

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
        const existingAuthor = await this.dataContext.exec((p) =>
            p.author.findUnique({
                where: { email },
            })
        );

        if (existingAuthor) return new MediatorResultFailure(ACTION_RESULT.ERROR_UNPROCESSABLE);

        const author = await this.dataContext.exec(async (p) =>
            p.author.create({
                data: {
                    name,
                    email,
                    password: await this.tokenService.hashPassword(password),
                },
            })
        );

        if (!author) return new MediatorResultFailure(ACTION_RESULT.ERROR_INTERNAL_ERROR);

        return new MediatorResultSuccess({ id: author.id, name: author.name }, ACTION_RESULT.SUCCESS_CREATE);
    }
}
