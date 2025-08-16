import React from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useCreateProfile, createProfileDefaultValues } from "../../../../hooks/useCreateProfileHandler";
import { CreateProfileRequest } from "../../../../types/profile/request";
import { useAccountAuth } from "../../../../contexts/AccountAuthContext";
import { ROUTES } from '../../../../constants/routes';
import { ProfileNameSection, BodyStatusInfoSection } from "../molecules";
import { ErrorState } from '../../../../components/common/molecules';
import { ExerciseInfoSection, PreferencesSection, CautionsSection } from "../organisms";

const CreateProfileForm: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAccountAuth();
    
    const { 
        handleCreateProfile,
        isPending: isPendingCreateProfile, 
        isError: isErrorCreateProfile 
    } = useCreateProfile({
        onSuccess: () => {
            alert('프로필이 성공적으로 생성되었습니다!');
            navigate(ROUTES.SELECT_PROFILE);
        },
        onError: (error: Error) => {
            console.error('Error creating profile:', error.message);
        }
    });

    const { 
        register, 
        handleSubmit, 
        formState: { errors },
        reset,
        control,
        watch
    } = useForm<CreateProfileRequest>({
        defaultValues: createProfileDefaultValues
    });
    
    if (!isAuthenticated) {
        return null;
    }

    const onSubmit = async (data: CreateProfileRequest) => {
        try {
            await handleCreateProfile(data);
            reset();
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <ProfileNameSection register={register} errors={errors} />
                <BodyStatusInfoSection register={register} errors={errors} />
                <ExerciseInfoSection 
                    register={register} 
                    watch={watch} 
                    reset={reset} 
                    control={control} 
                />
                <PreferencesSection register={register} />
                <CautionsSection register={register} watch={watch} reset={reset} />

                <button 
                    type="submit"
                    disabled={isPendingCreateProfile}
                    className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                        isPendingCreateProfile 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                    } text-white`}
                >
                    {isPendingCreateProfile ? 'Creating...' : 'Submit'}
                </button>
            </form>

            {isErrorCreateProfile && <ErrorState />}
        </>
    );
};

export default CreateProfileForm;