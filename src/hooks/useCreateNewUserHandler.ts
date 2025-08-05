import { useCreateNewUserProfileMutation } from "../services/mainService/mutation";
import { CreateUserProfileRequest } from "../types/request";

// Default values for the form (without _id and accountId)
export const createUserDefaultValues: CreateUserProfileRequest = {
    profileName: '',
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

type CreateNewUserProfileHandlerProps = {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
};

export const useCreateNewUserProfileHandler = ({ onSuccess, onError }: CreateNewUserProfileHandlerProps) => {
    const mutation = useCreateNewUserProfileMutation({ onSuccess, onError });

    return {
        handleCreateNewUserProfile: mutation.mutateAsync,
        isPending: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
    };
}; 