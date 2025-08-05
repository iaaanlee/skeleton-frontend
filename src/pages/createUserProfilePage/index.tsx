import { useCreateNewUserProfileHandler, createUserDefaultValues } from "../../hooks/useCreateNewUserHandler";
import { useForm } from "react-hook-form";
import { CreateUserProfileRequest } from "../../types/request";
import { ProfileNameSection } from "./components/molecules/ProfileNameSection";
import { BodyStatusInfoSection } from "./components/molecules/BodyStatusInfoSection";
import { ExerciseInfoSection } from "./components/organisms/ExerciseInfoSection";
import { PreferencesSection } from "./components/organisms/PreferencesSection";
import { CautionsSection } from "./components/organisms/CautionsSection";

export const CreateUserProfilePage = () => { // 프로필 생성 페이지
    const { 
        handleCreateNewUserProfile,
        isPending: isPendingCreateUser, 
        isSuccess: isSuccessCreateUser, 
        isError: isErrorCreateUser 
    } = useCreateNewUserProfileHandler({
        onSuccess: () => {
            console.log('User created successfully!');
        },
        onError: (error) => {
            console.error('Error creating user:', error.message);
        }
    });

    const { 
        register, 
        handleSubmit, 
        formState: { errors },
        reset,
        control,
        watch
    } = useForm<CreateUserProfileRequest>({
        defaultValues: createUserDefaultValues
    });

    const onSubmit = async (data: CreateUserProfileRequest) => {
        try {
            await handleCreateNewUserProfile(data);
            reset(); // 성공 시 폼 초기화
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };

    return (
        <div className="p-5 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">Create New User Profile</h1>
            
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
                    disabled={isPendingCreateUser}
                    className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                        isPendingCreateUser 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                    } text-white`}
                >
                    {isPendingCreateUser ? 'Creating...' : 'Submit'}
                </button>
            </form>

            {isSuccessCreateUser && (
                <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-center">
                    User profile created successfully!
                </div>
            )}

            {isErrorCreateUser && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-center">
                    Error creating user profile. Please try again.
                </div>
            )}
        </div>
    )
}