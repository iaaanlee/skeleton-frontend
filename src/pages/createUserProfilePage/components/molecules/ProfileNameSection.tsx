import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FormInput } from "../atoms/FormInput";
import { CreateUserProfileRequest } from "../../../../types/request";

interface ProfileNameSectionProps {
    register: UseFormRegister<CreateUserProfileRequest>;
    errors: FieldErrors<CreateUserProfileRequest>;
}

export const ProfileNameSection = ({ register, errors }: ProfileNameSectionProps) => {
    return (
        <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Profile Information *</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    type="text"
                    placeholder="Enter profile name"
                    register={register}
                    name="profileName"
                    error={errors.profileName}
                    validation={{ required: '프로필 이름은 필수입니다' }}
                    label="Profile Name"
                />
            </div>
        </div>
    );
}; 