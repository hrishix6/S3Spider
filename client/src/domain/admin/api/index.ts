import { getClient, handleAxiosError } from "@/lib/http.client";
import { DataTableAccount, DataTableUser, UpdateUserAccountsRequest, UpdateUsersRequest } from "../types/admin.types";
import { ApiResult } from "../../app";

export async function getUserAccounts(id: string) {
    try {
        const client = getClient();
        const response = await client.get(`user/${id}/accounts`);
        const result = response.data as ApiResult<DataTableAccount[]>;
        return result;
    } catch (error) {
        throw handleAxiosError(error);
    }
}

export async function getUsers() {
    try {
        const client = getClient();
        const response = await client.get(`user`);
        const result = response.data as ApiResult<DataTableUser[]>;
        return result;
    } catch (error) {
        throw handleAxiosError(error);
    }
}

export async function updateUsers(body: UpdateUsersRequest) {
    try {
        const client = getClient();
        await client.put("user", body);
        return true;
    } catch (error) {
        throw handleAxiosError(error);
    }
}

export async function updateUserAccounts(body: UpdateUserAccountsRequest) {
    try {
        const client = getClient();
        const { userId, accounts } = body;
        await client.put(`user/${userId}/accounts`, { accounts });
        return true;
    } catch (error) {
        throw handleAxiosError(error);
    }
}