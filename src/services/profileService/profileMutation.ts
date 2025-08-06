// Profile 관련 mutations
import { useMutation } from "@tanstack/react-query";
import { profileService } from "./profileService";
import { CreateProfileRequest } from "../../types/profile/request";

export const useCreateProfileMutation = ({ onSuccess, onError }: {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
} = {}) => {
    return useMutation({
        mutationFn: async (input: CreateProfileRequest) => {
            return await profileService.createProfile(input);
        },
        onSuccess: () => {
            onSuccess?.();
        },
        onError: (error: Error) => {
            onError?.(error);
        },
    });
}; 