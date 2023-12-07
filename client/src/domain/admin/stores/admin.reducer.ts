import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AdminState, DataTableAccount, DataTableUser } from '../types/admin.types';
import { RootState } from '@/store';

const initialState: AdminState = {
    users: [],
    awsAccounts: []
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        setDatatableUsers: (state, action: PayloadAction<DataTableUser[]>) => {
            state.users = action.payload;
        },
        setDataTableAwsAccounts: (state, action: PayloadAction<DataTableAccount[]>) => {
            state.awsAccounts = action.payload;
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
});

export const adminReducer = adminSlice.reducer;

export const { setAccountAssigned, setUserRole, setUserVerified, setDataTableAwsAccounts, setDatatableUsers } = adminSlice.actions;

export const selectUsers = (state: RootState) => state.adminStore.users;
export const selectAdminAwsAccounts = (state: RootState) => state.adminStore.awsAccounts;