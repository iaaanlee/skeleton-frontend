import { useLoginMutation } from "../services/accountService";
import { LoginRequest } from "../types/account/request";
import { ILoginResponse } from "../types/account/response";

// Default values for the login form
export const loginDefaultValues: LoginRequest = {
    loginId: '',
    password: '',
};

type LoginProps = {
    onSuccess?: (data: ILoginResponse['data']) => void;
    onError?: (error: Error) => void;
};

export const useLogin = ({ onSuccess, onError }: LoginProps) => {
    const mutation = useLoginMutation({ onSuccess, onError });

    return {
        handleLogin: mutation.mutateAsync,
        isPending: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
    };
}; 