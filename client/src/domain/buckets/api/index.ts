import { getClient, handleAxiosError } from "@/lib/http.client";
import { ApiResult } from "../../app";
import { Bucket } from "../types";

export async function getBuckets(accountId: string, ignoreCache = false) {
    try {
        const client = getClient();

        let q = "";
        if (ignoreCache) {
            const params: Record<string, any> = {
                nocache: 1
            };
            q = new URLSearchParams(params).toString();
        }

        const response = await client.get(`s3/${accountId}/buckets${q ? `?${q}` : ''}`);

        const result = response.data as ApiResult<Bucket[]>;

        return result;
    } catch (error) {
        throw handleAxiosError(error);
    }
}