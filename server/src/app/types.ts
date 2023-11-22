import { IJwtService } from "../auth/jwt.service";
import { IPasswordService } from "../auth/password.service";
import { ConfigService } from "../config/config.service";
import { IUserRepository } from "../database/user.repository";
import { IS3Service } from "../s3";
import { z } from "zod";

export const IdParseSchema = z.coerce.number().safe().positive();

export interface AppDependency {
    configService: ConfigService;
    s3Service: IS3Service;
    jwtService: IJwtService;
    pwService: IPasswordService;
    userRepository: IUserRepository
}

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

export class ServerResponse {

    public data?: any = undefined;
    public success: boolean;
    public error?: any = undefined;

    static OkResponse(data: any) {
        const response = new ServerResponse();
        response.success = true;
        response.data = data;
        return response;
    }

    static ErrorResponse(errorMessage: string, errorDetails: any) {
        const response = new ServerResponse();
        response.success = false;
        response.error = { message: errorMessage, details: errorDetails };
        return response;
    }
}

export interface OperationResult<T> {
    success: boolean;
    data: T;
    error?: unknown
}

