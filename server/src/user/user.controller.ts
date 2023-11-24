import { BaseController } from "../app/base.controller";
import { Router, RequestHandler } from "express";
import AsyncHandler from "express-async-handler";
import { AppMiddleware } from "../app/middlewares";
import { Service } from "typedi";
import { UserRepository } from "../database/user.repository";

@Service()
export class UserController extends BaseController {

    constructor(
        private readonly userRepository: UserRepository,
        private readonly middlewares: AppMiddleware,
    ) {
        super();
    }

    onInfo: RequestHandler = async (req, res) => {
        const { id, verified, username, role } = req.user!;
        return this.ok(res, { id, verified, username, role });
    }

    getAccounts: RequestHandler = async (req, res) => {

        const user = req.user!;

        if (user.role == "admin") {
            const allAccounts = await this.userRepository.getAllUsersAccounts();

            return this.ok(res, { accounts: allAccounts });
        }

        const userAccounts = await this.userRepository.getUserAccounts(user.id);

        return this.ok(res, { accounts: userAccounts });
    }

    routes() {
        const router = Router();

        router.use(this.middlewares.parseJwt.bind(this.middlewares));

        router.use(this.middlewares.includeUser.bind(this.middlewares));

        router.get("/me", AsyncHandler(this.onInfo.bind(this)));

        router.get("/accounts", AsyncHandler(this.getAccounts.bind(this)));

        return router;
    }

}