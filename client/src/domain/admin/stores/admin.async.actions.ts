import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import { AdminBreadCrumb, DataTableUser } from "../types/admin.types";
import { addAccountCrumb, setAdminBreadcrumbs, setDataTableAwsAccounts, setDatatableUsers } from "./admin.reducer";
import { getUserAccounts, getUsers } from "../api";

export const handleAdminCrumbClickAsync = createAsyncThunk<void, string>(
    'admin/handleAdminCrumbClickAsync',
    async (key, thunkAPI) => {
        const { getState, dispatch } = thunkAPI;

        const rootState = getState() as RootState;
        const { breadCrumbs } = rootState.adminStore;

        const clickedCrumbIndex = breadCrumbs.findIndex((x) => x.key === key);

        if (clickedCrumbIndex < 0) {
            return;
        }

        const clickedCrumb = breadCrumbs[clickedCrumbIndex];

        const newCrumbs = breadCrumbs.slice(0, clickedCrumbIndex + 1);

        dispatch(setAdminBreadcrumbs(newCrumbs));

        const { target } = clickedCrumb;

        if (target == "users") {
            const users = await getUsers();
            if (users) {
                dispatch(setDatatableUsers(users));
            }
        }
    }
);

export const handleAccountsClickAsync = createAsyncThunk<void, DataTableUser>(
    'admin/handleAccountsClickAsync',
    async (user, thunkAPI) => {
        const { dispatch } = thunkAPI;

        const { id, username } = user;

        const accounts = await getUserAccounts(id);

        const newBreadCrumb: AdminBreadCrumb = {
            target: "accounts",
            key: `${id}-accounts`,
            text: `${username} (accounts)`
        };


        dispatch(addAccountCrumb(newBreadCrumb));
        dispatch(setDataTableAwsAccounts({ accounts, userId: id }));
    }
);

export const loadUsersAsync = createAsyncThunk<void, void>(
    'admin/loadUsersAsync',
    async (_, thunkAPI) => {
        const { dispatch } = thunkAPI;

        const users = await getUsers();

        if (users) {
            dispatch(setDatatableUsers(users));
        }

    }
);