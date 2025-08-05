import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FormInput } from "../atoms/FormInput";
import { CreateAccountRequest } from "../../../../types/account/request";

interface AccountNameSectionProps {
    register: UseFormRegister<CreateAccountRequest>;
    errors: FieldErrors<CreateAccountRequest>;
}

export const AccountNameSection = ({ register, errors }: AccountNameSectionProps) => {
    return (
        <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Account Information *</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    type="text"
                    placeholder="Enter account name"
                    register={register}
                    name="accountName"
                    error={errors.accountName}
                    validation={{ required: '계정 이름은 필수입니다' }}
                    label="Account Name"
                />
            </div>
        </div>
    );
}; 