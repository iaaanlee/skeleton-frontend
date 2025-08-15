// Common component types

export type DropdownButtonProps = {
  label: string;
  onClick: () => void;
  isDanger?: boolean;
}

export type ProfileDropdownProps = {
  isOpen: boolean;
  onSelectOtherProfile: () => void;
  onLogout: () => void;
  onClose: () => void;
}

export type HeaderContentProps = {
  profileName?: string;
  backRoute?: string;
}

export type BackButtonProps = {
  backRoute?: string;
}

export type CloseButtonProps = {
  onClick: () => void;
}

export type ToastProps = {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

export type BottomBarButtonProps = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isActive?: boolean;
}