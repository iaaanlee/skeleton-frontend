import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FormInput } from "../atoms/FormInput";
import { FormSelect } from "../atoms/FormSelect";
import { CreateUserRequest } from "../../../../types/request";

interface BodyInfoSectionProps {
    register: UseFormRegister<CreateUserRequest>;
    errors: FieldErrors<CreateUserRequest>;
}

export const BodyInfoSection = ({ register, errors }: BodyInfoSectionProps) => {
    const genderOptions = [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" }
    ];

    return (
        <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Body Information *</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormSelect
                    register={register}
                    name="bodyStatus.gender"
                    error={errors.bodyStatus?.gender}
                    validation={{ required: '성별을 선택해주세요' }}
                    options={genderOptions}
                    placeholder="Select gender"
                />
                
                <FormInput
                    type="number"
                    placeholder="Birth year"
                    register={register}
                    name="bodyStatus.birthYear"
                    error={errors.bodyStatus?.birthYear}
                    validation={{
                        required: '출생년도는 필수입니다',
                        min: { value: 1900, message: '1900년 이후여야 합니다' },
                        max: { value: 2024, message: '2024년 이전이어야 합니다' },
                        valueAsNumber: true
                    }}
                />
                
                <FormInput
                    type="number"
                    placeholder="Height (cm)"
                    register={register}
                    name="bodyStatus.height"
                    error={errors.bodyStatus?.height}
                    validation={{
                        required: '키는 필수입니다',
                        min: { value: 0, message: '키는 0보다 커야 합니다' },
                        valueAsNumber: true
                    }}
                />
                
                <FormInput
                    type="number"
                    placeholder="Weight (kg)"
                    register={register}
                    name="bodyStatus.weight"
                    error={errors.bodyStatus?.weight}
                    validation={{
                        required: '체중은 필수입니다',
                        min: { value: 0, message: '체중은 0보다 커야 합니다' },
                        valueAsNumber: true
                    }}
                />
                
                <FormInput
                    type="number"
                    placeholder="Body fat % (optional)"
                    register={register}
                    name="bodyStatus.detailInfo.bodyFatRatioPercent"
                    validation={{
                        valueAsNumber: true,
                        min: { value: 0, message: '체지방률은 0 이상이어야 합니다' },
                        max: { value: 100, message: '체지방률은 100 이하여야 합니다' }
                    }}
                />
                
                <FormInput
                    type="number"
                    placeholder="Skeletal muscle mass (kg)"
                    register={register}
                    name="bodyStatus.detailInfo.skeletalMuscleMassKg (optional)"
                    validation={{
                        valueAsNumber: true,
                        min: { value: 0, message: '골격근량은 0 이상이어야 합니다' }
                    }}
                />
            </div>
        </div>
    );
}; 