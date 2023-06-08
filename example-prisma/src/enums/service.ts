import { SERVICE as BASE_SERVICE } from '@lindeneg/funkallero';

const SERVICE = {
    ...BASE_SERVICE,
    COOKIE: 'COOKIE',
    DATA_CONTEXT_SEED: 'DATA_CONTEXT_SEED',
} as const;

export default SERVICE;
