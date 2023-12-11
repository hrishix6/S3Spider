import {
    ListBucketsCommand,
    ListObjectsV2Command,
    GetObjectCommand,
    PutObjectCommand,
    DeleteObjectsCommand,
    DeleteObjectCommand,
    CopyObjectCommand,
    CreateBucketCommand,
    GetBucketLocationCommand,
    BucketLocationConstraint
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getClient, getDefaultClient } from "./clients";
import { DEFAULT_AWS_REGION, Disc, File } from "./types";
import { getDirectory, toFileFromPrefix, toFilefromObj } from "./utils";
import { Service } from "typedi";
import { Readable } from "stream";


@Service()
export class S3Service {
    // #region basic-crud
    /**
     * Creates new bucket in s3.
     * @param acccountId Aws account id
     * @param region bucket region
     * @param bucket Name of the bucket to create
     * @returns location of newly created bucket eg. "/\<bucket\>"
     */
    async createBucket(acccountId: string, region: BucketLocationConstraint, bucket: string) {
        let success: boolean;
        let data: string;
        let error: unknown;
        try {
            const client = getDefaultClient(acccountId);
            const input = new CreateBucketCommand({ Bucket: bucket, CreateBucketConfiguration: { LocationConstraint: region } });
            const created = await client.send(input);
            if (created.Location) {
                success = true;
                data = created.Location;
            }
            else {
                success = false;
                data = "";
            }
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
     * 
     * @param acccountId AWS Account id
     * @param region bucket region
     * @param bucket Bucket name
     * @param prefix folder name with ke
     */
    async createFolder(acccountId: string, region: string, bucket: string, key: string) {
        let success: boolean;
        let error: unknown;

        try {
            const client = getClient(acccountId, region);
            const input = new PutObjectCommand({ Bucket: bucket, Key: key, Body: undefined });

            const result = await client.send(input);

            if (result) {
                console.log(JSON.stringify(result, null, 2));
                success = true;
                error = undefined;
            }
            else {
                success = false;
                error = new Error("Unable to create folder");
            }

        } catch (e) {
            console.log('error');
            console.log(e);
            success = false;
            error = e;
        }

        return { success, error };

    }

    /**
     * Get buckets in s3 for given account.
     * @param accountId Aws account Id
     * @returns List of buckets.
     */
    async listBuckets(accountId: string) {
        let success: boolean;
        let data: Disc[];
        let error: unknown;
        const cached = false;
        try {
            const client = getDefaultClient(accountId);
            const output = await client.send(new ListBucketsCommand({}));
            success = true;
            const buckets = output.Buckets ? output.Buckets.map(x => ({ name: x.Name!, createdAt: x.CreationDate })) : [];

            const locationRequests = buckets.map(bucket => {

                const locationInput = new GetBucketLocationCommand({ Bucket: bucket.name });

                return client.send(locationInput);
            });

            const locations = await Promise.all(locationRequests);

            data = buckets.map((bucket, index) => {
                const item: Disc = {
                    name: bucket.name,
                    createdAt: bucket.createdAt,
                    region: locations[index].LocationConstraint || DEFAULT_AWS_REGION
                };
                return item;
            });

        } catch (e) {
            success = false;
            error = e;
            data = []
        }
        return {
            success,
            data,
            error,
            cached
        }
    }

    /**
     * Returns direct children of bucket/folder.
     * @param accountId AWS Account id
     * @param region bucket region
     * @param bucket Bucket name
     * @param prefix key of folder (for bucket prefix = "" for folders in bucket prefix = "foldername/")
     * @returns List of children if any.
     */
    async listDirectChildren(accountId: string, region: string, bucket: string, prefix: string = "") {

        let success: boolean;
        let data: File[];
        let error: unknown;
        const cached = false;
        try {
            const input = new ListObjectsV2Command({ Bucket: bucket, Delimiter: "/", Prefix: prefix });
            const client = getClient(accountId, region);
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
            error,
            cached
        }
    }

    /**
     * 
     * @param acccountId AWS Account Id
     * @param region bucket region
     * @param bucket Bucket Name
     * @param key file key
     * @returns Signed url for downloading file from s3.
     */
    async getSignedUrlForDL(acccountId: string, region: string, bucket: string, key: string, filename: string) {
        let success: boolean;
        let data: string;
        let error: unknown;

        try {
            const client = getClient(acccountId, region);
            const dlCommand = new GetObjectCommand({ Bucket: bucket, Key: key, ResponseContentDisposition: `attachment; filename="${filename}"` });
            const signedUrl = await getSignedUrl(client, dlCommand, { expiresIn: 300 });
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
     * @param region bucket region
     * @param bucket Bucket name
     * @param key file key
     */
    async getFileStream(acccountId: string, region: string, bucket: string, key: string) {
        let success: boolean;
        let data: Readable | null;
        let error: unknown;

        try {
            const client = getClient(acccountId, region);
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
     * @param region bucket region
     * @param bucket Bucket Name
     * @param key file key , when you want to upload file under a specific folder key = "\<key of folder\>/filename"
     * There's no concept of folders in S3, it's simulated by prefixes so "folder1/file1" means file1 is under folder1.
     * @returns Signed url for uploading file to s3.
     */
    async getSignedUrlForUL(acccountId: string, region: string, bucket: string, key: string) {
        let success: boolean;
        let data: string;
        let error: unknown;
        try {
            const client = getClient(acccountId, region);
            const ulCommand = new PutObjectCommand({ Bucket: bucket, Key: key });
            const signedUrl = await getSignedUrl(client, ulCommand, { expiresIn: 300 });
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
     * Delete multiple files from bucket
     * @param accountId Aws account Id
     * @param region region of  bucket
     * @param bucket Bucket name
     * @param keys list of keys to delete.
     */
    async deleteObjects(accountId: string, region: string, bucket: string, keys: string[]) {

        let success: boolean;
        let data: string[];
        let error: unknown;

        try {
            const client = getClient(accountId, region);
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

    /**
     * First creates a copy of object with new name, then deletes original object.
     * @param accountId aws account
     * @param region bucket region
     * @param bucket bucket
     * @param key key of object being renamed
     * @param newName new name
     */
    async renameObject(accountId: string, region: string, bucket: string, key: string, newName: string) {

        let success: boolean;
        let error: unknown;

        try {
            const client = getClient(accountId, region);
            const keyWithBucket = encodeURIComponent(`${bucket}/${key}`);

            const sourceDir = getDirectory(key);

            const newKey = sourceDir ? `${sourceDir}/${newName}` : newName;

            const input = new CopyObjectCommand({
                CopySource: keyWithBucket,
                Bucket: bucket,
                Key: newKey
            });

            const { CopyObjectResult } = await client.send(input);

            if (!CopyObjectResult) {
                success = false;
                error = new Error("Couldn't rename object, copy failed.");
            }
            else {
                console.log(`object copy created, now deleting old object..`);
                const deletoldObjInput = new DeleteObjectCommand({
                    Bucket: bucket,
                    Key: key,
                });

                const { DeleteMarker } = await client.send(deletoldObjInput);

                if (DeleteMarker) {
                    console.log(`deleted old object..`);
                }

                success = true;
                error = undefined;
            }

        } catch (e) {
            console.log(e);
            error = e;
            success = false;
        }

        return {
            success,
            error
        }
    }

    /**
     * Creates a copy of an object in same folder.
     * @param accountId aws account
     * @param region bucket region
     * @param bucket bucket
     * @param key key of object being copied
     * @param newName name for copy
     */
    async copyObject(accountId: string, region: string, bucket: string, key: string, newName: string) {

        let success: boolean;
        let error: unknown;
        try {
            const client = getClient(accountId, region);
            const keyWithBucket = encodeURIComponent(`${bucket}/${key}`);

            const sourceDir = getDirectory(key);

            const newKey = sourceDir ? `${sourceDir}/${newName}` : newName;

            console.log(`new file key - ${newKey}`);

            const input = new CopyObjectCommand({
                CopySource: keyWithBucket,
                Bucket: bucket,
                Key: newKey
            });

            const { CopyObjectResult } = await client.send(input);

            if (!CopyObjectResult) {
                success = false;
                error = new Error("Couldn't copy object");
            }
            else {
                success = true;
                error = undefined;
            }

        } catch (e) {
            console.log(e);
            error = e;
            success = false;
        }

        return {
            success,
            error
        }
    }

    //#endregion basic-crud

    // #region dangerous-operations

    /**
     * Recursively deletes a folder and it's contents
     * @param acccountId Aws account id
     * @param region bucket region
     * @param bucket name of the bucket
     * @param key folder prefix / key. 
     * @returns boolean flag indicating if delete was successful.
     */
    async deleteFolder(acccountId: string, region: string, bucket: string, key: string) {
        try {
            const listChildrenResult = await this.listDirectChildren(acccountId, region, bucket, key);
            const keys2Delete: string[] = [key];
            if (listChildrenResult.success) {
                if (listChildrenResult.data.length) {
                    keys2Delete.push(...listChildrenResult.data.map(x => x.key));
                }

                const deleteResult = await this.deleteObjects(acccountId, region, bucket, keys2Delete);

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