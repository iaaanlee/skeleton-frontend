import { useProfile } from "../../../../ProfileAuthContext";

interface HeaderProps {
    onLogout: () => void;
}

export const Header = ({ onLogout }: HeaderProps) => {
    const { selectedProfile, isProfileSelected } = useProfile();
    
    return (
        <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <h1 className="text-xl font-semibold text-gray-900">
                            프로필 선택
                        </h1>
                        {isProfileSelected && (
                            <div className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                선택됨: {selectedProfile?.profileName}
                            </div>
                        )}
                    </div>
                    
                    <button
                        onClick={onLogout}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        로그아웃
                    </button>
                </div>
            </div>
        </header>
    );
}; 