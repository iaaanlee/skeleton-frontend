import { createBrowserRouter } from 'react-router-dom';
import { LoginPage } from './pages/loginPage';
import { CreateAccountPage } from './pages/createAccountPage';
import { SelectProfilePage } from './pages/selectProfilePage';
import { CreateProfilePage } from './pages/createProfilePage';
import { MainPage } from './pages/mainPage';
import { ProfilePage } from './pages/profilePage';
import { EditProfilePage } from './pages/editProfilePage';
import { AnalyzeExercisePage } from './pages/analyzeExercisePage';
import { CreatePrescriptionPage } from './pages/createPrescriptionPage';
import { TestCreatePrescriptionPage } from './pages/testCreatePrescriptionPage';
import { ProcessVideoPage } from './pages/processVideoPage';
import { AnalysisProgressPage } from './pages/analysisProgressPage';
import { AnalysisResultPage } from './pages/analysisResultPage';
import { AnalyzedImageResultPage } from './pages/analyzedImageResultPage';
import { PrescriptionHistoryPage } from './pages/prescriptionHistoryPage';
import { ManageSessionSchedulePage } from './pages/manageSessionSchedulePage';
import { SessionInstanceDetailsPage } from './pages/sessionInstanceDetailsPage';
import { ModifySessionInstancePage } from './pages/modifySessionInstancePage';
import { ProtectedRoute } from './routes';
import { ROUTES } from './constants/routes';
import { Navigate } from 'react-router-dom';
import { useAccountAuth } from './contexts/AccountAuthContext';
import { useProfile } from './contexts/ProfileContext';

// Catch-all 라우트를 위한 컴포넌트
const NotFoundRedirect = () => {
  const { isAuthenticated } = useAccountAuth();
  const { currentProfile, isLoading } = useProfile();

  // 1. account가 없으면 login으로
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. 프로필 로딩 중이면 대기
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div>로딩 중...</div>
    </div>;
  }

  // 3. account는 있는데 profile 정보가 없으면 select-profile로
  if (!currentProfile) {
    return <Navigate to="/select-profile" replace />;
  }

  // 4. 알 수 없는 경로는 기본적으로 main으로
  return <Navigate to="/main" replace />;
};

export const router = createBrowserRouter([
    {
        path: ROUTES.ROOT,
        element: <ProtectedRoute requireProfile={true}><MainPage /></ProtectedRoute>
    },
    {
        path: ROUTES.LOGIN,
        element: <LoginPage />
    },
    {
        path: ROUTES.CREATE_ACCOUNT,
        element: <CreateAccountPage />
    },
    {
        path: ROUTES.SELECT_PROFILE,
        element: <ProtectedRoute><SelectProfilePage /></ProtectedRoute>
    },
    {
        path: ROUTES.CREATE_PROFILE,
        element: <ProtectedRoute><CreateProfilePage /></ProtectedRoute>
    },
    {
        path: ROUTES.MAIN,
        element: <ProtectedRoute requireProfile={true}><MainPage /></ProtectedRoute>
    },
    {
        path: ROUTES.PROFILE,
        element: <ProtectedRoute requireProfile={true}><ProfilePage /></ProtectedRoute>
    },
    {
        path: ROUTES.EDIT_PROFILE,
        element: <ProtectedRoute requireProfile={true}><EditProfilePage /></ProtectedRoute>
    },
    {
        path: ROUTES.ANALYZE_EXERCISE,
        element: <ProtectedRoute requireProfile={true}><AnalyzeExercisePage /></ProtectedRoute>
    },
    {
        path: ROUTES.CREATE_PRESCRIPTION,
        element: <ProtectedRoute requireProfile={true}><CreatePrescriptionPage /></ProtectedRoute>
    },
    {
        path: ROUTES.TEST_CREATE_PRESCRIPTION,
        element: <ProtectedRoute requireProfile={true}><TestCreatePrescriptionPage /></ProtectedRoute>
    },
    {
        path: ROUTES.PROCESS_VIDEO,
        element: <ProtectedRoute requireProfile={true}><ProcessVideoPage /></ProtectedRoute>
    },
    {
        path: ROUTES.ANALYSIS_PROGRESS,
        element: <ProtectedRoute requireProfile={true}><AnalysisProgressPage /></ProtectedRoute>
    },
    {
        path: ROUTES.ANALYSIS_RESULT,
        element: <ProtectedRoute requireProfile={true}><AnalysisResultPage /></ProtectedRoute>
    },
    {
        path: ROUTES.ANALYZED_IMAGE_RESULT,
        element: <ProtectedRoute requireProfile={true}><AnalyzedImageResultPage /></ProtectedRoute>
    },
    {
        path: ROUTES.PRESCRIPTION_HISTORY,
        element: <ProtectedRoute requireProfile={true}><PrescriptionHistoryPage /></ProtectedRoute>
    },
    {
        path: ROUTES.MANAGE_SESSION_SCHEDULE,
        element: <ProtectedRoute requireProfile={true}><ManageSessionSchedulePage /></ProtectedRoute>
    },
    {
        path: ROUTES.SESSION_INSTANCE_DETAILS,
        element: <ProtectedRoute requireProfile={true}><SessionInstanceDetailsPage /></ProtectedRoute>
    },
    {
        path: ROUTES.MODIFY_SESSION_INSTANCE,
        element: <ProtectedRoute requireProfile={true}><ModifySessionInstancePage /></ProtectedRoute>
    },
    // Catch-all 라우트 - 반드시 맨 마지막에 위치
    {
        path: "*",
        element: <NotFoundRedirect />
    }
]); 