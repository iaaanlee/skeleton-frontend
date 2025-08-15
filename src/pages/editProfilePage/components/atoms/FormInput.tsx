import { UseFormRegister, FieldError } from "react-hook-form";

interface FormInputProps {
    type: "text" | "email" | "number";
    placeholder: string;
    register: UseFormRegister<any>;
    name: string;
    error?: FieldError;
    validation?: any;
    label?: string;
}

export const FormInput = ({ 
    type, 
    placeholder, 
    register, 
    name, 
    error, 
    validation = {}, 
    label 
}: FormInputProps) => {
    return (
        <div>
            {label && (
                <label className="block text-sm font-medium mb-2 text-gray-700">
                    {label}
                </label>
            )}
            <input 
                type={type} 
                placeholder={placeholder} 
                {...register(name, validation)}
                onWheel={(e) => e.currentTarget.blur()} // 스크롤 시 포커스 해제로 숫자 변경 방지
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {error && (
                <p className="text-red-500 text-sm mt-1">{error.message}</p>
            )}
        </div>
    );
}; 