import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FormInput } from "../atoms/FormInput";
import { CreateAccountRequest } from "../../../../../types/account/request";

interface LoginIdSectionProps {
    register: UseFormRegister<CreateAccountRequest>;
    errors: FieldErrors<CreateAccountRequest>;
}

export const LoginIdSection = ({ register, errors }: LoginIdSectionProps) => {
    return (
        <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Login Information *</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    type="text"
                    placeholder="Enter login ID"
                    register={register}
                    name="loginInfo.loginId"
                    error={errors.loginInfo?.loginId}
                    validation={{ required: '로그인 ID는 필수입니다' }}
                    label="Login ID"
                />
            </div>
        </div>
    );
}; 