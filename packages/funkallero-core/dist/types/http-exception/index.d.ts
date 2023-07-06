interface IErrorResponse {
    message: string;
    error?: unknown;
}
declare class HttpException extends Error {
    readonly statusCode: number;
    readonly error?: unknown;
    constructor(message: string, statusCode: number, error?: IErrorResponse['error']);
    toResponse(): IErrorResponse;
    static malformedBody(message?: string | null, error?: IErrorResponse['error']): HttpException;
    static unauthorized(message?: string | null, error?: IErrorResponse['error']): HttpException;
    static forbidden(message?: string | null, error?: IErrorResponse['error']): HttpException;
    static notFound(message?: string | null, error?: IErrorResponse['error']): HttpException;
    static illegalMethod(message?: string | null, error?: IErrorResponse['error']): HttpException;
    static unprocessable(message?: string | null, error?: IErrorResponse['error']): HttpException;
    static internal(message?: string | null, error?: IErrorResponse['error']): HttpException;
}
export default HttpException;
