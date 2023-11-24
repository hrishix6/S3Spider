import { Kysely } from "kysely";
import { InsertUser } from "./custom.types";
import { DB } from "./generated.types";
import { Inject, Service } from "typedi";
import { DB_TOKEN } from ".";


@Service()
export class UserRepository {

    @Inject(DB_TOKEN)
    private readonly db: Kysely<DB>;

    async insert(dto: InsertUser) {
        const result = await this.db.insertInto("users").values(dto).returning("id").executeTakeFirst();

        return result?.id
    }

    async findByUsernameOrmail(arg: string) {
        return this.db
            .selectFrom("users")
            .where((eb) => eb("email", "=", arg.toUpperCase()).or("username", "=", arg))
            .selectAll().executeTakeFirst();
    }

    async findById(id: number) {
        return this.db.selectFrom("users").where("id", "=", id).selectAll().executeTakeFirst();
    }

    async getUserAccounts(id: number) {
        const accounts = await this.db
            .selectFrom("accounts")
            .innerJoin("accounts_users_join", "id", "accounts_users_join.account_id")
            .where("accounts_users_join.user_id", "=", id)
            .select(["accounts.id", "name", "accounts.aws_id",])
            .execute();
        return accounts;
    }

    async getAllUsersAccounts() {
        return this.db.selectFrom("accounts").select(["id", "name", "aws_id"]).execute();
    }

}