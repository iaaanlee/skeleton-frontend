import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../../../contexts/ProfileContext';
import { ROUTES } from '../../../../constants/routes';

type ProfileSelectionHandlerProps = {
  isSelecting: boolean;
  selectedProfileId: string | null;
  onNavigationComplete: () => void;
};

const ProfileSelectionHandler: React.FC<ProfileSelectionHandlerProps> = ({
  isSelecting,
  selectedProfileId,
  onNavigationComplete
}) => {
  const navigate = useNavigate();
  const { currentProfile } = useProfile();

  useEffect(() => {
    if (currentProfile && isSelecting && selectedProfileId) {
      if (currentProfile.profileId === selectedProfileId) {
        onNavigationComplete();
        navigate(ROUTES.MAIN);
      }
    }
  }, [currentProfile, isSelecting, selectedProfileId, navigate, onNavigationComplete]);

  return null;
};

export default ProfileSelectionHandler;