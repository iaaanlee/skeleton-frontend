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

// 프로필 선택 관련 mutations (새로 추가)
export const useSelectProfileMutation = ({ onSuccess, onError }: {
    onSuccess?: (data: any) => void;
    onError?: (error: Error) => void;
} = {}) => {
    return useMutation({
        mutationFn: async (profileId: string) => {
            return await profileService.selectProfile(profileId);
        },
        onSuccess: (data) => {
            onSuccess?.(data);
        },
        onError: (error: Error) => {
            onError?.(error);
        },
    });
};

export const useClearProfileMutation = ({ onSuccess, onError }: {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
} = {}) => {
    return useMutation({
        mutationFn: async () => {
            return await profileService.clearProfile();
        },
        onSuccess: () => {
            onSuccess?.();
        },
        onError: (error: Error) => {
            onError?.(error);
        },
    });
}; 