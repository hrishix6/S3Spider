import { DB } from "./generated.types";
import { Pool, PoolConfig } from "pg";
import { Kysely, PostgresDialect } from "kysely";
import { InsertUser } from "./custom.types";

export const GetConnection = (config: PoolConfig) => {
    const dialect = new PostgresDialect({
        pool: new Pool(config)
    });

    return new Kysely<DB>({ dialect });
}

export async function CreateAdminIfNotExists(db: Kysely<DB>, admin: InsertUser) {

    const { username } = admin;

    const exists = await db.selectFrom("users").where("username", "=", username).select("id").executeTakeFirst();

    if (exists) {
        return;
    }

    const result = await db.insertInto("users").values(admin).returning("id").executeTakeFirst();

    if (result) {
        console.log(`admin user created with id: ${result.id} | username: ${username}`);
    }
}