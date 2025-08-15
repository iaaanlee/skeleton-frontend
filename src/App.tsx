import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './router';
import { AccountAuthProvider } from './contexts/AccountAuthContext'
import { ProfileProvider } from './contexts/ProfileContext'
import { ToastProvider } from './contexts/ToastContext'

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AccountAuthProvider>
        <ProfileProvider>
          <ToastProvider>
            <RouterProvider router={router} />
          </ToastProvider>
        </ProfileProvider>
      </AccountAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
