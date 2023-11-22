import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type UserRole = "admin" | "user" | "viewer";

export interface Accounts {
  aws_id: string;
  id: Generated<number>;
  name: string;
}

export interface AccountsUsersJoin {
  account_id: number;
  user_id: number;
}

export interface Users {
  id: Generated<number>;
  password: string;
  role: Generated<UserRole | null>;
  username: string;
  verified: Generated<boolean | null>;
}

export interface DB {
  accounts: Accounts;
  accounts_users_join: AccountsUsersJoin;
  users: Users;
}
