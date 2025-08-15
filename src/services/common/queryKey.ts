export const queryKeys = {
  main: () => ['main'],
  account: () => ['account'],
  profile: (profileId: string) => ['profile', profileId],
  profiles: () => ['profiles'],
  files: () => ['files'],
  mediaSets: () => ['mediaSets'],
  prompts: () => ['prompts'],
  blazePose: () => ['blazePose'],
  prescriptions: () => ['prescriptions'],
  analysis: () => ['analysis'], // 레거시 지원
  analysisJob: () => ['analysisJob'],
  exerciseAnalysis: () => ['exerciseAnalysis'],
};

export const QUERY_KEYS = {
  main: queryKeys.main(),
  account: queryKeys.account(),
  profile: {
    all: () => ['profile'],
    current: () => ['profile', 'current'],
    byId: (profileId: string) => ['profile', profileId],
  },
  profiles: queryKeys.profiles(),
  files: queryKeys.files(),
  mediaSets: queryKeys.mediaSets(),
  prompts: queryKeys.prompts(),
  blazePose: queryKeys.blazePose(),
  prescriptions: queryKeys.prescriptions(),
  analysis: queryKeys.analysis(), // 레거시 지원
  analysisJob: queryKeys.analysisJob(),
  exerciseAnalysis: queryKeys.exerciseAnalysis(),
};