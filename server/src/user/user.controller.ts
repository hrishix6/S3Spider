import { BaseController } from "../app/base.controller";
import { Router, RequestHandler } from "express";
import AsyncHandler from "express-async-handler";
import { AppMiddleware } from "../app/middlewares";
import { Service } from "typedi";
import { UserRepository } from "../database/user.repository";
import { UpdateUserAccountsRequest, UpdateUsersRequest } from "../auth/types";
import { AppErrorCode, IdParseSchema } from "../app/types";

@Service()
export class UserController extends BaseController {

    constructor(
        private readonly userRepository: UserRepository,
        private readonly middlewares: AppMiddleware,
    ) {
        super();
    }

    onGetUsers: RequestHandler = async (req, res) => {
        const user = req.user!;

        if (user.role !== "admin") {
            return this.forbidden(res, AppErrorCode.FORBIDDEN_OPERATION);
        }

        const allUsers = await this.userRepository.getAllUsers();

        return this.ok(res, allUsers);
    }

    onGetAccounts: RequestHandler = async (req, res) => {
        const user = req.user!;

        if (user.role !== "admin") {
            return this.forbidden(res, AppErrorCode.FORBIDDEN_OPERATION);
        }

        const { userId } = req.params;

        const userIdParsed = await IdParseSchema.safeParseAsync(userId);

        if (!userIdParsed.success) {
            return this.badRequest(res, AppErrorCode.BAD_USERID);
        }

        const allAwsAccounts = await this.userRepository.getAllAwsAccounts();

        const userAssignedAccountsIds = (await this.userRepository.getUserAccounts(userIdParsed.data)).map(x => x.id);

        const data = allAwsAccounts.map(x => ({ ...x, assigned: userAssignedAccountsIds.includes(x.id) }));

        return this.ok(res, data);
    }

    onUpdateUsers: RequestHandler = async (req, res) => {
        const user = req.user!;

        if (user.role !== "admin") {
            return this.forbidden(res, AppErrorCode.FORBIDDEN_OPERATION);
        }

        const { body } = req;

        const parsedPayload = await UpdateUsersRequest.safeParseAsync(body);

        if (!parsedPayload.success) {
            return this.badRequest(res, AppErrorCode.BAD_USER_UPDATE_OPERATION);
        }

        const { payload } = parsedPayload.data;

        if (!payload.length) {
            return this.noContent(res);
        }

        await this.userRepository.updateUsers(parsedPayload.data);

        return this.noContent(res);
    }

    onUpdateUserAccounts: RequestHandler = async (req, res) => {

        const user = req.user!;

        if (user.role !== "admin") {
            return this.forbidden(res, AppErrorCode.FORBIDDEN_OPERATION);
        }

        const { userId } = req.params;

        const userIdParsed = await IdParseSchema.safeParseAsync(userId);

        if (!userIdParsed.success) {
            return this.badRequest(res, AppErrorCode.BAD_USERID);
        }

        const { body } = req;

        const parsedPayload = await UpdateUserAccountsRequest.safeParseAsync(body);

        if (!parsedPayload.success) {
            return this.badRequest(res, AppErrorCode.BAD_USER_ACCOUNTS_UPDATE);
        }

        const { accounts } = parsedPayload.data;

        if (!accounts.length) {
            return this.noContent(res);
        }

        await this.userRepository.updateUserAccounts(userIdParsed.data, accounts);

        return this.noContent(res);
    }

    onInfo: RequestHandler = async (req, res) => {
        const { id, verified, username, role } = req.user!;

        if (role == "admin") {
            const allAccounts = await this.userRepository.getAllAwsAccounts();
            return this.ok(res, { id, verified, username, role, accounts: allAccounts });
        }

        const userAccounts = await this.userRepository.getUserAccounts(id);

        return this.ok(res, { id, verified, username, role, accounts: userAccounts });
    }

    getAccounts: RequestHandler = async (req, res) => {

        const user = req.user!;

        if (user.role == "admin") {
            const allAccounts = await this.userRepository.getAllAwsAccounts();

            return this.ok(res, { accounts: allAccounts });
        }

        const userAccounts = await this.userRepository.getUserAccounts(user.id);

        return this.ok(res, { accounts: userAccounts });
    }

    routes() {
        const router = Router();

        router.use(this.middlewares.parseJwt.bind(this.middlewares));

        router.use(this.middlewares.includeUser.bind(this.middlewares));

        router.get("/", AsyncHandler(this.onGetUsers.bind(this)));

        router.put("/", AsyncHandler(this.onUpdateUsers.bind(this)));

        router.route("/:userId/accounts")
            .get(AsyncHandler(this.onGetAccounts.bind(this)))
            .put(AsyncHandler(this.onUpdateUserAccounts.bind(this)));

        router.get("/me", AsyncHandler(this.onInfo.bind(this)));

        router.get("/accounts", AsyncHandler(this.getAccounts.bind(this)));

        return router;
    }

}