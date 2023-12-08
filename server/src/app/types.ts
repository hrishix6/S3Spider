import { z } from "zod";

export const IdParseSchema = z.coerce.number().safe().positive();

export const awsAccountIdSchema = z.string().min(1);

export enum HttpStatus {
    NotFound = 404,
    NoContent = 204,
    Ok = 200,
    Created = 201,
    InternalServerError = 500,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    MethodNotSupported = 405
}

export enum AppErrorCode {
    //SUCCESS
    NO_ERROR = 0,

    //s3
    NO_BUCKET_ACCESS = 1000,
    NO_ACCOUNT_ACCESS = 1001,
    OPERATION_NOT_ALLOWED = 1002,
    INVALID_ACCOUNT = 1003,
    INVALID_BUCKET = 1004,
    INVALID_FOLDER = 1005,
    INVALID_FILE = 1006,
    S3_SERVICE_ERROR = 1007,
    BAD_PRESIGNED_REQ = 1008,
    BAD_DELETION_REQ = 1009,
    BAD_RENAME_REQ = 1010,
    BAD_COPY_REQ = 1011,
    RENAME_FAILED = 1012,
    COPY_FAILED = 1013,
    BAD_REGION = 1014,


    //AUTH
    TOKEN_EXPIRED = 2000,
    BAD_CREDENTIALS = 2001,
    BAD_SIGNUP = 2003,
    PENDING_VERIFICATION = 2002,
    FORBIDDEN_OPERATION = 2004,


    //USER
    BAD_USERID = 3000,
    BAD_USER_UPDATE_OPERATION = 3001,
    BAD_USER_ACCOUNTS_UPDATE = 3002,

    //SERVER
    SERVER_NOT_REACHABLE = 5000,
    SERVER_FAILURE = 5001,
    SERVER_UNSUPPORTED_OPERATION = 5002
}

export class ServerResponse {

    public data?: any = undefined;
    public success: boolean;
    public errorCode: AppErrorCode;

    static OkResponse(data: any) {
        const response = new ServerResponse();
        response.success = true;
        response.errorCode = AppErrorCode.NO_ERROR;
        response.data = data;
        return response;
    }

    static ErrorResponse(appErrorCode: AppErrorCode) {
        const response = new ServerResponse();
        response.success = false;
        response.errorCode = appErrorCode;
        return response;
    }
}

export interface OperationResult<T> {
    success: boolean;
    data: T;
    error?: unknown
}

