import { static as expressStatic } from 'express';
import cookieParser from 'cookie-parser';
import { HttpException, BaseExpressService } from '@lindeneg/funkallero';

class ExpressService extends BaseExpressService {
    public async setup() {
        await super.setup();

        this.app.use(cookieParser());
        this.app.use(expressStatic('public'));
    }

    public async onLastRouteAdded() {
        this.app.use((req, res, next) => {
            if (!req.path.startsWith('/api')) {
                (req as any)._funkallero = { html: true };
            }
            next(HttpException.notFound());
        });
    }
}

export default ExpressService;
