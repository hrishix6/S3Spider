import { getClient, handleAxiosError } from "@/lib/http.client";
import { ApiResult, UserInfo } from "../types/app.types";

export async function getUserInfo() {
    try {
        const client = getClient();
        const response = await client.get("/user/me");
        const result = response.data as ApiResult<UserInfo>;
        return result;
    } catch (error) {
        throw handleAxiosError(error);
    }
}