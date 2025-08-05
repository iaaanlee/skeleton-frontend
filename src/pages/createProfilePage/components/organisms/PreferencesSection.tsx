import { UseFormRegister } from "react-hook-form";
import { FormSelect } from "../atoms/FormSelect";
import { CreateProfileRequest } from "../../../../types/profile/request";

interface PreferencesSectionProps {
    register: UseFormRegister<CreateProfileRequest>;
}

export const PreferencesSection = ({ register }: PreferencesSectionProps) => {
    const exerciseIntensityOptions = [
        { value: "low", label: "Low" },
        { value: "medium", label: "Medium" },
        { value: "high", label: "High" }
    ];

    return (
        <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Exercise Preferences (Optional)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormSelect
                    register={register}
                    name="preferences.exerciseIntensity"
                    options={exerciseIntensityOptions}
                    placeholder="Select exercise intensity (optional)"
                    label="Exercise Intensity"
                />
            </div>
        </div>
    );
}; 