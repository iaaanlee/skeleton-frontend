import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccountAuth } from '../../../../contexts/AccountAuthContext';
import { ROUTES } from '../../../../constants/routes';

type AuthenticationGuardProps = {
  children: React.ReactNode;
};

const AuthenticationGuard: React.FC<AuthenticationGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAccountAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default AuthenticationGuard;