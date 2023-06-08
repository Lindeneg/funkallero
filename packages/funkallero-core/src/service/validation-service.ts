import type { Request, Promisify } from '../types';

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

export type Validation<TValidateType = any> = Record<string, TValidateType>;

interface IValidationService<TValidateType = any> {
    validate(request: Request, property: keyof Validation<TValidateType>, validation: TValidateType): ValidateReturn;
}

export default IValidationService;
