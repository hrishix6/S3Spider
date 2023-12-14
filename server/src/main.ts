import 'reflect-metadata';
import { Container } from "typedi";
import http from "http";
import { ConfigService } from "./config/config.service";
import { PoolConfig } from "pg";
import { CreateAdminIfNotExists, DB_TOKEN, GetConnection } from "./database";
import { PasswordService } from "./auth/password.service";
import { App } from "./app";
import { InsertUser } from "./database/custom.types";
import { initClients } from './s3';
import { RedisClientOptions } from 'redis';
import { CACHE_TOKEN, getCacheClient } from './cache/client';

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

    const configService = Container.get(ConfigService);
    configService.load();

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
    Container.set(DB_TOKEN, db);

    const cacheEnabled = configService.get<boolean>("cache_enabled");

    if (cacheEnabled) {

        console.log(`u- ${configService.get("cache_user")}`);
        console.log(`p - ${configService.get("cache_pass")}`);

        const cacheConfig: RedisClientOptions = {
            username: configService.get("cache_user"),
            password: configService.get("cache_pass"),
            socket: {
                host: configService.get("cache_host"),
                port: configService.get<number>("cache_port"),
            }
        };

        const cache = getCacheClient(cacheConfig);

        try {
            await cache
                .on("error", (err) => console.error(`Redis client encountered error ${err}`))
                .connect();

            if (cache.isReady) {
                console.log(`connected to redis server`);
                Container.set(CACHE_TOKEN, cache);
            }
            else {
                Container.set(CACHE_TOKEN, null);
            }

        } catch (error) {
            console.log(error);
        }
    }

    try {
        const pwService = Container.get(PasswordService);

        const adminUser: InsertUser = {
            username: configService.get<string>("s3xplorer_admin"),
            password: await pwService.hash(configService.get<string>("s3xplorer_admin_pass")),
            role: "admin",
            verified: true
        };


        await CreateAdminIfNotExists(db, adminUser);
        const accounts = await db.selectFrom("accounts").select("accounts.aws_id").execute();
        initClients(accounts.map(x => x.aws_id));

        const app = App.setup();
        const server = http.createServer(app);

        await listenAsync(server, configService.get<number>("port"));

        console.log(`s3explorer-server listning on PORT ${configService.get<number>("port")}`);

    } catch (error) {
        console.error(error);
        await db.destroy();
        process.exit(1);
    }
}

main();

