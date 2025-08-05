interface RemoveButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    variant?: "text" | "icon";
}

export const RemoveButton = ({ 
    onClick, 
    children, 
    variant = "text" 
}: RemoveButtonProps) => {
    const baseClasses = "hover:text-red-700 transition-colors";
    const variantClasses = {
        text: "text-red-500 text-sm",
        icon: "text-red-500 px-2 py-1"
    };

    return (
        <button
            type="button"
            onClick={onClick}
            className={`${baseClasses} ${variantClasses[variant]}`}
        >
            {children}
        </button>
    );
}; 