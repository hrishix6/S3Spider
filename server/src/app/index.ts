import express, { NextFunction, Request, Response } from "express";
import { AppMiddleware } from "./middlewares";
import cors, { CorsOptions } from "cors";
import { AuthController } from "../auth/auth.controller";
import { UserController } from "../user/user.controller";
import morgan from "morgan";
import Container from "typedi";
import { S3Controller } from "../s3/s3.controller";

export class App {
    static setup() {
        const app = express();
        const middlwares = Container.get(AppMiddleware);
        const authController = Container.get(AuthController);
        const userController = Container.get(UserController);
        const s3Controller = Container.get(S3Controller)
        app.disable('x-powered-by');
        app.use(morgan("dev"));

        const origin = process.env.NODE_ENV == "production" ? process.env["FRONTEND_CLIENT"]?.split(",") || [] : "*";

        console.log(`Allowed Origins: ${origin}`);

        const corsOptions: CorsOptions = {
            origin: origin,
            optionsSuccessStatus: 200,
            methods: ["GET", "POST", "DELETE", 'PATCH', "PUT", "OPTIONS", "HEAD"],
            credentials: true,
            allowedHeaders: ["Authorization", "Content-Type", "Accept"]
        };

        app.use(cors(corsOptions));
        app.use(express.json());

        app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
            if (err instanceof SyntaxError) {
                console.error(err);
                return res.status(400).json({ success: false, error: "Invalid json" });
            }
            next();
        })

        app.use(middlwares.secureHeaders.bind(middlwares));

        app.get('/api', middlwares.onPing.bind(middlwares));

        app.use("/api/auth", authController.routes());

        app.use("/api/user", userController.routes());

        app.use("/api/s3", s3Controller.routes());

        app.use("*", middlwares.onNotFound.bind(middlwares));
        app.use(middlwares.onGlobalError.bind(middlwares));

        return app;
    }
}