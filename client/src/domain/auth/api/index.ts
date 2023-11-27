import { getClient } from "@/lib/http.client";
import { LoginDTO, RegisterDTO } from "../types/auth.types";
import { OperationResult } from "../types/auth.types";
import { AxiosError } from "axios";

export async function attemptLogin(body: LoginDTO) {
    const op: Partial<OperationResult> = {}
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

        const { data, success } = response.data;

        if (success) {
            op.success = true;
            op.data = data;
            op.statusCode = response.status;
            op.error = null;
        }
        else {
            op.statusCode = response.status;
            op.success = false;
            op.data = null;
            op.error = new Error("something went wrong");
        }


    } catch (error) {
        if (error instanceof AxiosError) {
            op.statusCode = error.response?.status;
            op.success = false;
            op.data = null;
            op.error = error;
        }
        else {
            op.statusCode = 500;
            op.success = false;
            op.data = null;
            op.error = new Error("something went wrong");
        }
    }

    return op as OperationResult;
}

export async function attemptSignUp(body: RegisterDTO) {
    const op: Partial<OperationResult> = {}
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

        const { data, success } = response.data;

        if (success) {
            op.success = true;
            op.data = data;
            op.statusCode = response.status;
            op.error = null;
        }
        else {
            op.statusCode = response.status;
            op.success = false;
            op.data = null;
            op.error = new Error("something went wrong");
        }

    } catch (error) {
        if (error instanceof AxiosError) {
            op.statusCode = error.response?.status;
            op.success = false;
            op.data = null;
            op.error = error;
        }
        else {
            op.statusCode = 500;
            op.success = false;
            op.data = null;
            op.error = new Error("something went wrong");
        }
    }

    return op as OperationResult;
}