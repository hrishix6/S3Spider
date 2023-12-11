import { z } from "zod";

export const S3Regions = [
    'us-east-1',
    'us-east-2',
    'us-west-1',
    'us-west-2',
    'af-south-1',
    'ap-east-1',
    'ap-south-2',
    'ap-southeast-3',
    'ap-southeast-4',
    'ap-south-1',
    'ap-northeast-3',
    'ap-northeast-2',
    'ap-southeast-1',
    'ap-southeast-2',
    'ap-northeast-1',
    'ca-central-1',
    'cn-north-1',
    'cn-northwest-1',
    'eu-central-1',
    'eu-west-1',
    'eu-west-2',
    'eu-south-1',
    'eu-west-3',
    'eu-north-1',
    'eu-south-2',
    'eu-central-2',
    'sa-east-1',
    'me-south-1',
    'me-central-1',
    'il-central-1',
    'us-gov-east-1',
    'us-gov-west-1',
] as const;

export const DEFAULT_AWS_REGION = "us-east-1";

export const PrefixParseSchema = z.string().optional();

export const RequiredKeySchema = z.string().min(1);

export const BucketParseSchema = z.string().min(1);

export const RegionParseSchema = z.enum(S3Regions);

export type S3Region = z.infer<typeof RegionParseSchema>;

export const IngoreCacheKeySchema = z.coerce.number();

export const AwsAccountSchema = z.object({
    id: z.string().min(1, { message: "aws id cannot be empty" }),
    client_id: z.string().min(1, { message: "client_id cannot be empty" }),
    client_secret: z.string().min(1, { message: "client_secret cannot be empty" }),
    client_regions: z.array(RegionParseSchema).min(1)
});

export const DeleteFilesRequest = z.object({
    bucket: BucketParseSchema,
    keys: z.array(RequiredKeySchema).min(1),
    region: RegionParseSchema,
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
    region: string;
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

export const CreateFolderRequest = z.object({
    name: z.string().min(1),
    key: z.string().optional(),
});