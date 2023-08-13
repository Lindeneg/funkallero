import {
    ACTION_RESULT,
    MediatorResultSuccess,
    injectService,
    controller,
    view,
    query,
    auth,
} from '@lindeneg/funkallero';
import SERVICE from '@/enums/service';
import { AUTH_POLICY } from '@/enums/auth';
import Controller from '@/api/controller';
import type AuthenticationService from '@/services/authentication-service';

@controller()
class ViewController extends Controller {
    @injectService(SERVICE.AUTHENTICATION)
    private readonly authenticationService: AuthenticationService;

    @view()
    public async index(@query() query: Record<string, string>) {
        return this.mediator.send('GetIndexPage', {
            query,
            userId: await this.authenticationService.getUserId(), // will be null if user is not authenticated
        });
    }

    @view('/create')
    @auth(AUTH_POLICY.AUTHENTICATED)
    public async create() {
        return this.mediator.send('GetCreatePage');
    }

    @view('/login')
    public async login() {
        const userId = await this.authenticationService.getUserId();

        if (userId) return this.redirectToHomePage();

        return this.mediator.send('GetLoginPage');
    }

    @view('/signup')
    public async signup() {
        const userId = await this.authenticationService.getUserId();

        if (userId) return this.redirectToHomePage();

        return this.mediator.send('GetSignupPage');
    }

    @view('/logout')
    public async logout() {
        const userId = await this.authenticationService.getUserId();

        if (!userId) return this.redirectToHomePage();

        return this.mediator.send('GetLogoutPage');
    }

    private async redirectToHomePage() {
        this.response.redirect('/');

        return new MediatorResultSuccess(ACTION_RESULT.RESPONSE_HANDLED);
    }
}
