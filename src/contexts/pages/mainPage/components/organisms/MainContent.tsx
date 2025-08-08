import { MainButtonList } from '../molecules/MainButtonList';

export const MainContent = () => {
    return (
        <div className="flex-1 p-4 overflow-y-auto">
            <div className="max-w-2xl mx-auto">
                <MainButtonList />
            </div>
        </div>
    );
};
