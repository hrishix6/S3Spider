export type BreadCrumbTarget = "root" | "bucket" | "folder";

export type DataTableType = "idle" | "buckets" | "files";

export interface BreadCrumb {
    key: string;
    text: string;
    target: BreadCrumbTarget
}

export const defaultBreadcrumbs: BreadCrumb[] = [
    {
        key: "root",
        text: "Buckets",
        target: "root"
    }
];
export type S3ObjectKind = "folder" | "file"

export type DataTableFile = {
    id: string;
    name: string;
    key: string;
    kind: S3ObjectKind;
    mimeType?: string;
    size: number;
    lastModifiedAt?: string;
}

export type DataTableBucket = {
    id: string;
    name: string
    createdAt?: string;
}

export interface Bucket {
    name: string;
    createdAt?: string;
}

export interface File {
    name: string;
    key: string;
    kind: S3ObjectKind;
    mimeType?: string;
    lastModifiedAt?: string;
    size: number;
}

export interface FilesState {
    loading: boolean;
    error: boolean;
    breadCrumbs: BreadCrumb[];
    currentBucket: string,
    dataTable: DataTableType,
    buckets: DataTableBucket[],
    files: DataTableFile[]
}