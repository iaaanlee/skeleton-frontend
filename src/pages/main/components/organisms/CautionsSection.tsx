import { UseFormRegister } from "react-hook-form";
import { FormInput } from "../atoms/FormInput";
import { CreateUserRequest } from "../../../../types/request";

interface CautionsSectionProps {
    register: UseFormRegister<CreateUserRequest>;
}

export const CautionsSection = ({ register }: CautionsSectionProps) => {
    return (
        <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Health Cautions (Optional)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    type="text"
                    placeholder="e.g., diabetes, hypertension"
                    register={register}
                    name="cautions.disease"
                    label="Diseases (comma separated)"
                />
                
                <FormInput
                    type="text"
                    placeholder="e.g., knee injury, back pain"
                    register={register}
                    name="cautions.injury"
                    label="Injuries (comma separated)"
                />
                
                <FormInput
                    type="text"
                    placeholder="e.g., knee surgery, appendectomy"
                    register={register}
                    name="cautions.surgery"
                    label="Surgeries (comma separated)"
                />
                
                <FormInput
                    type="text"
                    placeholder="e.g., neck, lower back"
                    register={register}
                    name="cautions.sensitivePart"
                    label="Sensitive parts (comma separated)"
                />
                
                <FormInput
                    type="text"
                    placeholder="e.g., heart, spine"
                    register={register}
                    name="cautions.dangerousPart"
                    label="Dangerous parts (comma separated)"
                />
            </div>
        </div>
    );
}; 