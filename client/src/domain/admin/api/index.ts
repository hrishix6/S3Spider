import { getClient } from "@/lib/http.client";
import { UpdateUserAccountsRequest, UpdateUsersRequest } from "../types/admin.types";

export async function getUserAccounts(id: number) {
    try {
        const client = getClient();
        const result = await client.get(`user/${id}/accounts`);
        const response = result.data;
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        return null;
    }
}

export async function getUsers() {
    try {
        const client = getClient();
        const result = await client.get(`user`);
        const response = result.data;
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        return null;
    }
}

export async function updateUsers(body: UpdateUsersRequest) {
    try {
        const client = getClient();
        await client.put("user", body);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function updateUserAccounts(body: UpdateUserAccountsRequest) {
    try {
        const client = getClient();
        const { userId, accounts } = body;
        await client.put(`user/${userId}/accounts`, { accounts });
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}