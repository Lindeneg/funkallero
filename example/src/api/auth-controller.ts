import {
    ACTION_RESULT,
    MediatorResultSuccess,
    setHeaders,
    before,
    after,
    body,
    controller,
    httpPost,
    httpGet,
    type ParsedSchema,
} from '@lindeneg/funkallero';
import Controller from './controller';
import SERVICE from '@/enums/service';
import AUTH from '@/enums/auth';
import loginSchema from '@/dtos/login-dto';
import signupSchema from '@/dtos/signup-dto';

@controller()
class AuthController extends Controller {
    @httpPost('/login')
    @after(SERVICE.COOKIE_MIDDLEWARE)
    public async login(@body(loginSchema) loginDto: ParsedSchema<typeof loginSchema>) {
        return this.mediator.send('LoginCommand', loginDto);
    }

    @httpGet('/logout')
    @setHeaders({
        'Set-Cookie': `${AUTH.COOKIE_NAME}=; Path=/; Max-Age=0;`,
    })
    public async logout() {
        return new MediatorResultSuccess(ACTION_RESULT.UNIT);
    }

    @httpPost('/signup')
    @before(SERVICE.TEST_1_MIDDLEWARE, SERVICE.TEST_2_MIDDLEWARE)
    @after(SERVICE.COOKIE_MIDDLEWARE)
    public async signup(@body(signupSchema) signupDto: ParsedSchema<typeof signupSchema>) {
        return this.mediator.send('SignupCommand', signupDto);
    }
}
