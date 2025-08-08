import { createBrowserRouter } from 'react-router-dom';
import { LoginPage } from './contexts/pages/loginPage';
import { CreateAccountPage } from './contexts/pages/createAccountPage';
import { SelectProfilePage } from './contexts/pages/selectProfilePage';
import { CreateProfilePage } from './contexts/pages/createProfilePage';
import { MainPage } from './contexts/pages/mainPage';
import { ProfilePage } from './contexts/pages/profilePage';
import { EditProfilePage } from './contexts/pages/editProfilePage';
import { AnalyzeExercisePage } from './contexts/pages/analyzeExercisePage';
import { CreateNewPrescriptionPage } from './contexts/pages/createNewPrescriptionPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ROUTES } from './constants/routes';

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
        element: <ProtectedRoute requireProfile={true}><CreateNewPrescriptionPage /></ProtectedRoute>
    }
]); 