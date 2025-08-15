// BlazePose service related types

export type CheckDuplicateAnalysisRequest = {
  fileIds: string[];
}

export type CheckDuplicateAnalysisResponse = {
  hasDuplicates: boolean;
  duplicateFiles?: string[];
}