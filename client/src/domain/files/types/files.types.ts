export type S3ObjectKind = 'folder' | 'file';

export type DataTableFile = {
  id: string;
  name: string;
  key: string;
  kind: S3ObjectKind;
  mimeType?: string;
  size: number;
  lastModifiedAt?: string;
};

export interface File {
  name: string;
  key: string;
  kind: S3ObjectKind;
  mimeType?: string;
  lastModifiedAt?: string;
  size: number;
}

export const BYTE = 1;
export const KB = 1024 * BYTE;
export const MB = 1024 * KB;
export const GB = 1024 * MB;
export const MAX_DOWNLOAD_LIMIT = 4 * GB;

export interface FileDownloadMetadata {
  name: string;
  key: string;
  mimeType: string;
}

export interface FileDownloadMetadataCalc {
  size: number;
  files: FileDownloadMetadata[];
}

export interface FileDownloadMetadataWithUrl extends FileDownloadMetadata {
  url: string;
}

export class MaxDownloadSizeExceededError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = MaxDownloadSizeExceededError.name;
  }
}

export type FileAction =
  | 'cpf'
  | 'mvf'
  | '-f'
  | 'renamef'
  | 'dlf'
  | '+f'
  | '+d'
  | '-d';

export interface FileRenameOrCopyPayload {
  name: string;
  key: string;
  new_name: string;
}

export interface CreateFolderPayload {
  name: string;
  key: string;
}

export interface FileCopyPayload {
  name: string;
  key: string;
  new_name: string;
  destination: string;
}

export interface FileMovePayload {
  name: string;
  key: string;
  destination: string;
}

export interface S3GetFilesResult {
  files: File[];
  done: boolean;
}
