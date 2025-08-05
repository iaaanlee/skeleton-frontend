import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FormInput } from "../atoms/FormInput";
import { CreateAccountRequest } from "../../../../types/account/request";

interface PasswordSectionProps {
    register: UseFormRegister<CreateAccountRequest>;
    errors: FieldErrors<CreateAccountRequest>;
}

export const PasswordSection = ({ register, errors }: PasswordSectionProps) => {
    return (
        <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Password *</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    type="password"
                    placeholder="Enter password"
                    register={register}
                    name="loginInfo.password"
                    error={errors.loginInfo?.password}
                    validation={{ 
                        required: '비밀번호는 필수입니다',
                        minLength: { value: 8, message: '비밀번호는 최소 8자 이상이어야 합니다' }
                    }}
                    label="Password"
                />
            </div>
        </div>
    );
}; 