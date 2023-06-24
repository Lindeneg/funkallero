import cookieParser from 'cookie-parser';
import { BaseExpressService } from '@lindeneg/funkallero';

class ExpressService extends BaseExpressService {
    public async setup() {
        await super.setup();
        this.app.use(cookieParser());
        this.useJsonContentType();
    }
}

export default ExpressService;
