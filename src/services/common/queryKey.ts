export const queryKeys = {
  main: () => ['main'],
  account: () => ['account'],
  profile: (profileId: string) => ['profile', profileId],
  profiles: () => ['profiles'],
  files: () => ['files'],
  blazePose: () => ['blazePose'],
};

export const QUERY_KEYS = {
  main: queryKeys.main(),
  account: queryKeys.account(),
  profiles: queryKeys.profiles(),
  files: queryKeys.files(),
  blazePose: queryKeys.blazePose(),
};