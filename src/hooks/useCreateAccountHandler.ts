import { useCreateAccountMutation } from "../services/accountService";
import { CreateAccountRequest } from "../types/account/request";

// Default values for the form (without _id, profileIds, createdAt, updatedAt, deletedAt)
export const createAccountDefaultValues: CreateAccountRequest = {
    loginInfo: {
        loginId: '',
        password: '',
    },
    accountName: '',
    contactInfo: {
        name: '',
        phoneNumber: '',
        email: '',
    },
    paymentInfo: {
        paymentMethod: null,
    },
};

type CreateAccountProps = {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
};

export const useCreateAccount = ({ onSuccess, onError }: CreateAccountProps) => {
    const mutation = useCreateAccountMutation({ onSuccess, onError });

    return {
        handleCreateAccount: mutation.mutateAsync,
        isPending: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
    };
}; 