import { Bucket, DataTableBucket } from "../types";

export function toDataTableBuckets(buckets: Bucket[]): DataTableBucket[] {
    return buckets.map((x) => ({
        id: x.name,
        name: x.name,
        createdAt: x.createdAt,
        region: x.region
    }));
}