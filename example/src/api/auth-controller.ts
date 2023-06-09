import { before, after, body, controller, httpPost, type ParsedSchema } from '@lindeneg/funkallero';
import SERVICE from '../enums/service';
import Controller from './controller';
import loginSchema from '../dtos/login-dto';
import signupSchema from '../dtos/signup-dto';

@controller()
class AuthController extends Controller {
    @httpPost('/login')
    @after(SERVICE.COOKIE_MIDDLEWARE)
    public async login(@body(loginSchema) loginDto: ParsedSchema<typeof loginSchema>) {
        return this.mediator.send('LoginCommand', loginDto);
    }

    @httpPost('/signup')
    @before(SERVICE.TEST_1_MIDDLEWARE, SERVICE.TEST_2_MIDDLEWARE)
    @after(SERVICE.COOKIE_MIDDLEWARE)
    public async signup(@body(signupSchema) signupDto: ParsedSchema<typeof signupSchema>) {
        return this.mediator.send('SignupCommand', signupDto);
    }
}
