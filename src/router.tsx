import { createBrowserRouter } from 'react-router-dom';
import { CreateProfilePage } from './pages/createProfilePage';

export const getRouter = () => {
  return createBrowserRouter([
    {
      path: '/',
      element: <CreateProfilePage />,
    },
    {
      path: '/create-profile',
      element: <CreateProfilePage />,
    },
    {
      path: '*',
      element: <CreateProfilePage />,
    },
  ]);
}; 