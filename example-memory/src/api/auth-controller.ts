import { controller, httpPost, body } from '@lindeneg/funkallero';
import type { Validated } from '@lindeneg/funkallero-zod-service';
import Controller from './controller';
import loginDtoSchema from '../dtos/login-dto';
import signupDtoSchema from '../dtos/signup-dto';

@controller()
class AuthController extends Controller {
    @httpPost('/login')
    public async login(@body(loginDtoSchema) loginDto: Validated<typeof loginDtoSchema>) {
        return this.handleResult(await this.mediator.send('LoginCommand', loginDto));
    }

    @httpPost('/signup')
    public async signup(@body(signupDtoSchema) signupDto: Validated<typeof signupDtoSchema>) {
        return this.handleResult(await this.mediator.send('SignupCommand', signupDto));
    }
}
