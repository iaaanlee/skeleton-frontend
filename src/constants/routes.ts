// 라우트 URL 상수 정의
export const ROUTES = {
    // 루트
    ROOT: '/',
    
    // 메인 페이지
    MAIN: '/main',
    
    // 인증 관련
    LOGIN: '/login',
    CREATE_ACCOUNT: '/create-account',
    
    // 프로필 관련
    SELECT_PROFILE: '/select-profile',
    CREATE_PROFILE: '/create-profile',
    PROFILE: '/profile',
    EDIT_PROFILE: '/edit-profile',
    
    // 운동 분석 관련
    ANALYZE_EXERCISE: '/analyze-exercise',
    CREATE_PRESCRIPTION: '/create-prescription',
    TEST_CREATE_PRESCRIPTION: '/test-create-prescription',
    ANALYSIS_PROGRESS: '/analysis-progress/:analysisJobId',
    ANALYSIS_RESULT: '/analysis-result/:analysisId',
    ANALYZED_IMAGE_RESULT: '/analyzed-image-result/:analysisId',
    PRESCRIPTION_HISTORY: '/prescription-history',
    
    // 기타 (향후 확장용)
    CALENDAR: '/calendar',
    C: '/c',
    D: '/d',
} as const;

// 타입 정의
export type RouteKey = keyof typeof ROUTES;
export type RouteValue = typeof ROUTES[RouteKey];
