import { PrismaClient } from '@prisma/client';
import BasePrismaDataContextService from '@lindeneg/funkallero-prisma-service';

class DataContextService extends BasePrismaDataContextService<PrismaClient> {
    constructor() {
        super(PrismaClient);
    }
}

export default DataContextService;
