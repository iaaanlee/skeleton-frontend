// File service related types

export type UploadToUrlRequest = {
  uploadUrl: string;
  file: File;
}

export type GetFileListParams = {
  limit: number;
  offset: number;
}