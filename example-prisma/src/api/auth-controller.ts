import { injectService, controller, httpPost } from '@lindeneg/funkallero';
import { validateBody, type Validated } from '@lindeneg/funkallero-zod-service';
import SERVICE from '../enums/service';
import Controller from './controller';
import loginDtoSchema from '../dtos/login-dto';
import signupDtoSchema from '../dtos/signup-dto';
import type CookieService from '../services/cookie-service';

@controller('/')
class AuthController extends Controller {
    @injectService(SERVICE.COOKIE)
    private readonly cookieService: CookieService;

    @httpPost('/login')
    @validateBody(loginDtoSchema)
    public async login(loginDto: Validated<typeof loginDtoSchema>) {
        return this.handleResult(
            await this.cookieService.handleResponse(this.response, await this.mediator.send('LoginCommand', loginDto))
        );
    }

    @httpPost('/signup')
    @validateBody(signupDtoSchema)
    public async signup(signupDto: Validated<typeof signupDtoSchema>) {
        return this.handleResult(
            await this.cookieService.handleResponse(this.response, await this.mediator.send('SignupCommand', signupDto))
        );
    }
}
