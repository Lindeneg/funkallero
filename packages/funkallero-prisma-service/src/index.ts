import type { PrismaClient } from '@prisma/client';
import {
    SERVICE,
    injectService,
    SingletonService,
    type ILoggerService,
    type IDataContextService,
    type Constructor,
} from '@lindeneg/funkallero-core';

type PrismaCallback<TClient extends PrismaClient, TReturn> = (prisma: TClient) => Promise<TReturn>;

type ActionReturn<TClient extends PrismaClient, TAction extends PrismaCallback<TClient, any>> = Awaited<
    ReturnType<TAction>
>;

class BasePrismaDataContextService<TClient extends PrismaClient>
    extends SingletonService
    implements IDataContextService
{
    @injectService(SERVICE.LOGGER)
    private readonly logger: ILoggerService;

    public readonly client: TClient;

    constructor(Client: Constructor<TClient>) {
        super();

        this.client = new Client();
    }

    public async exec<TAction extends PrismaCallback<TClient, any>>(
        callback: TAction
    ): Promise<ActionReturn<TClient, TAction>> {
        try {
            await (this.client as any).$connect();

            const val = await callback(this.client);

            await (this.client as any).$disconnect();

            return val;
        } catch (err) {
            this.logger.error({
                msg: 'prisma action failed, disconnecting...',
                err,
            });

            await (this.client as any).$disconnect();

            throw err;
        }
    }
}

export default BasePrismaDataContextService;
