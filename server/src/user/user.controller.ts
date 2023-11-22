import { BaseController } from "../app/base.controller";
import { AppDependency } from "../app/types";
import { Router, RequestHandler } from "express";
import AsyncHandler from "express-async-handler";
import { AppMiddleware } from "../app/middlewares";

export class UserController extends BaseController {

    constructor(deps: AppDependency) {
        super(deps);
    }

    onInfo: RequestHandler = async (req, res) => {
        return this.ok(res, { info: req.user });
    }

    getAccounts: RequestHandler = async (req, res) => {

        const user = req.user!;

        if (user.role == "admin") {
            const allAccounts = await this.deps.userRepository.getAllUsersAccounts();

            return this.ok(res, { accounts: allAccounts });
        }

        const userAccounts = await this.deps.userRepository.getUserAccounts(user.id);

        return this.ok(res, { accounts: userAccounts });
    }

    routes(middlewares: AppMiddleware) {
        const router = Router();

        router.use(middlewares.parseJwt.bind(middlewares));

        router.use(middlewares.includeUser.bind(middlewares));

        router.get("/me", AsyncHandler(this.onInfo.bind(this)));

        router.get("/accounts", AsyncHandler(this.getAccounts.bind(this)));

        return router;
    }

}