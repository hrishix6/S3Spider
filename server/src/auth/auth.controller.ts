import { BaseController } from "../app/base.controller";
import { Router, RequestHandler } from "express";
import AsyncHandler from "express-async-handler";
import { LoginRequestSchema, RegisterRequestSchema } from "./types";
import { Service } from "typedi";
import { UserRepository } from "../database/user.repository";
import { PasswordService } from "./password.service";
import { ConfigService } from "../config/config.service";
import { JwtService } from "./jwt.service";
import { Account } from "../database/custom.types";
import { AppErrorCode } from "../app/types";

@Service()
export class AuthController extends BaseController {

    constructor(
        private readonly userRepository: UserRepository,
        private readonly pwService: PasswordService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService
    ) {
        super();
    }

    onLogin: RequestHandler = async (req, res) => {

        const { body } = req;

        const result = await LoginRequestSchema.safeParseAsync(body);

        if (!result.success) {
            return this.badRequest(res, AppErrorCode.BAD_CREDENTIALS);
        }

        const { username, password } = result.data;

        const user = await this.userRepository.findByUsernameOrmail(username);

        if (!user) {
            return this.unauthorized(res);
        }

        if (!user.verified) {
            return this.forbidden(res, AppErrorCode.PENDING_VERIFICATION);
        }

        const pwMatch = await this.pwService.compare(password, user.password);

        if (!pwMatch) {
            return this.unauthorized(res);
        }

        let accounts: Account[] = [];

        if (user.role == "admin") {
            accounts = await this.userRepository.getAllAwsAccounts();
        }
        else {
            accounts = await this.userRepository.getUserAccounts(user.id);
        }

        //valid credentials
        const payload = { id: user.id };
        const key = this.configService.get<string>("jwt_secret");
        const token = await this.jwtService.signToken(payload, key);

        return this.ok(res, {
            id: user.id,
            role: user.role,
            username: user.username,
            verified: user.verified,
            access_token: token,
            accounts
        });

    }

    onRegister: RequestHandler = async (req, res) => {
        const { body } = req;

        const result = await RegisterRequestSchema.safeParseAsync(body);

        if (!result.success) {
            return this.badRequest(res, AppErrorCode.BAD_SIGNUP);
        }

        const { password, email } = result.data;

        result.data.password = await this.pwService.hash(password);
        if (email) {
            result.data.email = email.toUpperCase();
        }

        const insertedId = await this.userRepository.insert(result.data);

        if (insertedId) {
            return this.created(res, "Sign up success");
        }

        return this.serverError(res, AppErrorCode.SERVER_FAILURE);
    }

    routes() {
        const router = Router();
        router.post("/login", AsyncHandler(this.onLogin.bind(this)));

        router.post("/register", AsyncHandler(this.onRegister.bind(this)));
        return router;
    }

}