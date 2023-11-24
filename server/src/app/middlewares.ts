import { ErrorRequestHandler, RequestHandler } from "express";
import { BaseController } from "./base.controller";
import { IdParseSchema } from "./types";
import { Service } from "typedi";
import { ConfigService } from "../config/config.service";
import { JwtService } from "../auth/jwt.service";
import { UserRepository } from "../database/user.repository";

@Service()
export class AppMiddleware extends BaseController {

    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly userRepository: UserRepository,
    ) {
        super();
    }

    onGlobalError: ErrorRequestHandler = (err, req, res) => {
        console.error(err);

        return this.serverError(res);
    }

    onNotFound: RequestHandler = (req, res,) => {

        return this.notFound(res, `path ${req.method}@${req.originalUrl} not found`);

    }

    secureHeaders: RequestHandler = (req, res, next) => {

        res.setHeader('X-Frame-Options', "deny");
        res.setHeader('X-Content-Type-Options', "nosniff");
        // res.setHeader('Content-Security-Policy', "default-src 'self'; form-action 'self'; object-src 'none'; frame-ancestors 'none'; upgrade-insecure-requests; block-all-mixed-content");
        res.setHeader('X-Permitted-Cross-Domain-Policies', "none");
        res.setHeader('Referrer-Policy', "no-referrer");
        // res.setHeader('Clear-Site-Data', `"cache","cookies","storage"`);
        res.setHeader('Cache-Control', "no-store, max-age=0");
        res.setHeader('Pragma', "no-cache");
        next();
    }

    onPing: RequestHandler = (req, res) => {
        const env = this.configService.get<string>('env');

        return this.ok(res, { environment: env, status: "ok" });
    }

    parseJwt: RequestHandler = async (req, res, next) => {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return next();
        }

        const [scheme, token] = authHeader.split(' ');

        if (scheme !== "Bearer") {
            return next();
        }

        if (!token) {
            return next();
        }

        const secret = this.configService.get<string>("jwt_secret");
        try {
            const payload = await this.jwtService.verifyToken(token, secret);
            req.headers["x-user-id"] = `${payload.id}`;
        } catch (error) {
            console.error(`error parsing token: ${error}`);
        }

        return next();
    }

    includeUser: RequestHandler = async (req, res, next) => {

        if (!req.headers["x-user-id"]) {
            return this.forbidden(res, "need to login to view this resource");
        }

        const userId = req.headers["x-user-id"];

        const parseUserId = await IdParseSchema.safeParseAsync(userId);

        if (!parseUserId.success) {
            return this.forbidden(res, `invalid credentials`);
        }

        const user = await this.userRepository.findById(parseUserId.data);

        if (!user) {
            return this.forbidden(res, `invalid credentials`);
        }

        req.user = user;

        return next();
    }
}