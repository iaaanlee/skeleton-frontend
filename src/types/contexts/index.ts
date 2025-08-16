// Context types

export type ToastItem = {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export type ToastContextType = {
  showToast: (type: 'success' | 'error' | 'warning' | 'info', message: string, duration?: number) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
}

export type ToastProviderProps = {
  children: React.ReactNode;
}

export type AccountAuthContextType = {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string, refreshToken?: string) => void;
  logout: () => void;
}

export type AccountAuthProviderProps = {
  children: React.ReactNode;
}

export type CurrentProfileInfo = {
  profileId: string;
  profileName: string;
  accountId: string;
} | null;

export type ProfileContextType = {
  currentProfile: CurrentProfileInfo;
  isLoading: boolean;
  error: Error | string | null;
  selectProfile: (profileId: string) => Promise<void>;
  clearProfile: () => Promise<void>;
  refetchProfile: () => void;
}

export type ProfileProviderProps = {
  children: React.ReactNode;
}