import type { ScaffoldAction, ScaffoldActionFn } from './types';

const createAction = <TPayload>(key: string, fn: ScaffoldActionFn<TPayload>): ScaffoldAction<TPayload> => {
    return {
        register() {
            return [key, fn];
        },
        prepare(payload) {
            return [
                {
                    ...payload,
                    type: key,
                },
            ];
        },
    };
};

export default createAction;
