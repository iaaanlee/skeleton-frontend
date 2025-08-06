import { createBrowserRouter } from 'react-router-dom';
import { LoginPage } from './pages/loginPage';
import { CreateProfilePage } from './pages/createProfilePage';
import { CreateAccountPage } from './pages/createAccountPage';
import { SelectProfilePage } from './pages/selectProfilePage';

export const getRouter = () => {
  return createBrowserRouter([
    {
      path: '/',
      element: <SelectProfilePage />,
    },
    {
      path: '/main',
      element: <SelectProfilePage />,
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/create-account',
      element: <CreateAccountPage />,
    },
    {
      path: '/create-profile',
      element: <CreateProfilePage />,
    },
    {
      path: '*',
      element: <LoginPage />,
    },
  ]);
}; 