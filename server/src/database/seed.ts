import { GetConnection } from "./index";
import { InsertAccount } from "./custom.types";
import { ConfigService } from "../config/config.service";
import { PoolConfig } from "pg";

const accounts: InsertAccount[] = [
    {
        name: "paper-erp-test",
        aws_id: "604443647261"
    },
]

async function seed() {

    const configService = new ConfigService();

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

    try {
        await db.deleteFrom("accounts").execute();
        //seed new accounts.
        await db.insertInto("accounts").values(accounts).execute();
    } catch (error) {
        console.error(error);
    } finally {
        await db.destroy();
        process.exit(1);
    }
}


seed()
    .then(() => {
        console.log("populated accounts successfully");
    })
    .catch(err => console.error(err));