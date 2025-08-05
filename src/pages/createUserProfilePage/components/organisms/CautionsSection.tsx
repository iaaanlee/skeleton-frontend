import { UseFormRegister, UseFormWatch, UseFormReset } from "react-hook-form";
import { FormInput } from "../atoms/FormInput";
import { AddButton } from "../atoms/AddButton";
import { RemoveButton } from "../atoms/RemoveButton";
import { CreateUserProfileRequest } from "../../../../types/request";

interface CautionsSectionProps {
    register: UseFormRegister<CreateUserProfileRequest>;
    watch: UseFormWatch<CreateUserProfileRequest>;
    reset: UseFormReset<CreateUserProfileRequest>;
}

export const CautionsSection = ({ register, watch, reset }: CautionsSectionProps) => {
    const currentData = watch();
    const cautions = currentData.cautions || {
        disease: [],
        injury: [],
        surgery: [],
        sensitivePart: [],
        dangerousPart: []
    };

    const addCautionItem = (category: keyof typeof cautions) => {
        const updatedCautions = {
            ...cautions,
            [category]: [...cautions[category], '']
        };
        
        reset({
            ...currentData,
            cautions: updatedCautions
        });
    };

    const removeCautionItem = (category: keyof typeof cautions, index: number) => {
        const updatedCautions = {
            ...cautions,
            [category]: cautions[category].filter((_, i) => i !== index)
        };
        
        reset({
            ...currentData,
            cautions: updatedCautions
        });
    };

    const cautionCategories = [
        { key: 'disease', label: 'Diseases', placeholder: 'e.g., diabetes, hypertension' },
        { key: 'injury', label: 'Injuries', placeholder: 'e.g., knee injury, back pain' },
        { key: 'surgery', label: 'Surgeries', placeholder: 'e.g., knee surgery, appendectomy' },
        { key: 'sensitivePart', label: 'Sensitive parts', placeholder: 'e.g., neck, lower back' },
        { key: 'dangerousPart', label: 'Dangerous parts', placeholder: 'e.g., heart, spine' }
    ] as const;

    return (
        <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Health Cautions (Optional)</h2>
            <div className="space-y-6">
                {cautionCategories.map(({ key, label, placeholder }) => (
                    <div key={key} className="border border-gray-200 rounded-lg p-4 bg-white">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-medium text-gray-700">{label}</h3>
                            <AddButton
                                onClick={() => addCautionItem(key)}
                                variant="secondary"
                                size="sm"
                            >
                                + Add {label.slice(0, -1)}
                            </AddButton>
                        </div>
                        
                        {cautions[key].map((_, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input 
                                    type="text" 
                                    placeholder={placeholder}
                                    {...register(`cautions.${key}.${index}`)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <RemoveButton
                                    onClick={() => removeCautionItem(key, index)}
                                    variant="icon"
                                >
                                    ×
                                </RemoveButton>
                            </div>
                        ))}
                        
                        {cautions[key].length === 0 && (
                            <p className="text-gray-500 text-sm italic">No {label.toLowerCase()} added yet</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}; 