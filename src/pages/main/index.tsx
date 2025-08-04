import { useCreateNewUserHandler, createUserDefaultValues } from "../../hooks/useCreateNewUserHandler";
import { useForm, useFieldArray } from "react-hook-form";
import { CreateUserRequest } from "../../types/request";

export const MainPage = () => {
    const { 
        handleCreateNewUser,
        isPending: isPendingCreateUser, 
        isSuccess: isSuccessCreateUser, 
        isError: isErrorCreateUser 
    } = useCreateNewUserHandler({
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
    } = useForm<CreateUserRequest>({
        defaultValues: createUserDefaultValues
    });

    // Exercise Info 배열 관리
    const { fields: exerciseFields, append: appendExercise, remove: removeExercise } = useFieldArray({
        control,
        name: "exerciseInfoList"
    });

    const onSubmit = async (data: CreateUserRequest) => {
        try {
            await handleCreateNewUser(data);
            reset(); // 성공 시 폼 초기화
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };

    const addExercise = () => {
        appendExercise({
            exerciseName: '',
            exerciseLevel: 'low',
            trainingYear: 0,
            performanceDescription: [],
        });
    };

    const addPerformanceDescription = (exerciseIndex: number) => {
        const currentValue = watch(`exerciseInfoList.${exerciseIndex}.performanceDescription`) || [];
        const updatedValue = [...currentValue, ''];
        
        // 폼 데이터 업데이트
        const currentData = watch();
        const updatedData = {
            ...currentData,
            exerciseInfoList: currentData.exerciseInfoList.map((exercise, index) => 
                index === exerciseIndex 
                    ? { ...exercise, performanceDescription: updatedValue }
                    : exercise
            )
        };
        
        reset(updatedData);
    };

    const removePerformanceDescription = (exerciseIndex: number, perfIndex: number) => {
        const currentValue = watch(`exerciseInfoList.${exerciseIndex}.performanceDescription`) || [];
        const updatedValue = currentValue.filter((_, index) => index !== perfIndex);
        
        // 폼 데이터 업데이트
        const currentData = watch();
        const updatedData = {
            ...currentData,
            exerciseInfoList: currentData.exerciseInfoList.map((exercise, index) => 
                index === exerciseIndex 
                    ? { ...exercise, performanceDescription: updatedValue }
                    : exercise
            )
        };
        
        reset(updatedData);
    };

    return (
        <div className="p-5 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">Create New User</h1>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Contact Info Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">Contact Information *</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <input 
                                type="text" 
                                placeholder="Enter your name" 
                                {...register('contactInfo.name', { 
                                    required: '이름은 필수입니다' 
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.contactInfo?.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.contactInfo.name.message}</p>
                            )}
                        </div>

                        <div>
                            <input 
                                type="text" 
                                placeholder="Enter your phone number" 
                                {...register('contactInfo.phoneNumber', { 
                                    required: '전화번호는 필수입니다' 
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.contactInfo?.phoneNumber && (
                                <p className="text-red-500 text-sm mt-1">{errors.contactInfo.phoneNumber.message}</p>
                            )}
                        </div>

                        <div>
                            <input 
                                type="email" 
                                placeholder="Enter your email" 
                                {...register('contactInfo.email', { 
                                    required: '이메일은 필수입니다',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: '올바른 이메일 형식이 아닙니다'
                                    }
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.contactInfo?.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.contactInfo.email.message}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Body Status Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">Body Information *</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <select 
                                {...register('bodyStatus.gender', { 
                                    required: '성별을 선택해주세요' 
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                            {errors.bodyStatus?.gender && (
                                <p className="text-red-500 text-sm mt-1">{errors.bodyStatus.gender.message}</p>
                            )}
                        </div>

                        <div>
                            <input 
                                type="number" 
                                placeholder="Birth year" 
                                {...register('bodyStatus.birthYear', { 
                                    required: '출생년도는 필수입니다',
                                    min: { value: 1900, message: '1900년 이후여야 합니다' },
                                    max: { value: 2024, message: '2024년 이전이어야 합니다' },
                                    valueAsNumber: true
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.bodyStatus?.birthYear && (
                                <p className="text-red-500 text-sm mt-1">{errors.bodyStatus.birthYear.message}</p>
                            )}
                        </div>

                        <div>
                            <input 
                                type="number" 
                                placeholder="Height (cm)" 
                                {...register('bodyStatus.height', { 
                                    required: '키는 필수입니다',
                                    min: { value: 0, message: '키는 0보다 커야 합니다' },
                                    valueAsNumber: true
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.bodyStatus?.height && (
                                <p className="text-red-500 text-sm mt-1">{errors.bodyStatus.height.message}</p>
                            )}
                        </div>

                        <div>
                            <input 
                                type="number" 
                                placeholder="Weight (kg)" 
                                {...register('bodyStatus.weight', { 
                                    required: '체중은 필수입니다',
                                    min: { value: 0, message: '체중은 0보다 커야 합니다' },
                                    valueAsNumber: true
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.bodyStatus?.weight && (
                                <p className="text-red-500 text-sm mt-1">{errors.bodyStatus.weight.message}</p>
                            )}
                        </div>

                        <div>
                            <input 
                                type="number" 
                                placeholder="Body fat % (optional)" 
                                {...register('bodyStatus.detailInfo.bodyFatRatioPercent', { 
                                    valueAsNumber: true,
                                    min: { value: 0, message: '체지방률은 0 이상이어야 합니다' },
                                    max: { value: 100, message: '체지방률은 100 이하여야 합니다' }
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <input 
                                type="number" 
                                placeholder="Skeletal muscle mass (kg)" 
                                {...register('bodyStatus.detailInfo.skeletalMuscleMassKg', { 
                                    valueAsNumber: true,
                                    min: { value: 0, message: '골격근량은 0 이상이어야 합니다' }
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Exercise Info Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Exercise Information (Optional)</h2>
                        <button
                            type="button"
                            onClick={addExercise}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm font-medium"
                        >
                            + Add Exercise
                        </button>
                    </div>
                    
                    {exerciseFields.map((field, exerciseIndex) => {
                        const performanceDescriptions = watch(`exerciseInfoList.${exerciseIndex}.performanceDescription`) || [];
                        
                        return (
                            <div key={field.id} className="border border-gray-200 rounded-lg p-4 mb-4 bg-white">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-medium text-gray-700">Exercise {exerciseIndex + 1}</h3>
                                    {exerciseFields.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeExercise(exerciseIndex)}
                                            className="text-red-500 hover:text-red-700 text-sm"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <input 
                                            type="text" 
                                            placeholder="Exercise name (optional)" 
                                            {...register(`exerciseInfoList.${exerciseIndex}.exerciseName`)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <select 
                                            {...register(`exerciseInfoList.${exerciseIndex}.exerciseLevel`)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">Select exercise level (optional)</option>
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                    </div>

                                    <div>
                                        <input 
                                            type="number" 
                                            placeholder="Training years (optional)" 
                                            {...register(`exerciseInfoList.${exerciseIndex}.trainingYear`, { 
                                                valueAsNumber: true,
                                                min: { value: 0, message: '훈련 연차는 0 이상이어야 합니다' }
                                            })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Performance Description Section */}
                                <div className="mt-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Performance Descriptions (Optional)</label>
                                        <button
                                            type="button"
                                            onClick={() => addPerformanceDescription(exerciseIndex)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                                        >
                                            + Add Performance
                                        </button>
                                    </div>
                                    
                                    {/* Performance Description Fields */}
                                    {performanceDescriptions.map((_, perfIndex) => (
                                        <div key={perfIndex} className="flex gap-2 mb-2">
                                            <input 
                                                type="text" 
                                                placeholder="e.g., 중량 딥스 30kg 5rm, 스쿼트 200kg 1rm" 
                                                {...register(`exerciseInfoList.${exerciseIndex}.performanceDescription.${perfIndex}`)}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removePerformanceDescription(exerciseIndex, perfIndex)}
                                                className="text-red-500 hover:text-red-700 px-2 py-1"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Preferences Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">Exercise Preferences (Optional)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Exercise Intensity</label>
                            <select 
                                {...register('preferences.exerciseIntensity')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Select exercise intensity (optional)</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Cautions Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">Health Cautions (Optional)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Diseases (comma separated)</label>
                            <input 
                                type="text" 
                                placeholder="e.g., diabetes, hypertension" 
                                {...register('cautions.disease')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Injuries (comma separated)</label>
                            <input 
                                type="text" 
                                placeholder="e.g., knee injury, back pain" 
                                {...register('cautions.injury')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Surgeries (comma separated)</label>
                            <input 
                                type="text" 
                                placeholder="e.g., knee surgery, appendectomy" 
                                {...register('cautions.surgery')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Sensitive parts (comma separated)</label>
                            <input 
                                type="text" 
                                placeholder="e.g., neck, lower back" 
                                {...register('cautions.sensitivePart')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Dangerous parts (comma separated)</label>
                            <input 
                                type="text" 
                                placeholder="e.g., heart, spine" 
                                {...register('cautions.dangerousPart')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

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
                    User created successfully!
                </div>
            )}

            {isErrorCreateUser && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-center">
                    Error creating user. Please try again.
                </div>
            )}
        </div>
    )
}