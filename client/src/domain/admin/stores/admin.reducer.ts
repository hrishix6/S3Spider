import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AdminBreadCrumb, AdminState, DataTableAccount, DataTableUser, defaultAdminBreadcrumbs } from '../types/admin.types';
import { handleAccountsClickAsync, handleAdminCrumbClickAsync, loadUsersAsync } from './admin.async.actions';
import { RootState } from '@/store';

const initialState: AdminState = {
    loading: false,
    currentUser: null,
    breadCrumbs: defaultAdminBreadcrumbs,
    error: false,
    users: [],
    dataTable: "idle",
    awsAccounts: []
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        setAdminBreadcrumbs: (state, action: PayloadAction<AdminBreadCrumb[]>) => {
            state.breadCrumbs = action.payload;
        },
        addAccountCrumb: (state, action: PayloadAction<AdminBreadCrumb>) => {
            state.breadCrumbs.push(action.payload);
        },
        setCurrentuser: (state, action) => {
            state.currentUser = action.payload;
        },
        setDatatableUsers: (state, action: PayloadAction<DataTableUser[]>) => {
            state.breadCrumbs = defaultAdminBreadcrumbs;
            state.awsAccounts = [];
            state.currentUser = null;
            state.dataTable = 'users';
            state.users = action.payload;
        },
        setDataTableAwsAccounts: (state, action: PayloadAction<{ accounts: DataTableAccount[], userId: number }>) => {
            const { userId, accounts } = action.payload;
            state.dataTable = "accounts";
            state.currentUser = userId
            state.awsAccounts = accounts;
        },
        setUserVerified: (state, action: PayloadAction<{ id: number, verified: boolean }>) => {
            const { id, verified } = action.payload;
            const itemIndex = state.users.findIndex(x => x.id === id);
            if (itemIndex > -1) {
                state.users[itemIndex].verified = verified;
            }
        },
        setUserRole: (state, action: PayloadAction<{ id: number, role: string }>) => {
            const { id, role } = action.payload;
            const itemIndex = state.users.findIndex(x => x.id === id);
            if (itemIndex > -1) {
                state.users[itemIndex].role = role;
            }
        },
        setAccountAssigned: (state, action: PayloadAction<{ id: number, assigned: boolean }>) => {
            const { id, assigned } = action.payload;
            const itemIndex = state.awsAccounts.findIndex(x => x.id === id);
            if (itemIndex > -1) {
                state.awsAccounts[itemIndex].assigned = assigned;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(handleAdminCrumbClickAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(handleAdminCrumbClickAsync.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(handleAdminCrumbClickAsync.rejected, (state) => {
                state.loading = false;
            })
            .addCase(handleAccountsClickAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(handleAccountsClickAsync.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(handleAccountsClickAsync.rejected, (state) => {
                state.loading = false;
            })
            .addCase(loadUsersAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadUsersAsync.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(loadUsersAsync.rejected, (state) => {
                state.loading = false;
            });
    },
});

export const adminReducer = adminSlice.reducer;

export const { setAccountAssigned, setUserRole, setUserVerified, setAdminBreadcrumbs, setCurrentuser, setDataTableAwsAccounts, setDatatableUsers, addAccountCrumb } = adminSlice.actions;

export const selectAdminLoading = (state: RootState) => state.adminStore.loading;
export const selectAdminError = (state: RootState) => state.adminStore.error;
export const selectAdminBreadCrumbs = (state: RootState) => state.adminStore.breadCrumbs;
export const selectAdminDatatableType = (state: RootState) => state.adminStore.dataTable;
export const selectUsers = (state: RootState) => state.adminStore.users;
export const selectAdminAwsAccounts = (state: RootState) => state.adminStore.awsAccounts;
export const seslectCurrentUser = (state: RootState) => state.adminStore.currentUser;