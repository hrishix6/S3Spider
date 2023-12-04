import { getClient, handleAxiosError } from "@/lib/http.client";
import { LoginDTO, RegisterDTO } from "../types/auth.types";
import { ApiResult, UserInfo } from "../../app"

export async function attemptLogin(body: LoginDTO) {

    try {
        const client = getClient();
        const response = await client.post(
            'auth/login',
            body,
            {
                headers: {
                    Authorization: '',
                },
            }
        );

        const result = response.data as ApiResult<UserInfo & { access_token: string }>;
        return result;
    } catch (error) {
        throw handleAxiosError(error);
    }
}

export async function attemptSignUp(body: RegisterDTO) {
    try {

        const client = getClient();
        const response = await client.post(
            'auth/register',
            body,
            {
                headers: {
                    Authorization: '',
                },
            }
        );

        const result = response.data as ApiResult<string>;
        return result;
    } catch (error) {
        throw handleAxiosError(error);
    }
}