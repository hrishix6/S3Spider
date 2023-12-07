import { Response } from "express";
import { AppErrorCode, HttpStatus, ServerResponse } from "./types";

export class BaseController {

    protected ok(res: Response, data: any) {
        return res.status(HttpStatus.Ok).json(ServerResponse.OkResponse(data));
    }

    protected serverError(res: Response, code: AppErrorCode) {
        return res.status(HttpStatus.InternalServerError).json(ServerResponse.ErrorResponse(code));
    }

    protected created(res: Response, data: any) {
        return res.status(HttpStatus.Created).json(ServerResponse.OkResponse(data));
    }

    protected badRequest(res: Response, code: AppErrorCode) {
        return res.status(HttpStatus.BadRequest).json(ServerResponse.ErrorResponse(code));
    }

    protected unauthorized(res: Response, code: AppErrorCode) {
        return res.status(HttpStatus.Unauthorized).json(ServerResponse.ErrorResponse(code));
    }

    protected forbidden(res: Response, code: AppErrorCode) {
        return res.status(HttpStatus.Forbidden).json(ServerResponse.ErrorResponse(code));
    }

    protected noContent(res: Response) {
        return res.status(HttpStatus.NoContent).json();
    }

    protected notFound(res: Response, code: AppErrorCode) {
        return res.status(HttpStatus.NotFound).json(ServerResponse.ErrorResponse(code));
    }

    protected notSupported(res: Response, code: AppErrorCode) {
        return res.status(HttpStatus.MethodNotSupported).json(ServerResponse.ErrorResponse(code));
    }
}