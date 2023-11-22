import { AppDependency } from "./types";
import express from "express";
import { AppMiddleware } from "./middlewares";
import cors from "cors";
import { AuthController } from "../auth/auth.controller";
import { UserController } from "../user/user.controller";
// import { AuthController } from "../auth/auth.controller";

export class App {
    static setup(deps: AppDependency) {
        const app = express();
        const middlwares = new AppMiddleware(deps);
        const authController = new AuthController(deps);
        const userController = new UserController(deps);
        app.disable('x-powered-by');
        app.use(cors({
            methods: ["GET", "POST", "DELETE", 'PATCH', "PUT", "OPTIONS", "HEAD"],
        }));
        app.use(express.json());
        app.use(middlwares.secureHeaders);

        app.get('/api/v1', middlwares.onPing);

        app.use("/auth", authController.routes());

        app.use("/user", userController.routes(middlwares));

        app.use("*", middlwares.onNotFound);
        app.use(middlwares.onGlobalError);

        return app;
    }
}