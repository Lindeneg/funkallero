import ACTION_SUCCESS_RESULT, { type ActionSuccessResultUnion } from './action-success-result';
import ACTION_ERROR_RESULT, { type ActionErrorResultUnion } from './action-error-result';

const ACTION_RESULT = Object.freeze({
    ...ACTION_SUCCESS_RESULT,
    ...ACTION_ERROR_RESULT,
});

export type ActionResultUnion = ActionSuccessResultUnion | ActionErrorResultUnion;

export default ACTION_RESULT;
