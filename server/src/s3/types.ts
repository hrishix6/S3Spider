import { z } from "zod";

export const PrefixParseSchema = z.string().optional();

export const RequiredKeySchema = z.string().min(1);

export const BucketParseSchema = z.string().min(1);

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