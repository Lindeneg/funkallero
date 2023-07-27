const MESSAGES = {
    malformedBody: 'The requested action could not be exercised due to malformed syntax.',
    unauthorized:
        'The provided credentials are either invalid or has insufficient privilege to perform the requested action.',
    notFound: 'The requested resource could not be found.',
    illegalMethod: 'The requested action is made using an illegal method.',
    unprocessable:
        'The request was well-formed but not honored. Perhaps the action trying to be performed has already been done?',
    internal: 'Something went wrong. Please try again later.',
};

interface IErrorResponse {
    message: string;
    error?: unknown;
}

class HttpException extends Error {
    readonly statusCode: number;
    readonly error?: unknown;

    constructor(message: string, statusCode: number, error?: IErrorResponse['error']) {
        super(message);

        this.statusCode = statusCode;
        this.error = error;
    }

    public toResponse(): IErrorResponse {
        const response: IErrorResponse = {
            message: this.message,
        };

        if (typeof this.error !== 'undefined') {
            response.error = this.error;
        }

        return response;
    }

    public static malformedBody(message: string | null = null, error?: IErrorResponse['error']) {
        return new HttpException(message || MESSAGES.malformedBody, 400, error);
    }

    public static unauthorized(message: string | null = null, error?: IErrorResponse['error']) {
        return new HttpException(message || MESSAGES.unauthorized, 401, error);
    }

    public static forbidden(message: string | null = null, error?: IErrorResponse['error']) {
        return new HttpException(message || MESSAGES.unauthorized, 403, error);
    }

    public static notFound(message: string | null = null, error?: IErrorResponse['error']) {
        return new HttpException(message || MESSAGES.notFound, 404, error);
    }

    public static illegalMethod(message: string | null = null, error?: IErrorResponse['error']) {
        return new HttpException(message || MESSAGES.illegalMethod, 405, error);
    }

    public static unprocessable(message: string | null = null, error?: IErrorResponse['error']) {
        return new HttpException(message || MESSAGES.unprocessable, 422, error);
    }

    public static internal(message: string | null = null, error?: IErrorResponse['error']) {
        return new HttpException(message || MESSAGES.internal, 500, error);
    }
}

export default HttpException;
