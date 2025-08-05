// POST PUT
import { useMutation } from "@tanstack/react-query";
import { mainService } from "./service";
import { CreateProfileRequest } from "../../types/profile/request";
import { CreateAccountRequest, LoginRequest } from "../../types/account/request";

export const useLoginMutation = ({ onSuccess, onError }: {
    onSuccess?: (data: any) => void;
    onError?: (error: Error) => void;
} = {}) => {
    return useMutation({
        mutationFn: async (input: LoginRequest) => {
            return await mainService.login(input);
        },
        onSuccess: (data) => {
            onSuccess?.(data);
        },
        onError: (error: Error) => {
            onError?.(error);
        },
    });
};

export const useCreateProfileMutation = ({ onSuccess, onError }: {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
} = {}) => {
    return useMutation({
        mutationFn: async (input: CreateProfileRequest) => {
            return await mainService.createProfile(input);
        },
        onSuccess: () => {
            onSuccess?.();
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
            return await mainService.createAccount(input);
        },
        onSuccess: () => {
            onSuccess?.();
        },
        onError: (error: Error) => {
            onError?.(error);
        },
    });
};