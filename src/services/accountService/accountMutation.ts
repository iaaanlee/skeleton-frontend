// Account 관련 mutations
import { useMutation } from "@tanstack/react-query";
import { accountService } from "./accountService";
import { CreateAccountRequest, LoginRequest } from "../../types/account/request";

export const useLoginMutation = ({ onSuccess, onError }: {
    onSuccess?: (data: any) => void;
    onError?: (error: Error) => void;
} = {}) => {
    return useMutation({
        mutationFn: async (input: LoginRequest) => {
            return await accountService.login(input);
        },
        onSuccess: (data) => {
            onSuccess?.(data);
        },
        onError: (error: Error) => {
            onError?.(error);
        },
    });
};

export const useCreateAccountMutation = ({ onSuccess, onError }: {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
} = {}) => {
    return useMutation({
        mutationFn: async (input: CreateAccountRequest) => {
            return await accountService.createAccount(input);
        },
        onSuccess: () => {
            onSuccess?.();
        },
        onError: (error: Error) => {
            onError?.(error);
        },
    });
}; 