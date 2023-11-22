import { Kysely } from "kysely";
import { InsertUser, User, Account } from "./custom.types";
import { DB } from "./generated.types";

export interface IUserRepository {
    insert: (dto: InsertUser) => Promise<number | undefined>;
    findByUsername: (username: string) => Promise<User | undefined>;
    findById: (id: number) => Promise<User | undefined>;
    getUserAccounts: (id: number) => Promise<Account[]>;
    getAllUsersAccounts: () => Promise<Account[]>;
}


export class UserRepository implements IUserRepository {

    private readonly db: Kysely<DB>;

    constructor(db: Kysely<DB>) {
        this.db = db;
    }

    async insert(dto: InsertUser) {
        const result = await this.db.insertInto("users").values(dto).returning("id").executeTakeFirst();

        return result?.id
    }

    async findByUsername(username: string) {

        return this.db.selectFrom("users").where("username", "=", username).selectAll().executeTakeFirst();

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