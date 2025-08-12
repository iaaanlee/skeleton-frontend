import React from 'react';
import { useForm } from 'react-hook-form';
import { ProfileInfo } from '../../../../types/profile/profile';
import { UpdateProfileRequest } from '../../../../types/profile/request';
import { VALIDATION_CONSTANTS } from '../../../../constants/validation';
import { ProfileNameSection } from './ProfileNameSection';
import { BodyStatusInfoSection } from './BodyStatusInfoSection';
import { ExerciseInfoSection } from '../organisms/ExerciseInfoSection';
import { PreferencesSection } from '../organisms/PreferencesSection';
import { CautionsSection } from '../organisms/CautionsSection';
import { UpdateButton } from '../atoms/UpdateButton';

interface EditProfileFormProps {
    profile: ProfileInfo;
    onSubmit: (data: UpdateProfileRequest) => void;
    isPending: boolean;
}

export const EditProfileForm = ({ profile, onSubmit, isPending }: EditProfileFormProps) => {
    const { 
        register, 
        handleSubmit, 
        formState: { errors },
        reset,
        control,
        watch
    } = useForm<UpdateProfileRequest>({
        defaultValues: {
            profileName: profile?.profileName || '',
            bodyStatus: profile?.bodyStatus || {
                gender: 'male',
                birthYear: null,
                height: null,
                weight: null
            },
            exerciseInfoList: profile?.exerciseInfoList || [],
            cautions: profile?.cautions || {
                disease: [],
                injury: [],
                surgery: [],
                sensitivePart: [],
                dangerousPart: []
            },
            preferences: profile?.preferences || {
                exerciseIntensity: null,
                exerciseFrequency: [],
                exerciseTime: [],
                exerciseLocation: [],
                exerciseEquipment: []
            },
        }
    });

    const handleFormSubmit = (data: UpdateProfileRequest) => {
        // 유효성 검사
        if (data.bodyStatus.birthYear && (data.bodyStatus.birthYear < VALIDATION_CONSTANTS.BIRTH_YEAR.MIN || data.bodyStatus.birthYear > VALIDATION_CONSTANTS.BIRTH_YEAR.MAX)) {
            alert(VALIDATION_CONSTANTS.BIRTH_YEAR.RANGE_MESSAGE);
            return;
        }

        if (data.bodyStatus.height && (data.bodyStatus.height < VALIDATION_CONSTANTS.HEIGHT.MIN || data.bodyStatus.height > VALIDATION_CONSTANTS.HEIGHT.MAX)) {
            alert(VALIDATION_CONSTANTS.HEIGHT.RANGE_MESSAGE);
            return;
        }

        if (data.bodyStatus.weight && (data.bodyStatus.weight < VALIDATION_CONSTANTS.WEIGHT.MIN || data.bodyStatus.weight > VALIDATION_CONSTANTS.WEIGHT.MAX)) {
            alert(VALIDATION_CONSTANTS.WEIGHT.RANGE_MESSAGE);
            return;
        }

        onSubmit(data);
    };

    return (
        <div className="p-5 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">프로필 정보 수정</h1>
            
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
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

                <UpdateButton isPending={isPending} />
            </form>
        </div>
    );
};
