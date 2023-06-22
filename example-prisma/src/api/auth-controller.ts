import { before, after, body, controller, httpPost, type ParsedSchema } from '@lindeneg/funkallero';
import SERVICE from '../enums/service';
import Controller from './controller';
import loginDtoSchema from '../dtos/login-dto';
import signupDtoSchema from '../dtos/signup-dto';

@controller()
class AuthController extends Controller {
    @httpPost('/login')
    @after(SERVICE.COOKIE_MIDDLEWARE)
    public login(@body(loginDtoSchema) loginDto: ParsedSchema<typeof loginDtoSchema>) {
        return this.mediator.send('LoginCommand', loginDto);
    }

    @httpPost('/signup')
    @before(SERVICE.TEST_1_MIDDLEWARE, SERVICE.TEST_2_MIDDLEWARE)
    @after(SERVICE.COOKIE_MIDDLEWARE)
    public signup(@body(signupDtoSchema) signupDto: ParsedSchema<typeof signupDtoSchema>) {
        return this.mediator.send('SignupCommand', signupDto);
    }
}
