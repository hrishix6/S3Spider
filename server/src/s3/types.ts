import { z } from "zod";

export const PrefixParseSchema = z.string().optional();

export const RequiredKeySchema = z.string().min(1);

export const BucketParseSchema = z.string().min(1);

export const IngoreCacheKeySchema = z.coerce.number();

export const AwsAccountSchema = z.object({
    id: z.string().min(1, { message: "aws id cannot be empty" }),
    client_id: z.string().min(1, { message: "client_id cannot be empty" }),
    client_secret: z.string().min(1, { message: "client_secret cannot be empty" }),
    client_region: z.string().min(1, { message: "region cannot be empty" })
});

export const DeleteFilesRequest = z.object({
    bucket: BucketParseSchema,
    keys: z.array(RequiredKeySchema).min(1)
});

export type AwsAccount = z.infer<typeof AwsAccountSchema>;

export const AwsAccountsListSchema = z.array(AwsAccountSchema).min(1, { message: "No account configurations found" });

export type AwsAccountsList = z.infer<typeof AwsAccountsListSchema>;

export interface S3ServiceResult<T> {
    success: boolean,
    data: T,
    error?: unknown
}

export type S3ObjectKind = "folder" | "file"

// File is object in S3 context.
export interface File {
    name: string;
    key: string;
    kind: S3ObjectKind;
    mimeType?: string;
    lastModifiedAt?: Date;
    size: number;
}


//Disc is bucket in S3 context.
export interface Disc {
    name: string;
    createdAt?: Date;
}

export const FileDownloadMetadataReq = z.object({
    name: z.string().min(1),
    key: z.string().min(1),
    mimeType: z.string().min(1)
});

export type FileDownloadMetadata = z.infer<typeof FileDownloadMetadataReq>;

export const GetSignedUrlsForDLRequest = z.object({
    files: z.array(FileDownloadMetadataReq).min(1, { message: "no file selected" })
});

export interface FileDownloadMetadataWithUrl extends FileDownloadMetadata {
    url: string;
}

export const FileRenameOrCopyRequest = z.object({
    name: z.string().min(1),
    key: z.string().min(1),
    new_name: z.string().min(1)
}).refine(obj => obj.name !== obj.new_name, { message: "new name cannot be same as current name" });
