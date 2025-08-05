interface AddButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    variant?: "primary" | "secondary";
    size?: "sm" | "md";
}

export const AddButton = ({ 
    onClick, 
    children, 
    variant = "primary", 
    size = "md" 
}: AddButtonProps) => {
    const baseClasses = "font-medium rounded-md transition-colors";
    const variantClasses = {
        primary: "bg-green-500 hover:bg-green-600 text-white",
        secondary: "bg-blue-500 hover:bg-blue-600 text-white"
    };
    const sizeClasses = {
        sm: "px-2 py-1 text-xs",
        md: "px-3 py-1 text-sm"
    };

    return (
        <button
            type="button"
            onClick={onClick}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
        >
            {children}
        </button>
    );
}; 