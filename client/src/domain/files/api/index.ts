import { getClient, handleAxiosError } from "@/lib/http.client";
import { CreateFolderPayload, File, FileDownloadMetadata, FileDownloadMetadataWithUrl, FileRenameOrCopyPayload } from "../types/files.types";
import { ApiResult } from "@/domain/app";

export async function getChildren(
    accountId: string,
    region: string | null,
    bucketId: string,
    prefix: string | null,
    ignoreCache = false
) {
    try {
        const params: Record<string, any> = {
            bucket: bucketId,
            key: prefix || '',
            region: region || "",
            ...(ignoreCache ? { nocache: 1 } : {})
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
    region: string | null,
    bucketId: string,
    files: FileDownloadMetadata[]) {

    try {
        const params: Record<string, string> = {
            bucket: bucketId,
            region: region || "",
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

export async function renameFile(accountId: string,
    region: string | null,
    bucketId: string,
    payload: FileRenameOrCopyPayload
) {
    try {
        const params: Record<string, string> = {
            bucket: bucketId,
            region: region || ""
        };

        const q = new URLSearchParams(params).toString();
        const client = getClient();
        await client.put(
            `s3/${accountId}/files?${q}`, payload
        );
        return true;
    } catch (error) {
        throw handleAxiosError(error);
    }
}

export async function copyFile(accountId: string,
    region: string | null,
    bucketId: string,
    payload: FileRenameOrCopyPayload
) {
    try {
        const params: Record<string, string> = {
            bucket: bucketId,
            region: region || ""
        };

        const q = new URLSearchParams(params).toString();
        const client = getClient();
        await client.post(
            `s3/${accountId}/files?${q}`, payload
        );
        return true;
    } catch (error) {
        throw handleAxiosError(error);
    }
}

export async function deleteFile(accountId: string,
    region: string | null,
    bucketId: string,
    key: string
) {
    try {
        const client = getClient();
        await client.post(
            `s3/${accountId}/files/rm`, {
            bucket: bucketId,
            keys: [key],
            region
        }
        );
        return true;
    } catch (error) {
        throw handleAxiosError(error);
    }
}

export async function deleteFolder(accountId: string, region: string | null,
    bucketId: string, key: string) {
    try {

        const params: Record<string, any> = {
            bucket: bucketId,
            key: key || '',
            region: region || "",
        };

        const q = new URLSearchParams(params).toString();

        const client = getClient();

        await client.delete(
            `s3/${accountId}/folders?${q}`,
        );
        return true;
    } catch (error) {
        throw handleAxiosError(error);
    }
}

export async function createFolder(accountId: string, region: string | null,
    bucketId: string, body: CreateFolderPayload) {
    try {

        const params: Record<string, any> = {
            bucket: bucketId,
            region: region || "",
        };

        const q = new URLSearchParams(params).toString();

        const client = getClient();

        await client.post(
            `s3/${accountId}/folders?${q}`, body
        );
        return true;
    } catch (error) {
        throw handleAxiosError(error);
    }
}