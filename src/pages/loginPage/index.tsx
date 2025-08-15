import React from 'react';
import { useLogin, loginDefaultValues } from "../../hooks/useLoginHandler";
import { useForm } from "react-hook-form";
import { LoginRequest } from "../../types/account/request";
import { LoginForm } from "./components/molecules/LoginForm";
import { useNavigate } from "react-router-dom";
import { useAccountAuth } from "../../contexts/AccountAuthContext";
import { ROUTES } from '../../constants/routes';

export const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAccountAuth();
    
    const { 
        handleLogin,
        isPending: isPendingLogin, 
        isSuccess: isSuccessLogin, 
        isError: isErrorLogin 
    } = useLogin({
        onSuccess: (data) => {
            // 토큰 저장 (accessToken과 refreshToken)
            if (data.accessToken && data.refreshToken) {
                login(data.accessToken, data.refreshToken);
            }
            // 로그인 성공 후 select-profile 페이지로 리다이렉트
            navigate(ROUTES.SELECT_PROFILE);
        },
        onError: (error) => {
            console.error('Login failed:', error.message);
        }
    });

    const { 
        register, 
        handleSubmit, 
        formState: { errors },
        reset,
    } = useForm<LoginRequest>({
        defaultValues: loginDefaultValues
    });

    const onSubmit = async (data: LoginRequest) => {
        try {
            await handleLogin(data);
            reset(); // 성공 시 폼 초기화
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };

    const handleCreateAccount = () => {
        navigate(ROUTES.CREATE_ACCOUNT);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h1 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
                        TEST
                    </h1>
                    
                    <div className="bg-white py-8 px-6 shadow rounded-lg">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <LoginForm register={register} errors={errors} />

                            <button 
                                type="submit"
                                disabled={isPendingLogin}
                                className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                                    isPendingLogin 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                                } text-white`}
                            >
                                {isPendingLogin ? 'Logging in...' : 'Login'}
                            </button>
                        </form>

                        {isSuccessLogin && (
                            <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-center">
                                Login successful!
                            </div>
                        )}

                        {isErrorLogin && (
                            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-center">
                                Login failed. Please check your credentials.
                            </div>
                        )}
                    </div>

                    <div className="mt-6 text-center">
                        <button
                            onClick={handleCreateAccount}
                            className="text-blue-600 hover:text-blue-500 font-medium"
                        >
                            신규 계정 생성
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}; 