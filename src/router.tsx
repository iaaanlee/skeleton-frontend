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
import { AnalysisProgressPage } from './pages/analysisProgressPage';
import { AnalysisResultPage } from './pages/analysisResultPage';
import { AnalyzedImageResultPage } from './pages/analyzedImageResultPage';
import { PrescriptionHistoryPage } from './pages/prescriptionHistoryPage';
import { ProtectedRoute } from './routes';
import { ROUTES } from './constants/routes';
import { Navigate } from 'react-router-dom';
import { useAccountAuth } from './contexts/AccountAuthContext';
import { useProfile } from './contexts/ProfileContext';

// Catch-all 라우트를 위한 컴포넌트
const NotFoundRedirect = () => {
  const { isAuthenticated } = useAccountAuth();
  const { currentProfile } = useProfile();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!currentProfile) {
    return <Navigate to="/select-profile" replace />;
  }

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
    // Catch-all 라우트 - 반드시 맨 마지막에 위치
    {
        path: "*",
        element: <NotFoundRedirect />
    }
]); 