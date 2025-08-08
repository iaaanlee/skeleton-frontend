import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FormInput } from "../atoms/FormInput";
import { FormSelect } from "../atoms/FormSelect";
import { CreateProfileRequest } from "../../../../types/profile/request";
import { VALIDATION_CONSTANTS } from "../../../../constants/validation";

interface BodyStatusInfoSectionProps {
    register: UseFormRegister<CreateProfileRequest>;
    errors: FieldErrors<CreateProfileRequest>;
}

export const BodyStatusInfoSection = ({ register, errors }: BodyStatusInfoSectionProps) => {
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
                        min: { value: VALIDATION_CONSTANTS.BIRTH_YEAR.MIN, message: VALIDATION_CONSTANTS.BIRTH_YEAR.MIN_MESSAGE },
                        max: { value: VALIDATION_CONSTANTS.BIRTH_YEAR.MAX, message: VALIDATION_CONSTANTS.BIRTH_YEAR.MAX_MESSAGE },
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
                        min: { value: VALIDATION_CONSTANTS.HEIGHT.MIN, message: VALIDATION_CONSTANTS.HEIGHT.MIN_MESSAGE },
                        max: { value: VALIDATION_CONSTANTS.HEIGHT.MAX, message: VALIDATION_CONSTANTS.HEIGHT.MAX_MESSAGE },
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
                        min: { value: VALIDATION_CONSTANTS.WEIGHT.MIN, message: VALIDATION_CONSTANTS.WEIGHT.MIN_MESSAGE },
                        max: { value: VALIDATION_CONSTANTS.WEIGHT.MAX, message: VALIDATION_CONSTANTS.WEIGHT.MAX_MESSAGE },
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
                        min: { value: VALIDATION_CONSTANTS.BODY_FAT_RATIO.MIN, message: VALIDATION_CONSTANTS.BODY_FAT_RATIO.MIN_MESSAGE },
                        max: { value: VALIDATION_CONSTANTS.BODY_FAT_RATIO.MAX, message: VALIDATION_CONSTANTS.BODY_FAT_RATIO.MAX_MESSAGE }
                    }}
                />
                
                <FormInput
                    type="number"
                    placeholder="Skeletal muscle mass (kg)"
                    register={register}
                    name="bodyStatus.detailInfo.skeletalMuscleMassKg"
                    validation={{
                        valueAsNumber: true,
                        min: { value: VALIDATION_CONSTANTS.SKELETAL_MUSCLE_MASS.MIN, message: VALIDATION_CONSTANTS.SKELETAL_MUSCLE_MASS.MIN_MESSAGE },
                        max: { value: VALIDATION_CONSTANTS.SKELETAL_MUSCLE_MASS.MAX, message: VALIDATION_CONSTANTS.SKELETAL_MUSCLE_MASS.MAX_MESSAGE }
                    }}
                />
            </div>
        </div>
    );
};
