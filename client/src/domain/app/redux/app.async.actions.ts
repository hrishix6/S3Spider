import { createAsyncThunk } from "@reduxjs/toolkit";
import { delay } from "@/lib/utils";
import { client } from "@/lib/http.client";
import { UserInfo } from "./app.reducer";

async function getUserInfo(token: string) {
    try {
        const response = await client.get("/user/me", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        return null;
    }
}


export const initAppDataAsync = createAsyncThunk<{ isAuthenticated: boolean, info?: UserInfo }, void>("app/initAppDataAsync", async () => {

    await delay(1000);

    const token = localStorage.getItem("token");

    if (!token) {
        return { isAuthenticated: false };
    }


    const result = await getUserInfo(token);

    if (!result) {
        localStorage.removeItem("token");
        return { isAuthenticated: false };
    }

    const { data } = result;

    return { isAuthenticated: true, info: data };
});

