interface ProfileButtonProps {
    profileName: string;
    onClick: () => void;
    isCreateButton?: boolean;
}

export const ProfileButton = ({ profileName, onClick, isCreateButton = false }: ProfileButtonProps) => {
    if (isCreateButton) {
        return (
            <button
                onClick={onClick}
                className="w-32 h-32 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors duration-200 flex items-center justify-center text-gray-600 font-medium text-lg shadow-lg hover:shadow-xl border-2 border-dashed border-gray-400"
            >
                <span className="text-4xl">+</span>
            </button>
        );
    }

    return (
        <button
            onClick={onClick}
            className="w-32 h-32 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center text-white font-medium text-lg shadow-lg hover:shadow-xl"
        >
            <span>{profileName}</span>
        </button>
    );
}; 