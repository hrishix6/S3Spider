export type UserRole = 'none' | 'admin' | 'viewer' | 'user';

export interface AwsAccounts {
    id: number;
    aws_id: string;
    name: string;
}

export interface UserInfo {
    id: number;
    verified: boolean;
    username: string;
    role: UserRole;
    accounts: AwsAccounts[];
}

export interface AppState {
    currentAccount: string;
    loading: boolean;
    error: boolean;
    mobileSidebar: boolean;
    errorMessage: string;
    isAuthenticated: boolean;
    role: UserRole;
    awsAccounts: AwsAccounts[];
    noAccounts: boolean;
    userId: number;
}