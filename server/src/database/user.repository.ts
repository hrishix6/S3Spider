import { Kysely } from "kysely";
import { InsertUser } from "./custom.types";
import { DB } from "./generated.types";
import { Inject, Service } from "typedi";
import { DB_TOKEN } from ".";
import { UpdateUsers, UpdatedUserAccounts } from "../auth/types";


@Service()
export class UserRepository {

    @Inject(DB_TOKEN)
    private readonly db: Kysely<DB>;

    async getAllUsers() {
        return this.db
            .selectFrom("users").select(["id", "email", "username", "verified", "role"])
            .where('role', "!=", "admin")
            .execute();
    }

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

    async getAllAwsAccounts() {
        return this.db.selectFrom("accounts").select(["id", "name", "aws_id"]).execute();
    }

    async updateUsers(req: UpdateUsers) {
        const { payload } = req;

        const updates = payload.map(x => this.db.updateTable("users").set({ role: x.role, verified: x.verified }).where("id", "=", x.id).executeTakeFirst());

        await Promise.all(updates);
    }

    async updateUserAccounts(userId: number, accounts: UpdatedUserAccounts[]) {
        const accounts2Add = accounts.filter(x => x.assigned).map(x => ({ user_id: userId, account_id: x.id }));
        await this.db.deleteFrom("accounts_users_join").where("user_id", "=", userId).execute();
        if (accounts2Add.length) {
            await this.db.insertInto("accounts_users_join").values(accounts2Add).execute();
        }
    }

    async hasAccesstoAccount(userId: number, aws_accountId: string) {
        try {
            await this.db.selectFrom("accounts")
                .innerJoin("accounts_users_join", "accounts.id", "accounts_users_join.account_id")
                .where("accounts_users_join.user_id", "=", userId)
                .where("accounts.aws_id", "=", aws_accountId)
                .selectAll()
                .executeTakeFirstOrThrow();
            return true;
        } catch (error) {
            return false;
        }
    }

}