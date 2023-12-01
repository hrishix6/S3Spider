import {
    ListBucketsCommand,
    ListObjectsV2Command,
    GetObjectCommand,
    PutObjectCommand,
    DeleteObjectsCommand,
    CreateBucketCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getClient } from "./clients";
import { Disc, File } from "./types";
import { toFileFromPrefix, toFilefromObj } from "./utils";
import { Service } from "typedi";
import { Readable } from "stream";


@Service()
export class S3Service {

    // #region basic-crud
    /**
     * Creates new bucket in s3.
     * @param acccountId Aws account id
     * @param bucket Name of the bucket to create
     * @returns location of newly created bucket eg. "/\<bucket\>"
     */
    async createBucket(acccountId: string, bucket: string) {
        const client = getClient(acccountId);
        let success: boolean;
        let data: string;
        let error: unknown;
        try {
            const input = new CreateBucketCommand({ Bucket: bucket });

            const created = await client.send(input);
            success = true;
            data = created.Location || "";

        } catch (e) {
            success = false;
            data = "";
            error = e;
        }

        return {
            success,
            data,
            error
        }
    }

    /**
     * Get buckets in s3 for given account.
     * @param acccountId Aws account Id
     * @returns List of buckets.
     */
    async listBuckets(acccountId: string) {
        const client = getClient(acccountId);
        let success: boolean;
        let data: Disc[];
        let error: unknown;

        try {
            const output = await client.send(new ListBucketsCommand({}));
            success = true;
            data = output.Buckets ? output.Buckets.map(x => ({ name: x.Name!, createdAt: x.CreationDate })) : [];
        } catch (e) {
            success = false;
            error = e;
            data = []
        }
        return {
            success,
            data,
            error
        }
    }

    /**
     * Returns direct children of bucket/folder.
     * @param accountId AWS Account id
     * @param bucket Bucket name
     * @param prefix key of folder (for bucket prefix = "" for folders in bucket prefix = "foldername/")
     * @returns List of children if any.
     */
    async listDirectChildren(accountId: string, bucket: string, prefix: string = "") {
        const client = getClient(accountId);
        let success: boolean;
        let data: File[];
        let error: unknown;

        const input = new ListObjectsV2Command({ Bucket: bucket, Delimiter: "/", Prefix: prefix });

        try {
            const { Contents, CommonPrefixes } = await client.send(input);

            const children: File[] = [];
            let f: File | null;
            if (Contents) {
                for (const obj of Contents) {
                    f = toFilefromObj(obj, prefix)
                    if (f) {
                        children.push(f);
                    }
                }
            }

            if (CommonPrefixes) {
                for (const folder of CommonPrefixes) {
                    f = toFileFromPrefix(folder, prefix);
                    if (f) {
                        children.push(f);
                    }

                }
            }

            success = true;
            data = children;
        } catch (e) {
            success = false;
            error = e;
            data = []
        }
        return {
            success,
            data,
            error
        }
    }

    /**
     * 
     * @param acccountId AWS Account Id
     * @param bucket Bucket Name
     * @param key file key
     * @returns Signed url for downloading file from s3.
     */
    async getSignedUrlForDL(acccountId: string, bucket: string, key: string) {

        const client = getClient(acccountId);
        let success: boolean;
        let data: string;
        let error: unknown;

        try {
            const dlCommand = new GetObjectCommand({ Bucket: bucket, Key: key });
            const signedUrl = await getSignedUrl(client, dlCommand, { expiresIn: 3600 });
            success = true;
            data = signedUrl;
        } catch (e) {
            success = false;
            error = e;
            data = "";
        }

        return { success, data, error }

    }

    /**
     * Returns the file from s3 as readable stream
     * @param acccountId Aws Account Id
     * @param bucket Bucket name
     * @param key file key
     */
    async getFileStream(acccountId: string, bucket: string, key: string) {
        const client = getClient(acccountId);
        let success: boolean;
        let data: Readable | null;
        let error: unknown;

        try {
            const input = new GetObjectCommand({ Bucket: bucket, Key: key });
            const out = await client.send(input);

            if (!out.Body) {
                success = false;
                data = null;
                error = new Error("No body");
            }
            else {
                success = true;
                data = out.Body as Readable;
                error = null;
            }

        } catch (e) {
            success = false;
            data = null;
            error = e;
        }

        return {
            success, data, error
        }
    }

    /**
     * Returns Signed URL to upload file
     * @param acccountId AWS Account Id
     * @param bucket Bucket Name
     * @param key file key , when you want to upload file under a specific folder key = "\<key of folder\>/filename"
     * There's no concept of folders in S3, it's simulated by prefixes so "folder1/file1" means file1 is under folder1.
     * @returns Signed url for uploading file to s3.
     */
    async getSignedUrlForUL(acccountId: string, bucket: string, key: string) {

        const client = getClient(acccountId);
        let success: boolean;
        let data: string;
        let error: unknown;
        try {
            const ulCommand = new PutObjectCommand({ Bucket: bucket, Key: key });
            const signedUrl = await getSignedUrl(client, ulCommand, { expiresIn: 3600 });
            success = true;
            data = signedUrl;
        } catch (e) {
            success = false;
            error = e;
            data = "";
        }
        return {
            success,
            data,
            error
        }
    }

    /**
     * 
     * @param accountId Aws account Id
     * @param bucket Bucket name
     * @param keys list of keys to delete.
     */
    async deleteObjects(accountId: string, bucket: string, keys: string[]) {
        const client = getClient(accountId);
        let success: boolean;
        let data: string[];
        let error: unknown;

        try {
            const input = new DeleteObjectsCommand({
                Bucket: bucket,
                Delete: {
                    Objects: keys.map(x => ({ Key: x }))
                }
            });

            const { Deleted } = await client.send(input);
            success = true;
            data = Deleted && Deleted.length ? Deleted.map(x => x.Key || "") : [];
        } catch (e) {
            data = [];
            error = e;
            success = false;
        }

        return {
            success,
            data,
            error
        }
    }
    //#endregion basic-crud

    // #region dangerous-operations

    /**
     * Recursively deletes a folder and it's contents
     * @param acccountId Aws account id
     * @param bucket name of the bucket
     * @param key folder prefix / key. 
     * @returns boolean flag indicating if delete was successful.
     */
    async deleteFolder(acccountId: string, bucket: string, key: string) {
        try {
            const listChildrenResult = await this.listDirectChildren(acccountId, bucket, key);
            const keys2Delete: string[] = [key];
            if (listChildrenResult.success) {
                if (listChildrenResult.data.length) {
                    keys2Delete.push(...listChildrenResult.data.map(x => x.key));
                }

                const deleteResult = await this.deleteObjects(acccountId, bucket, keys2Delete);

                if (deleteResult.success) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    // #endregion dangerous-operations

}