import { useProfile } from '../../contexts/ProfileAuthContext';
import { Header } from '../../components/common/templates/Header';
import { BottomBar } from '../../components/common/templates/BottomBar';
import { MainContent } from './components/organisms/MainContent';

export const MainPage = () => {
    const { selectedProfile } = useProfile();

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header profileName={selectedProfile?.profileName} />
            <MainContent />
            <BottomBar />
        </div>
    );
};
