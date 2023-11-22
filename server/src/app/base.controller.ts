import { AppDependency } from "./types";
import { Response } from "express";
import { HttpStatus, ServerResponse } from "./types";

export class BaseController {

    protected deps: AppDependency;

    constructor(deps: AppDependency) {
        this.deps = deps;
    }

    ok(res: Response, data: any) {
        return res.status(HttpStatus.Ok).json(ServerResponse.OkResponse(data));
    }

    serverError(res: Response) {
        return res.status(HttpStatus.InternalServerError).json(ServerResponse.ErrorResponse("internal server error", undefined));
    }

    created(res: Response, data: any) {
        return res.status(HttpStatus.Created).json(ServerResponse.OkResponse(data));
    }

    badRequest(res: Response, errors: any) {
        return res.status(HttpStatus.BadRequest).json(ServerResponse.ErrorResponse("Bad request", errors));
    }

    unauthorized(res: Response, errors: any) {
        return res.status(HttpStatus.Unauthorized).json(ServerResponse.ErrorResponse("Unauthorized", errors));
    }

    forbidden(res: Response, errors: any) {
        return res.status(HttpStatus.Forbidden).json(ServerResponse.ErrorResponse("Forbidden", errors));
    }

    noContent(res: Response) {
        return res.status(HttpStatus.NoContent).json();
    }

    notFound(res: Response, errors: any) {
        return res.status(HttpStatus.NotFound).json(ServerResponse.ErrorResponse("not found", errors));
    }

    notSupported(res: Response, errors: any) {
        return res.status(HttpStatus.MethodNotSupported).json(ServerResponse.ErrorResponse("method not supported", errors));
    }
}