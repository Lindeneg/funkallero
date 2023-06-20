import { SERVICE as BASE_SERVICE } from '@lindeneg/funkallero';

const SERVICE = {
    ...BASE_SERVICE,
    DATA_CONTEXT_SEED: 'DATA_CONTEXT_SEED',
    EXAMPLE_SCOPED_MIDDLEWARE: 'EXAMPLE_SCOPED_MIDDLEWARE',
    EXAMPLE_SINGLETON_MIDDLEWARE: 'EXAMPLE_SINGLETON_MIDDLEWARE',
} as const;

export default SERVICE;
