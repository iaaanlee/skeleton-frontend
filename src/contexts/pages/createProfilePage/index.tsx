import { useCreateProfile, createProfileDefaultValues } from "../../../hooks/useCreateProfileHandler";
import { useForm } from "react-hook-form";
import { CreateProfileRequest } from "../../../types/profile/request";
import { ProfileNameSection } from "./components/molecules/ProfileNameSection";
import { BodyStatusInfoSection } from "./components/molecules/BodyStatusInfoSection";
import { ExerciseInfoSection } from "./components/organisms/ExerciseInfoSection";
import { PreferencesSection } from "./components/organisms/PreferencesSection";
import { CautionsSection } from "./components/organisms/CautionsSection";
import { useAccountAuth } from "../../AccountAuthContext";
import { useProfile } from "../../ProfileAuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ROUTES } from '../../../constants/routes';

export const CreateProfilePage = () => { // 프로필 생성 페이지
    const navigate = useNavigate();
    const { isAuthenticated } = useAccountAuth();
    const { setSelectedProfile } = useProfile();
    
    const { 
        handleCreateProfile,
        isPending: isPendingCreateProfile, 
        isSuccess: isSuccessCreateProfile, 
        isError: isErrorCreateProfile 
    } = useCreateProfile({
        onSuccess: () => {
            // 성공 토스트 메시지 표시
            alert('프로필이 성공적으로 생성되었습니다!');
            
            // 새로 생성된 프로필 정보는 별도로 처리
            // TODO: 프로필 생성 후 해당 프로필을 자동 선택하려면
            // 별도의 API 호출이나 상태 관리가 필요합니다
            
            // select-profile 페이지로 이동
            navigate(ROUTES.SELECT_PROFILE);
        },
        onError: (error) => {
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
    
    // 로그인되지 않은 경우 로딩 표시
    if (!isAuthenticated) {
        return <div className="min-h-screen flex items-center justify-center">로그인 중...</div>;
    }

    const onSubmit = async (data: CreateProfileRequest) => {
        try {
            await handleCreateProfile(data);
            reset(); // 성공 시 폼 초기화
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };

    return (
        <div className="p-5 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">Create New Profile</h1>
            
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



            {isErrorCreateProfile && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-center">
                    Error creating profile. Please try again.
                </div>
            )}
        </div>
    )
};