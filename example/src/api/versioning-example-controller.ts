import { controller, httpGet } from '@lindeneg/funkallero';
import { MediatorResultSuccess } from '@lindeneg/funkallero-core';
import Controller from './controller';

@controller('/', 'v1')
class VersioningV1Controller extends Controller {
    @httpGet('/test')
    public async test() {
        return new MediatorResultSuccess('v1');
    }

    @httpGet('/test2')
    public async test2() {
        return new MediatorResultSuccess('v1');
    }

    @httpGet('/test2', { version: 'v3' })
    public async test2v3() {
        return new MediatorResultSuccess('v3');
    }
}

@controller('/', 'v2')
class VersioningV2Controller extends Controller {
    @httpGet('/test')
    public async test() {
        return new MediatorResultSuccess('v2');
    }

    @httpGet('/test2')
    public async test2() {
        return new MediatorResultSuccess('v2');
    }
}

@controller()
class VersioningController extends Controller {
    @httpGet('/test')
    public async test() {
        return new MediatorResultSuccess('No Version');
    }

    @httpGet('/test', { version: 'v3' })
    public async test3() {
        return new MediatorResultSuccess('v3');
    }

    @httpGet('/test2', { version: 'v4' })
    public async test4() {
        return new MediatorResultSuccess('v4');
    }
}
