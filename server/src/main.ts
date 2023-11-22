import http from "http";
import { S3Service, initClients } from "./s3";
import { ConfigService } from "./config/config.service";
import { PoolConfig } from "pg";
import { CreateAdminIfNotExists, GetConnection } from "./database";
import { JwtService } from "./auth/jwt.service";
import { PasswordService } from "./auth/password.service";
import { AppDependency } from "./app/types";
import { App } from "./app";
import { InsertUser } from "./database/custom.types";
import { UserRepository } from "./database/user.repository";

function listenAsync(server: http.Server, port: number) {
    return new Promise((resolve, reject) => {
        server.listen(port);
        server.once("listening", () => {
            resolve(null);
        });
        server.once("error", (err) => {
            reject(err);
        })
    });
}

process.on("uncaughtException", (e) => {
    console.error('Uncaught Exception:', e);
});

process.on("unhandledRejection", (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

async function main() {

    const configService = new ConfigService();


    //load config.
    configService.load();

    //initialize db pool.
    const poolCfg: PoolConfig = {
        host: configService.get("db_host"),
        port: configService.get("db_port"),
        user: configService.get("db_user"),
        password: configService.get("db_pass"),
        max: 25,
        database: configService.get("db_name"),
        min: 5,
        connectionTimeoutMillis: 5000,
        keepAlive: true
    }

    const db = GetConnection(poolCfg);

    try {

        const s3Service = new S3Service();
        const jwtService = new JwtService();
        const pwService = new PasswordService();

        const adminUser: InsertUser = {
            username: configService.get<string>("s3xplorer_admin"),
            password: await pwService.hash(configService.get<string>("s3xplorer_admin_pass")),
            role: "admin",
            verified: true
        };
        await CreateAdminIfNotExists(db, adminUser);

        //initialize clients
        const accounts = await db.selectFrom("accounts").select("accounts.aws_id").execute();

        initClients(accounts.map(x => x.aws_id));

        const deps: AppDependency = {
            configService,
            jwtService,
            pwService,
            s3Service,
            userRepository: new UserRepository(db)
        }

        const app = App.setup(deps);
        const server = http.createServer(app);

        //proceed to start server.
        await listenAsync(server, configService.get<number>("port"));
        console.log(`s3explorer-server listning on PORT ${configService.get<number>("port")}`);
    } catch (error) {
        console.error(error);
        await db.destroy();
        process.exit(1);
    }
}

main();

