import { UseFormRegister, FieldError } from "react-hook-form";

interface FormSelectProps {
    register: UseFormRegister<any>;
    name: string;
    error?: FieldError;
    validation?: any;
    label?: string;
    options: { value: string; label: string }[];
    placeholder?: string;
}

export const FormSelect = ({ 
    register, 
    name, 
    error, 
    validation = {}, 
    label, 
    options, 
    placeholder 
}: FormSelectProps) => {
    return (
        <div>
            {label && (
                <label className="block text-sm font-medium mb-2 text-gray-700">
                    {label}
                </label>
            )}
            <select 
                {...register(name, validation)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="text-red-500 text-sm mt-1">{error.message}</p>
            )}
        </div>
    );
}; 