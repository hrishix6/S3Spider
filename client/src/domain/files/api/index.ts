import { getClient, handleAxiosError } from "@/lib/http.client";
import { Bucket, File, FileDownloadMetadata, FileDownloadMetadataWithUrl } from "../types/files.types";
import { ApiResult } from "@/domain/app";

export async function getBuckets(accountId: string) {
    try {
        const client = getClient();
        const response = await client.get(`s3/${accountId}/buckets`);

        const result = response.data as ApiResult<Bucket[]>;

        return result;
    } catch (error) {
        throw handleAxiosError(error);
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

        const result = response.data as ApiResult<File[]>;
        return result;
    } catch (error) {
        throw handleAxiosError(error);
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

        const result = response.data as ApiResult<FileDownloadMetadataWithUrl[]>;
        return result;
    } catch (error) {
        throw handleAxiosError(error);
    }

}