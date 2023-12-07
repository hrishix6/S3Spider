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

        const _: Record<string, any> = {};

        _.s3xplorer_admin = process.env["S3XPLORER_ADMIN"];
        _.s3xplorer_admin_pass = process.env["S3XPLORER_ADMIN_PASS"];
        _.db_host = process.env["DB_HOST"];
        _.db_port = process.env["DB_PORT"];
        _.db_name = process.env["DB_NAME"];
        _.db_user = process.env["DB_USER"];
        _.db_pass = process.env["DB_PASS"];
        _.jwt_secret = process.env["JWT_SECRET"];
        _.port = process.env["PORT"];
        _.env = process.env["NODE_ENV"] || "development";
        _.frontend_url = process.env["FROTEND_CLIENT"];
        _.cache_enabled = process.env["CACHE_ENABLED"];
        _.cache_host = process.env["CACHE_HOST"];
        _.cache_user = process.env["CACHE_USER"];
        _.cache_pass = process.env["CACHE_PASS"];
        _.cache_port = process.env["CACHE_PORT"];


        const validationCheck = ConfigModelSchema.safeParse(_);

        if (!validationCheck.success) {
            throw new Error(`Invalid environement config \n ${JSON.stringify(formatZodErrors(validationCheck.error), null, 2)}`);
        }

        this.config = validationCheck.data;
    }

    get<T>(key: EnvironmentVars) {
        return this.config[key] as T;
    }

}