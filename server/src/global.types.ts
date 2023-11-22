import { User } from "./database/custom.types";

declare module 'express-serve-static-core' {
    interface Request {
        user?: User
    }
}