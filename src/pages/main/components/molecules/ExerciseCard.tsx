import { UseFormRegister, UseFormWatch } from "react-hook-form";
import { FormInput } from "../atoms/FormInput";
import { FormSelect } from "../atoms/FormSelect";
import { AddButton } from "../atoms/AddButton";
import { RemoveButton } from "../atoms/RemoveButton";
import { CreateUserRequest } from "../../../../types/request";

interface ExerciseCardProps {
    exerciseIndex: number;
    register: UseFormRegister<CreateUserRequest>;
    watch: UseFormWatch<CreateUserRequest>;
    onAddPerformance: (exerciseIndex: number) => void;
    onRemovePerformance: (exerciseIndex: number, perfIndex: number) => void;
    onRemoveExercise: (exerciseIndex: number) => void;
    canRemove: boolean;
}

export const ExerciseCard = ({
    exerciseIndex,
    register,
    watch,
    onAddPerformance,
    onRemovePerformance,
    onRemoveExercise,
    canRemove
}: ExerciseCardProps) => {
    const exerciseLevelOptions = [
        { value: "low", label: "Low" },
        { value: "medium", label: "Medium" },
        { value: "high", label: "High" }
    ];

    const performanceDescriptions = watch(`exerciseInfoList.${exerciseIndex}.performanceDescription`) || [];

    return (
        <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-white">
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-700">Exercise {exerciseIndex + 1}</h3>
                {canRemove && (
                    <RemoveButton onClick={() => onRemoveExercise(exerciseIndex)}>
                        Remove
                    </RemoveButton>
                )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <FormInput
                    type="text"
                    placeholder="Exercise name (optional)"
                    register={register}
                    name={`exerciseInfoList.${exerciseIndex}.exerciseName`}
                />
                
                <FormSelect
                    register={register}
                    name={`exerciseInfoList.${exerciseIndex}.exerciseLevel`}
                    options={exerciseLevelOptions}
                    placeholder="Select exercise level (optional)"
                />
                
                <FormInput
                    type="number"
                    placeholder="Training years (optional)"
                    register={register}
                    name={`exerciseInfoList.${exerciseIndex}.trainingYear`}
                    validation={{
                        valueAsNumber: true,
                        min: { value: 0, message: '훈련 연차는 0 이상이어야 합니다' }
                    }}
                />
            </div>

            {/* Performance Description Section */}
            <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Performance Descriptions (Optional)
                    </label>
                    <AddButton
                        onClick={() => onAddPerformance(exerciseIndex)}
                        variant="secondary"
                        size="sm"
                    >
                        + Add Performance
                    </AddButton>
                </div>
                
                {performanceDescriptions.map((_, perfIndex) => (
                    <div key={perfIndex} className="flex gap-2 mb-2">
                        <input 
                            type="text" 
                            placeholder="e.g., 중량 딥스 30kg 5rm, 스쿼트 200kg 1rm" 
                            {...register(`exerciseInfoList.${exerciseIndex}.performanceDescription.${perfIndex}`)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <RemoveButton
                            onClick={() => onRemovePerformance(exerciseIndex, perfIndex)}
                            variant="icon"
                        >
                            ×
                        </RemoveButton>
                    </div>
                ))}
            </div>
        </div>
    );
}; 