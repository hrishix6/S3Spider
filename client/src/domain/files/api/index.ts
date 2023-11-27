import { getClient } from "@/lib/http.client";

export async function getBuckets(accountId: string) {
    try {
        const client = getClient();
        const response = await client.get(`s3/${accountId}/buckets`);

        const { success, data } = response.data;

        if (success) {
            return data;
        }

        return null;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function getChildren(
    accountId: string,
    bucketId: string,
    prefix?: string
) {
    try {
        const params: Record<string, string> = {
            bucket: bucketId,
            key: prefix || '',
        };

        const q = new URLSearchParams(params).toString();
        const client = getClient();
        const response = await client.get(
            `s3/${accountId}/files${q ? `?${q}` : ''}`
        );

        const { success, data } = response.data;

        if (success) {
            return data;
        }

        return null;
    } catch (error) {
        console.log(error);
        return null;
    }
}