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
import { ProtectedRoute } from './routes';
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
        element: <ProtectedRoute requireProfile={true}><CreatePrescriptionPage /></ProtectedRoute>
    }
]); 