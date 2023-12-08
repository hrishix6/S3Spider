export type DataTableBucket = {
    id: string;
    name: string
    createdAt?: string;
    region: string;
}

export interface Bucket {
    name: string;
    createdAt?: string;
    region: string;
}