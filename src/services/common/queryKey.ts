export const queryKeys = {
  main: () => ['main'],
  account: () => ['account'],
  profile: (profileId: string) => ['profile', profileId],
  profiles: () => ['profiles'],
  currentProfile: () => ['currentProfile'],
  currentProfileDetails: () => ['currentProfileDetails'],
  files: () => ['files'],
  mediaSets: () => ['mediaSets'],
  blazePose: () => ['blazePose'],
  prescriptions: () => ['prescriptions'],
  prescription: () => ['prescription'],
  analysis: () => ['analysis'],
  analysisJob: () => ['analysisJob'],
  exerciseAnalysis: () => ['exerciseAnalysis'],
  videoAnalysis: () => ['videoAnalysis'],
  exercise: () => ['exercise'],
  media: () => ['media'],
  // Workout Management
  sessionSchedule: (profileId: string, startDate: string, endDate: string) => ['sessionSchedule', profileId, startDate, endDate],
  calendarDots: (profileId: string, startDate: string, endDate: string) => ['calendarDots', profileId, startDate, endDate],
  dailySchedule: (profileId: string, date: string) => ['dailySchedule', profileId, date],
  series: (profileId: string) => ['series', profileId],
  sessions: (profileId: string) => ['sessions', profileId],
  sessionDetail: (sessionId: string) => ['sessionDetail', sessionId],
};

export const QUERY_KEYS = {
  main: queryKeys.main(),
  account: queryKeys.account(),
  profile: {
    all: () => ['profile'],
    current: () => ['currentProfile'],
    currentDetails: () => ['currentProfileDetails'],
    byId: (profileId: string) => ['profile', profileId],
  },
  profiles: queryKeys.profiles(),
  currentProfile: queryKeys.currentProfile(),
  currentProfileDetails: queryKeys.currentProfileDetails(),
  files: queryKeys.files(),
  mediaSets: queryKeys.mediaSets(),
  blazePose: queryKeys.blazePose(),
  prescriptions: queryKeys.prescriptions(),
  prescription: queryKeys.prescription(),
  analysis: queryKeys.analysis(),
  analysisJob: queryKeys.analysisJob(),
  exerciseAnalysis: queryKeys.exerciseAnalysis(),
  videoAnalysis: queryKeys.videoAnalysis(),
  exercise: queryKeys.exercise(),
  media: queryKeys.media(),
  // Workout Management
  workout: {
    sessionSchedule: (profileId: string, startDate: string, endDate: string) =>
      queryKeys.sessionSchedule(profileId, startDate, endDate),
    calendarDots: (profileId: string, startDate: string, endDate: string) =>
      queryKeys.calendarDots(profileId, startDate, endDate),
    dailySchedule: (profileId: string, date: string) =>
      queryKeys.dailySchedule(profileId, date),
    series: (profileId: string) => queryKeys.series(profileId),
    sessions: (profileId: string) => queryKeys.sessions(profileId),
    sessionDetail: (sessionId: string) => queryKeys.sessionDetail(sessionId),
  },
};