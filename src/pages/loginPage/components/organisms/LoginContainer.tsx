import React from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useLogin, loginDefaultValues } from "../../../../hooks/useLoginHandler";
import { useAccountAuth } from "../../../../contexts/AccountAuthContext";
import { LoginRequest } from "../../../../types/account/request";
import { ROUTES } from '../../../../constants/routes';
import { LoginForm } from "../molecules/LoginForm";
import SuccessMessage from "../molecules/SuccessMessage";
import ErrorMessage from "../molecules/ErrorMessage";
import CreateAccountButton from "../molecules/CreateAccountButton";

const LoginContainer: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAccountAuth();
    
    const { 
        handleLogin,
        isPending: isPendingLogin, 
        isSuccess: isSuccessLogin, 
        isError: isErrorLogin 
    } = useLogin({
        onSuccess: (data) => {
            if (data.accessToken && data.refreshToken) {
                login(data.accessToken, data.refreshToken);
            }
            navigate(ROUTES.SELECT_PROFILE);
        },
        onError: (error: Error) => {
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
            reset();
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };

    const handleCreateAccount = () => {
        navigate(ROUTES.CREATE_ACCOUNT);
    };

    return (
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

                    {isSuccessLogin && <SuccessMessage />}
                    {isErrorLogin && <ErrorMessage />}
                </div>

                <CreateAccountButton onClick={handleCreateAccount} />
            </div>
        </div>
    );
};

export default LoginContainer;