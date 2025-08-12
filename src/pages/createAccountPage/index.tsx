import React from 'react';
import { useCreateAccount, createAccountDefaultValues } from "../../hooks/useCreateAccountHandler";
import { useForm } from "react-hook-form";
import { CreateAccountRequest } from "../../types/account/request";
import { AccountNameSection } from "./components/molecules/AccountNameSection";
import { ContactInfoSection } from "./components/molecules/ContactInfoSection";
import { LoginIdSection } from "./components/molecules/LoginIdSection";
import { PasswordSection } from "./components/molecules/PasswordSection";
import { PaymentInfoSection } from "./components/organisms/PaymentInfoSection";
import { useNavigate } from "react-router-dom";
import { ROUTES } from '../../constants/routes';

export const CreateAccountPage = () => {
    const navigate = useNavigate();
    
    const { 
        handleCreateAccount,
        isPending: isPendingCreateAccount, 
        // isSuccess: isSuccessCreateAccount, 
        isError: isErrorCreateAccount 
    } = useCreateAccount({
        onSuccess: () => {
            // 성공 토스트 메시지 표시
            alert('계정이 성공적으로 생성되었습니다!');
            
            // 로그인 페이지로 이동
            navigate(ROUTES.LOGIN);
        },
        onError: (error) => {
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
            reset(); // 성공 시 폼 초기화
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };

    return (
        <div className="p-5 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">Create New Account</h1>
            
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

            {isErrorCreateAccount && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-center">
                    Error creating account. Please try again.
                </div>
            )}
        </div>
    )
}; 