import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './router';
import { AccountAuthProvider } from './contexts/AccountAuthContext'
import { ProfileAuthProvider } from './contexts/ProfileAuthContext'

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AccountAuthProvider>
        <ProfileAuthProvider>
          <RouterProvider router={router} />
        </ProfileAuthProvider>
      </AccountAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
