import { controller, httpPost, body } from '@lindeneg/funkallero';
import type { Validated } from '@lindeneg/funkallero-zod-service';
import Controller from './controller';
import loginDtoSchema from '../dtos/login-dto';
import signupDtoSchema from '../dtos/signup-dto';

@controller()
class AuthController extends Controller {
    @httpPost('/login')
    public login(@body(loginDtoSchema) loginDto: Validated<typeof loginDtoSchema>) {
        return this.mediator.send('LoginCommand', loginDto);
    }

    @httpPost('/signup')
    public signup(@body(signupDtoSchema) signupDto: Validated<typeof signupDtoSchema>) {
        return this.mediator.send('SignupCommand', signupDto);
    }
}
