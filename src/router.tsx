import { createBrowserRouter } from 'react-router-dom';
import { CreateUserProfilePage } from './pages/createUserProfilePage';

export const getRouter = () => {
  return createBrowserRouter([
    {
      path: '/',
      element: <CreateUserProfilePage />,
    },
    {
      path: '/create-user-profile',
      element: <CreateUserProfilePage />,
    },
    {
      path: '*',
      element: <CreateUserProfilePage />,
    },
  ]);
}; 