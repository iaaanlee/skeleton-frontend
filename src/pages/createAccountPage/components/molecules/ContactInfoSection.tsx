import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FormInput } from "../atoms/FormInput";
import { CreateAccountRequest } from "../../../../types/account/request";

interface ContactInfoSectionProps {
    register: UseFormRegister<CreateAccountRequest>;
    errors: FieldErrors<CreateAccountRequest>;
}

export const ContactInfoSection = ({ register, errors }: ContactInfoSectionProps) => {
    return (
        <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Contact Information *</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput
                    type="text"
                    placeholder="Enter your name"
                    register={register}
                    name="contactInfo.name"
                    error={errors.contactInfo?.name}
                    validation={{ required: '이름은 필수입니다' }}
                    label="Name"
                />
                
                <FormInput
                    type="text"
                    placeholder="Enter your phone number"
                    register={register}
                    name="contactInfo.phoneNumber"
                    error={errors.contactInfo?.phoneNumber}
                    validation={{ required: '전화번호는 필수입니다' }}
                    label="Phone Number"
                />
                
                <FormInput
                    type="email"
                    placeholder="Enter your email"
                    register={register}
                    name="contactInfo.email"
                    error={errors.contactInfo?.email}
                    validation={{
                        required: '이메일은 필수입니다',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: '올바른 이메일 형식이 아닙니다'
                        }
                    }}
                    label="Email"
                />
            </div>
        </div>
    );
}; 