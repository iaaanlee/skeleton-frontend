import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { CreateProfileRequest } from '../../../../types/profile/request';

interface ProfileNameSectionProps {
    register: UseFormRegister<CreateProfileRequest>;
    errors: FieldErrors<CreateProfileRequest>;
}

export const ProfileNameSection = ({ register, errors }: ProfileNameSectionProps) => {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">프로필 이름</h3>
            <input
                type="text"
                {...register('profileName', { required: '프로필 이름을 입력해주세요.' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="프로필 이름을 입력하세요"
            />
            {errors.profileName && (
                <p className="mt-1 text-sm text-red-600">{errors.profileName.message}</p>
            )}
        </div>
    );
};
