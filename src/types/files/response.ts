import { UploadInitResponse, ServerFile, FileListResponse, DownloadUrlResponse, BlazePoseResult } from './index'
import { ApiResponse } from './request'

// 파일 업로드 관련 응답
export type UploadInitApiResponse = ApiResponse<UploadInitResponse>
export type UploadCompleteApiResponse = ApiResponse<ServerFile>
export type FileListApiResponse = ApiResponse<FileListResponse>
export type DeleteFileApiResponse = ApiResponse<{ message: string }>
export type DownloadUrlApiResponse = ApiResponse<DownloadUrlResponse>

// BlazePose 분석 응답
export type BlazePoseAnalysisApiResponse = ApiResponse<BlazePoseResult>
