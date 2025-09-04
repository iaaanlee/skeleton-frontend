import React from 'react';
import { useForm } from 'react-hook-form';
import { ProfileInfo } from '../../../../types/profile/profile';
import { UpdateProfileRequest, CreateProfileRequest } from '../../../../types/profile/request';
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
    // NaN 값을 null로 변환하는 헬퍼 함수
    const sanitizeNumber = (value: any): number | null => {
        if (value === null || value === undefined) return null;
        const num = typeof value === 'number' ? value : Number(value);
        return isNaN(num) ? null : num;
    };

    // bodyStatus 데이터 정제
    const sanitizedBodyStatus = profile?.bodyStatus ? {
        gender: (profile.bodyStatus.gender || 'male') as 'male' | 'female',
        birthYear: sanitizeNumber(profile.bodyStatus.birthYear),
        height: sanitizeNumber(profile.bodyStatus.height),
        weight: sanitizeNumber(profile.bodyStatus.weight),
        detailInfo: profile.bodyStatus.detailInfo ? {
            bodyFatRatioPercent: sanitizeNumber(profile.bodyStatus.detailInfo.bodyFatRatioPercent),
            skeletalMuscleMassKg: sanitizeNumber(profile.bodyStatus.detailInfo.skeletalMuscleMassKg)
        } : undefined
    } : {
        gender: 'male' as 'male' | 'female',
        birthYear: null,
        height: null,
        weight: null,
        detailInfo: undefined
    };

    // exerciseInfoList 데이터 정제
    const sanitizedExerciseInfoList = (profile?.exerciseInfoList || []).map(exercise => ({
        ...exercise,
        trainingYear: sanitizeNumber(exercise.trainingYear)
    }));

    // preferences 데이터 정제
    const sanitizedPreferences = profile?.preferences ? {
        ...profile.preferences,
        exerciseTime: (profile.preferences.exerciseTime || []).map(time => {
            const num = sanitizeNumber(time);
            return num !== null ? num : undefined;
        }).filter((t): t is number => t !== undefined)
    } : {
        exerciseIntensity: null,
        exerciseFrequency: [],
        exerciseTime: [],
        exerciseLocation: [],
        exerciseEquipment: []
    };

    const { 
        register, 
        handleSubmit, 
        formState: { errors },
        reset,
        control,
        watch
    } = useForm<CreateProfileRequest>({
        defaultValues: {
            profileName: profile?.profileName || '',
            bodyStatus: sanitizedBodyStatus,
            exerciseInfoList: sanitizedExerciseInfoList,
            cautions: profile?.cautions || {
                disease: [],
                injury: [],
                surgery: [],
                sensitivePart: [],
                dangerousPart: []
            },
            preferences: sanitizedPreferences,
        }
    });

    const handleFormSubmit = (data: CreateProfileRequest) => {
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

        onSubmit(data as UpdateProfileRequest);
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
