import { UserRole } from "../../app";
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
    users: DataTableUser[],
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
    userId: string;
    accounts: DataTableAccount[]
}
