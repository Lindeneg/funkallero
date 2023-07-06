import { type ActionSuccessResultUnion } from './action-success-result';
import { type ActionErrorResultUnion } from './action-error-result';
declare const ACTION_RESULT: Readonly<{
    ERROR_BAD_PAYLOAD: "ERROR_BAD_PAYLOAD";
    ERROR_UNAUTHENTICATED: "ERROR_UNAUTHENTICATED";
    ERROR_UNAUTHORIZED: "ERROR_UNAUTHORIZED";
    ERROR_UNPROCESSABLE: "ERROR_UNPROCESSABLE";
    ERROR_NOT_FOUND: "ERROR_NOT_FOUND";
    ERROR_INTERNAL_ERROR: "ERROR_INTERNAL_ERROR";
    UNIT: "";
    SUCCESS_CREATE: "SUCCESS_CREATE";
    SUCCESS_UPDATE: "SUCCESS_UPDATE";
    SUCCESS_DELETE: "SUCCESS_DELETE";
}>;
export type ActionResultUnion = ActionSuccessResultUnion | ActionErrorResultUnion;
export default ACTION_RESULT;
