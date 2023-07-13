import { createModule } from '@lindeneg/scaffold-core';

export default createModule({
    name: 'zod',
    formattedName: 'Zod',
    description: 'handles zod module operations',
    enabled: true,

    dependencies: [
        {
            name: 'zod',
            type: 'normal',
        },
    ],

    templates: {},
});
