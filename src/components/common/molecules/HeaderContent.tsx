import { NotificationButton } from '../atoms/NotificationButton';
import { BackButton } from '../organisms/BackButton';
import { RouteValue } from '../../../constants/routes'

interface HeaderContentProps {
    profileName?: string;
    backRoute?: RouteValue;
}

export const HeaderContent = ({ profileName, backRoute }: HeaderContentProps) => {
    return (
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    {backRoute ? (
                        <BackButton backRoute={backRoute} />
                    ) : (
                        <div className="text-lg font-medium text-gray-900">
                            {profileName || '프로필'}
                        </div>
                    )}
                </div>
                <NotificationButton />
            </div>
        </header>
    );
};
