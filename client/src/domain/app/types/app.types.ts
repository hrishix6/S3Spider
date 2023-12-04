export type UserRole = 'none' | 'admin' | 'viewer' | 'user';

export interface AwsAccounts {
    id: number;
    aws_id: string;
    name: string;
}

export interface UserInfo {
    id: number;
    verified: boolean;
    username: string;
    role: UserRole;
    accounts: AwsAccounts[];
}

export interface AppState {
    currentAccount: string;
    loading: boolean;
    error: boolean;
    mobileSidebar: boolean;
    errorMessage: string;
    isAuthenticated: boolean;
    role: UserRole;
    awsAccounts: AwsAccounts[];
    noAccounts: boolean;
    userId: number;
    sessionEnded: boolean;
}

export enum AppErrorCode {
    //SUCCESS
    NO_ERROR = 0,

    //s3
    NO_BUCKET_ACCESS = 1000,
    NO_ACCOUNT_ACCESS = 1001,
    OPERATION_NOT_ALLOWED = 1002,
    INVALID_ACCOUNT = 1003,
    INVALID_BUCKET = 10004,
    INVALID_FOLDER = 1005,
    INVALID_FILE = 1006,
    S3_SERVICE_ERROR = 1007,
    BAD_PRESIGNED_REQ = 1008,
    BAD_DELETION_REQ = 1009,

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

export function getToastErrorMessage(errorCode: AppErrorCode): string {
    let errorMsg = "";

    switch (errorCode) {
        //s3
        case AppErrorCode.NO_BUCKET_ACCESS:
            errorMsg = "You don't have access to this bucket"
            break;
        case AppErrorCode.NO_ACCOUNT_ACCESS:
            errorMsg = "You don't have access to this account"
            break;
        case AppErrorCode.OPERATION_NOT_ALLOWED:
            errorMsg = "You don't have permission to perform this operation"
            break;
        case AppErrorCode.INVALID_ACCOUNT:
        case AppErrorCode.INVALID_BUCKET:
        case AppErrorCode.INVALID_FOLDER:
        case AppErrorCode.INVALID_FILE:
        case AppErrorCode.S3_SERVICE_ERROR:
        case AppErrorCode.BAD_DELETION_REQ:
        case AppErrorCode.BAD_PRESIGNED_REQ:
            errorMsg = "S3 service returned an error"
            break;

        case AppErrorCode.TOKEN_EXPIRED:
            errorMsg = "Your session has expired, please login"
            break;
        case AppErrorCode.BAD_CREDENTIALS:
            errorMsg = "Please check your credentials"
            break;
        case AppErrorCode.BAD_SIGNUP:
            errorMsg = "Failed to signup"
            break;
        case AppErrorCode.PENDING_VERIFICATION:
            errorMsg = "Your Account is pending admin verification"
            break;
        case AppErrorCode.FORBIDDEN_OPERATION:
            errorMsg = "You don't have permission to perform this operation"
            break;

        case AppErrorCode.BAD_USERID:
            errorMsg = "Couldn't find that user";
            break;
        case AppErrorCode.BAD_USER_UPDATE_OPERATION:
            errorMsg = "Failed to update user information";
            break;
        case AppErrorCode.BAD_USER_ACCOUNTS_UPDATE:
            errorMsg = "Failed to update aws accounts user has access to";
            break;
        case AppErrorCode.SERVER_NOT_REACHABLE:
            errorMsg = "Couldn't reach servers.";
            break;
        case AppErrorCode.SERVER_FAILURE:
            errorMsg = "Something went wrong";
            break;
        case AppErrorCode.SERVER_UNSUPPORTED_OPERATION:
            errorMsg = "Unsupported operation"
            break;
        default:
            errorMsg = "Something went wrong";
            break;
    }

    return errorMsg;
}

export interface ApiResult<T> {
    data: T,
    success: boolean;
    errorCode: AppErrorCode
}