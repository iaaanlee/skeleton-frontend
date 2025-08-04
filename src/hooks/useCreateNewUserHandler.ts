import { useMutation } from "@tanstack/react-query";
import { mainService } from "../services/mainService/service";
import { CreateUserRequest } from "../types/request";
import { UserInfo } from "../types/user";

// Default values for the form
export const createUserDefaultValues: CreateUserRequest = {
    contactInfo: {
        name: '',
        phoneNumber: '',
        email: '',
    },
    bodyStatus: {
        gender: 'male',
        birthYear: null,
        height: null,
        weight: null,
        detailInfo: {
            bodyFatRatioPercent: null,
            skeletalMuscleMassKg: null,
        },
    },
    exerciseInfoList: [{
        exerciseName: '',
        exerciseLevel: 'low',
        trainingYear: null,
        performanceDescription: [],
    }],
    cautions: {
        disease: [],
        injury: [],
        surgery: [],
        sensitivePart: [],
        dangerousPart: [],
    },
    preferences: {
        exerciseIntensity: null,
        exerciseFrequency: [],
        exerciseTime: [],
        exerciseLocation: [],
        exerciseEquipment: [],
    },
};

type CreateNewUserHandlerProps = {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
};

export const useCreateNewUserHandler = ({ onSuccess, onError }: CreateNewUserHandlerProps) => {
    const mutation = useMutation({
        mutationFn: async (userData: CreateUserRequest) => {
            const userInfo: UserInfo = {
                contactInfo: userData.contactInfo,
                bodyStatus: userData.bodyStatus,
                exerciseInfoList: userData.exerciseInfoList,
                cautions: userData.cautions,
                preferences: userData.preferences,
            };
            
            return await mainService.createNewUser(userInfo);
        },
        onSuccess: () => {
            onSuccess?.();
        },
        onError: (error: Error) => {
            onError?.(error);
        },
    });

    return {
        handleCreateNewUser: mutation.mutateAsync,
        isPending: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
    };
}; 