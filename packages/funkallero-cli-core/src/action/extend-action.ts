import type { ScaffoldAction, PlopActionsMap } from './types';

const extendAction = <TPayload, TType extends keyof PlopActionsMap>(
    modifiedPrepare: (payload: TPayload) => PlopActionsMap[TType]
): ScaffoldAction<TPayload> => {
    return {
        register() {
            return ['noop', async () => ''];
        },
        prepare(payload) {
            return [modifiedPrepare(payload)] as [TPayload & PlopActionsMap[TType]];
        },
    };
};

export default extendAction;
