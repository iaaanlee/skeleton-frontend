import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FormInput } from "../atoms/FormInput";
import { LoginRequest } from "../../../../../types/account/request";

interface LoginFormProps {
    register: UseFormRegister<LoginRequest>;
    errors: FieldErrors<LoginRequest>;
}

export const LoginForm = ({ register, errors }: LoginFormProps) => {
    return (
        <div className="space-y-4">
            <FormInput
                type="text"
                placeholder="Enter login ID"
                register={register}
                name="loginId"
                error={errors.loginId}
                validation={{ required: '로그인 ID는 필수입니다' }}
                label="Login ID"
            />
            
            <FormInput
                type="password"
                placeholder="Enter password"
                register={register}
                name="password"
                error={errors.password}
                validation={{ 
                    required: '비밀번호는 필수입니다',
                    minLength: { value: 8, message: '비밀번호는 최소 8자 이상이어야 합니다' }
                }}
                label="Password"
            />
        </div>
    );
}; 