import type { PublicServiceGetter } from '@lindeneg/funkallero-core';
import { getSingletonService } from '.';

const publicServiceGetter: PublicServiceGetter = {
    getSingletonService,
} as const;

export default publicServiceGetter;
