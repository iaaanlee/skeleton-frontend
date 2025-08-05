import { createBrowserRouter } from 'react-router-dom';
import { MainPage } from './pages/main';

export const getRouter = () => {
  return createBrowserRouter([
    {
      path: '/',
      element: <MainPage />,
    },
    {
      path: '/main',
      element: <MainPage />,
    },
    {
      path: '*',
      element: <MainPage />,
    },
  ]);
}; 