import { UserRole } from "../../app";

export type AdminBreadCrumbTarget = "users" | "accounts";

export type AdminDataTableType = "idle" | "users" | "accounts";

export interface AdminBreadCrumb {
    key: string;
    text: string;
    target: AdminBreadCrumbTarget
}

export const defaultAdminBreadcrumbs: AdminBreadCrumb[] = [
    {
        key: "root",
        text: "Users",
        target: "users"
    }
];

export interface DataTableUser {
    id: number;
    email: string;
    username: string;
    verified: boolean;
    role: string;
}

export interface DataTableAccount {
    id: number;
    name: string;
    aws_id: string;
    assigned: boolean;
}

export interface AdminState {
    loading: boolean;
    currentUser: number | null;
    error: boolean;
    breadCrumbs: AdminBreadCrumb[]
    users: DataTableUser[],
    dataTable: AdminDataTableType
    awsAccounts: DataTableAccount[]
}

export interface UpdateUserInfo {
    id: number;
    verified: boolean;
    role: UserRole
}

export interface UpdateUsersRequest {
    payload: UpdateUserInfo[]
}

export interface UpdateUserAccountsRequest {
    userId: number;
    accounts: DataTableAccount[]
}
