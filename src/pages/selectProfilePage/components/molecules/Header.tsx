interface HeaderProps {
    onLogout: () => void;
}

export const Header = ({ onLogout }: HeaderProps) => {
    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <h1 className="text-2xl font-bold text-gray-900">TEST</h1>
                    <button
                        onClick={onLogout}
                        className="text-gray-600 hover:text-gray-900 font-medium"
                    >
                        로그아웃
                    </button>
                </div>
            </div>
        </header>
    );
}; 