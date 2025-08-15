import React from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useCreateAccount, createAccountDefaultValues } from "../../../../hooks/useCreateAccountHandler";
import { CreateAccountRequest } from "../../../../types/account/request";
import { ROUTES } from '../../../../constants/routes';
import { AccountNameSection, ContactInfoSection, LoginIdSection, PasswordSection, ErrorState } from "../molecules";
import { PaymentInfoSection } from "../organisms";

const CreateAccountForm: React.FC = () => {
    const navigate = useNavigate();
    
    const { 
        handleCreateAccount,
        isPending: isPendingCreateAccount, 
        isError: isErrorCreateAccount 
    } = useCreateAccount({
        onSuccess: () => {
            alert('계정이 성공적으로 생성되었습니다!');
            navigate(ROUTES.LOGIN);
        },
        onError: (error: any) => {
            console.error('Error creating account:', error.message);
        }
    });

    const { 
        register, 
        handleSubmit, 
        formState: { errors },
        reset,
    } = useForm<CreateAccountRequest>({
        defaultValues: createAccountDefaultValues
    });
    
    const onSubmit = async (data: CreateAccountRequest) => {
        try {
            await handleCreateAccount(data);
            reset();
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <AccountNameSection register={register} errors={errors} />
                <ContactInfoSection register={register} errors={errors} />
                <LoginIdSection register={register} errors={errors} />
                <PasswordSection register={register} errors={errors} />
                <PaymentInfoSection register={register} />

                <button 
                    type="submit"
                    disabled={isPendingCreateAccount}
                    className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                        isPendingCreateAccount 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                    } text-white`}
                >
                    {isPendingCreateAccount ? 'Creating...' : 'Submit'}
                </button>
            </form>

            {isErrorCreateAccount && <ErrorState />}
        </>
    );
};

export default CreateAccountForm;