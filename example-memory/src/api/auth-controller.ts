import { controller, httpPost } from '@lindeneg/funkallero';
import { validateBody, type Validated } from '@lindeneg/funkallero-zod-service';
import Controller from './controller';
import loginDtoSchema from '../dtos/login-dto';
import signupDtoSchema from '../dtos/signup-dto';

@controller('/')
class AuthController extends Controller {
    @httpPost('/login')
    @validateBody(loginDtoSchema)
    public async login(loginDto: Validated<typeof loginDtoSchema>) {
        return this.handleResult(await this.mediator.send('LoginCommand', loginDto));
    }

    @httpPost('/signup')
    @validateBody(signupDtoSchema)
    public async signup(signupDto: Validated<typeof signupDtoSchema>) {
        return this.handleResult(await this.mediator.send('SignupCommand', signupDto));
    }
}
