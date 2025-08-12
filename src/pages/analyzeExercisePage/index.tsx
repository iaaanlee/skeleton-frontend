// import { useProfile } from '../../contexts/ProfileAuthContext';
import { Header } from '../../components/common/templates/Header';
import { BottomBar } from '../../components/common/templates/BottomBar';
import { MainContent } from './components/organisms/MainContent';
import { ROUTES } from '../../constants/routes';


export const AnalyzeExercisePage = () => {
    // const { selectedProfile } = useProfile();

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header backRoute={ROUTES.MAIN} />
            <MainContent />
            <BottomBar />
        </div>
    );
};
