import { Accounts, Users } from "./generated.types";
import { Insertable, Selectable } from "kysely";

export type InsertUser = Insertable<Users>;
export type User = Selectable<Users>;

export type InsertAccount = Insertable<Accounts>;
export type Account = Selectable<Accounts>;