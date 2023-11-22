import { BaseController } from "../app/base.controller";
import { AppDependency } from "../app/types";
import { Router, RequestHandler } from "express";
import AsyncHandler from "express-async-handler";
import { LoginRequestSchema, RegisterRequestSchema } from "./types";
import { formatZodErrors } from "../app/utils";

export class AuthController extends BaseController {

    constructor(deps: AppDependency) {
        super(deps);
    }

    onLogin: RequestHandler = async (req, res) => {

        const { body } = req;

        const result = await LoginRequestSchema.safeParseAsync(body);

        if (!result.success) {
            return this.badRequest(res, formatZodErrors(result.error));
        }

        const { username, password } = result.data;

        const user = await this.deps.userRepository.findByUsername(username);

        if (!user) {
            return this.unauthorized(res, 'invalid credentials');
        }

        if (!user.verified) {
            return this.forbidden(res, 'user is unverified');
        }

        const pwMatch = await this.deps.pwService.compare(password, user.password);

        if (!pwMatch) {
            return this.unauthorized(res, 'invalid credentials');
        }

        //valid credentials
        const payload = { id: user.id };
        const key = this.deps.configService.get<string>("jwt_secret");
        const token = await this.deps.jwtService.signToken(payload, key);

        return this.ok(res, {
            access_token: token
        });

    }

    onRegister: RequestHandler = async (req, res) => {
        const { body } = req;

        const result = await RegisterRequestSchema.safeParseAsync(body);

        if (!result.success) {
            return this.badRequest(res, formatZodErrors(result.error));
        }

        const { password } = result.data;

        result.data.password = await this.deps.pwService.hash(password);

        const insertedId = await this.deps.userRepository.insert(result.data);

        if (insertedId) {
            return this.created(res, "Sign up success");
        }

        return this.serverError(res);
    }

    routes() {
        const router = Router();
        router.post("/login", AsyncHandler(this.onLogin.bind(this)));

        router.post("/register", AsyncHandler(this.onRegister.bind(this)));
        return router;
    }

}