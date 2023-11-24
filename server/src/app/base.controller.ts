import { Response } from "express";
import { HttpStatus, ServerResponse } from "./types";

export class BaseController {

    protected ok(res: Response, data: any) {
        return res.status(HttpStatus.Ok).json(ServerResponse.OkResponse(data));
    }

    protected serverError(res: Response) {
        return res.status(HttpStatus.InternalServerError).json(ServerResponse.ErrorResponse("internal server error", undefined));
    }

    protected created(res: Response, data: any) {
        return res.status(HttpStatus.Created).json(ServerResponse.OkResponse(data));
    }

    protected badRequest(res: Response, errors: any) {
        return res.status(HttpStatus.BadRequest).json(ServerResponse.ErrorResponse("Bad request", errors));
    }

    protected unauthorized(res: Response, errors: any) {
        return res.status(HttpStatus.Unauthorized).json(ServerResponse.ErrorResponse("Unauthorized", errors));
    }

    protected forbidden(res: Response, errors: any) {
        return res.status(HttpStatus.Forbidden).json(ServerResponse.ErrorResponse("Forbidden", errors));
    }

    protected noContent(res: Response) {
        return res.status(HttpStatus.NoContent).json();
    }

    protected notFound(res: Response, errors: any) {
        return res.status(HttpStatus.NotFound).json(ServerResponse.ErrorResponse("not found", errors));
    }

    protected notSupported(res: Response, errors: any) {
        return res.status(HttpStatus.MethodNotSupported).json(ServerResponse.ErrorResponse("method not supported", errors));
    }
}