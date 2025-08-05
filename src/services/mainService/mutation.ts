// POST PUT
import { useMutation } from "@tanstack/react-query";
import { mainService } from "./service";
import { CreateProfileRequest } from "../../types/request";

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