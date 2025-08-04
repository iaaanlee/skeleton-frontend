import { createBrowserRouter } from 'react-router-dom';
import { MainServiceRoute } from './pages';

export const getRouter = () => {
  return createBrowserRouter([
    {
      path: '/*',
      element: <MainServiceRoute />,
    },
  ]);
}; 