import { getClient } from "@/lib/http.client";

export async function getUserInfo() {
    try {
        const client = getClient();
        const response = await client.get("/user/me");
        const { data, success } = response.data;
        if (success) {
            return data;
        }
        return null;
    } catch (error) {
        return null;
    }
}