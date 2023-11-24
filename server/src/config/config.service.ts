import { ConfigModel, EnvironmentVars, ConfigModelSchema } from "./types";
import { config as loadConfig } from "dotenv";
import path from "path";
import { formatZodErrors } from "../app/utils";
import { Service } from "typedi";

@Service()
export class ConfigService {

    private config: Partial<ConfigModel> = {};

    load() {
        //load environment variables.
        if (process.env["NODE_ENV"] !== "production") {
            loadConfig({ path: path.join(process.cwd(), ".env") });
        }
        this.config.s3xplorer_admin = process.env["S3XPLORER_ADMIN"];
        this.config.s3xplorer_admin_pass = process.env["S3XPLORER_ADMIN_PASS"];
        this.config.db_host = process.env["DB_HOST"];
        this.config.db_port = process.env["DB_PORT"] ? parseInt(process.env["DB_PORT"]) : undefined;
        this.config.db_name = process.env["DB_NAME"];
        this.config.db_user = process.env["DB_USER"];
        this.config.db_pass = process.env["DB_PASS"];
        this.config.jwt_secret = process.env["JWT_SECRET"];
        this.config.port = process.env["PORT"] ? parseInt(process.env["PORT"]) : undefined;
        this.config.env = process.env["NODE_ENV"] || "development";

        const validationCheck = ConfigModelSchema.safeParse(this.config);

        if (!validationCheck.success) {
            throw new Error(`Invalid environement config \n ${JSON.stringify(formatZodErrors(validationCheck.error), null, 2)}`);
        }

        this.config = validationCheck.data;
    }

    get<T>(key: EnvironmentVars) {
        return this.config[key] as T;
    }

}