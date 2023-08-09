import { static as expressStatic } from 'express';
import { BaseExpressService } from '@lindeneg/funkallero';

class ExpressService extends BaseExpressService {
    public async setup() {
        await super.setup();

        this.app.use(expressStatic('public'));
    }
}

export default ExpressService;
