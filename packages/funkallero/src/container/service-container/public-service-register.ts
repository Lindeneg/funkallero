import type { PublicServiceRegister } from '@lindeneg/funkallero-core';
import serviceContainer from '.';

const { registerScopedService, registerSingletonService } = serviceContainer;

const publicServiceRegister: PublicServiceRegister = {
    registerScopedService,
    registerSingletonService,
} as const;

export default publicServiceRegister;
