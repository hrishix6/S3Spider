import { DataTableFile, File } from "../types/files.types";

export function getFileExtension(filename?: string) {
    if (filename) {
        const parts = filename.split('.');
        return parts.length > 1 ? parts.pop() : null;
    }
    return null;
}

export function getFileNameWithoutExtension(filename?: string) {
    if (filename) {
        const parts = filename.split('.');
        return parts.length ? parts[0] : null;
    }
    return null;
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