interface BaseErrorConstructor {
    message: string;
}

class BaseError extends Error {
    constructor(data: BaseErrorConstructor) {
        super(data.message);
        this.name = 'BaseError';
    }
}

export interface NetworkErrorConstructor extends BaseErrorConstructor {
    readonly statusCode: number;
}

export class NetworkError extends BaseError {
    readonly statusCode: NetworkErrorConstructor['statusCode'];

    constructor(data: NetworkErrorConstructor) {
        super(data);
        this.name = 'NetworkError';
        this.statusCode = data.statusCode;
    }

    public static isNetworkError(error: unknown): error is NetworkError {
        return error instanceof NetworkError;
    }

    get isInformationCode() {
        return this.statusCode >= 100 && this.statusCode < 200;
    }

    get isSuccessCode() {
        return this.statusCode >= 200 && this.statusCode < 300;
    }

    get isRedirectCode() {
        return this.statusCode >= 300 && this.statusCode < 400;
    }

    get isClientCode() {
        return this.statusCode >= 400 && this.statusCode < 500;
    }

    get isServerCode() {
        return this.statusCode >= 500 && this.statusCode < 600;
    }

    get isOk() {
        return this.statusCode === 200;
    }

    get isCreated() {
        return this.statusCode === 201;
    }

    get isNoContent() {
        return this.statusCode === 204;
    }

    get isBadRequest() {
        return this.statusCode === 400;
    }

    get isUnauthorized() {
        return this.statusCode === 401;
    }

    get isForbidden() {
        return this.statusCode === 403;
    }

    get isNotFound() {
        return this.statusCode === 404;
    }

    get isInternalServiceError() {
        return this.statusCode === 500;
    }

    get isNotImplemented() {
        return this.statusCode === 501;
    }

    get isBadGateway() {
        return this.statusCode === 502;
    }

    get isServiceUnavailable() {
        return this.statusCode === 503;
    }

    get isGatewayTimeout() {
        return this.statusCode === 504;
    }
}
