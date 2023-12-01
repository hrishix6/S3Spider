import { getClient } from "@/lib/http.client";
import { FileDownloadMetadata, FileDownloadMetadataWithUrl } from "../types/files.types";

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


export async function getDownloadUrls(accountId: string,
    bucketId: string,
    files: FileDownloadMetadata[]) {

    try {
        const params: Record<string, string> = {
            bucket: bucketId
        };

        const q = new URLSearchParams(params).toString();
        const client = getClient();
        const response = await client.post(
            `s3/${accountId}/files/dl${q ? `?${q}` : ''}`, {
            files
        }
        );

        const { success, data } = response.data;

        if (success) {
            return data as FileDownloadMetadataWithUrl[];
        }

        return null;
    } catch (error) {
        console.log(error);
        return null;
    }

}