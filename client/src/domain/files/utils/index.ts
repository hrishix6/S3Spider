import { Bucket, DataTableBucket, DataTableFile, File } from "../types/files.types";

export function toDataTableBuckets(buckets: Bucket[]): DataTableBucket[] {
    return buckets.map((x) => ({
        id: x.name,
        name: x.name,
        createdAt: x.createdAt,
    }));
}

export function toDataTableFiles(files: File[]): DataTableFile[] {
    return files.map((x) => ({
        id: x.key,
        name: x.name,
        key: x.key,
        mimeType: x.mimeType,
        lastModifiedAt: x.lastModifiedAt,
        size: x.size,
        kind: x.kind,
    }));
}