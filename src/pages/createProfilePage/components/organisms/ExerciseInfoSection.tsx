import { UseFormRegister, UseFormWatch, UseFormReset } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { AddButton } from "../atoms/AddButton";
import { ExerciseCard } from "../molecules/ExerciseCard";
import { CreateProfileRequest } from "../../../../types/profile/request";

interface ExerciseInfoSectionProps {
    register: UseFormRegister<CreateProfileRequest>;
    watch: UseFormWatch<CreateProfileRequest>;
    reset: UseFormReset<CreateProfileRequest>;
    control: any;
}

export const ExerciseInfoSection = ({
    register,
    watch,
    reset,
    control
}: ExerciseInfoSectionProps) => {
    const { fields: exerciseFields, append: appendExercise, remove: removeExercise } = useFieldArray({
        control,
        name: "exerciseInfoList"
    });

    const addExercise = () => {
        appendExercise({
            exerciseName: '',
            exerciseLevel: 'low',
            trainingYear: null,
            performanceDescription: [],
        });
    };

    const addPerformanceDescription = (exerciseIndex: number) => {
        const currentValue = watch(`exerciseInfoList.${exerciseIndex}.performanceDescription`) || [];
        const updatedValue = [...currentValue, ''];
        
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
        <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Exercise Information (Optional)</h2>
                <AddButton onClick={addExercise}>
                    + Add Exercise
                </AddButton>
            </div>
            
            {exerciseFields.map((field, exerciseIndex) => (
                <ExerciseCard
                    key={field.id}
                    exerciseIndex={exerciseIndex}
                    register={register}
                    watch={watch}
                    onAddPerformance={addPerformanceDescription}
                    onRemovePerformance={removePerformanceDescription}
                    onRemoveExercise={removeExercise}
                    canRemove={exerciseFields.length > 1}
                />
            ))}
        </div>
    );
}; 