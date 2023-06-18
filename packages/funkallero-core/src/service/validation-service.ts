import type { Promisify } from '../types';

type ValidateReturnUnion = IValidateApiSuccess<any> | IValidateApiError;

export type ValidateReturn = Promisify<ValidateReturnUnion>;

export interface IValidateApiSuccess<TSchema = any> {
    success: true;
    data: TSchema;
}

export interface IValidateApiError {
    success: false;
    error: Record<string, string>;
}

interface IValidationService<TValidateType = any> {
    validate(payload: any, validation: TValidateType): ValidateReturn;
}

export default IValidationService;
