import { useCreateProfileMutation } from "../services/mainService/mutation";
import { CreateProfileRequest } from "../types/profile/request";

// Default values for the form (without _id and accountId)
export const createProfileDefaultValues: CreateProfileRequest = {
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

type CreateProfileProps = {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
};

export const useCreateProfile = ({ onSuccess, onError }: CreateProfileProps) => {
    const mutation = useCreateProfileMutation({ onSuccess, onError });

    return {
        handleCreateProfile: mutation.mutateAsync,
        isPending: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
    };
}; 