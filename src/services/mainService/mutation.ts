// POST PUT
import { useMutation } from "@tanstack/react-query";
import { mainService } from "./service";
import { CreateUserProfileRequest } from "../../types/request";

export const useCreateNewUserProfileMutation = ({ onSuccess, onError }: {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
} = {}) => {
    return useMutation({
        mutationFn: async (userProfileInfo: CreateUserProfileRequest) => {
            return await mainService.createNewUserProfile(userProfileInfo);
        },
        onSuccess: () => {
            onSuccess?.();
        },
        onError: (error: Error) => {
            onError?.(error);
        },
    });
};