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
  analysis: () => ['analysis'],
};

export const QUERY_KEYS = {
  main: queryKeys.main(),
  account: queryKeys.account(),
  profiles: queryKeys.profiles(),
  files: queryKeys.files(),
  mediaSets: queryKeys.mediaSets(),
  prompts: queryKeys.prompts(),
  blazePose: queryKeys.blazePose(),
  prescriptions: queryKeys.prescriptions(),
  analysis: queryKeys.analysis(),
};