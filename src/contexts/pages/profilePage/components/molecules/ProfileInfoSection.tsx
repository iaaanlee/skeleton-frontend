import React from 'react';
import { LogoutButton } from '../atoms/LogoutButton';
import { SelectOtherProfileButton } from '../atoms/SelectOtherProfileButton';
import { EditProfileButton } from '../atoms/EditProfileButton';

interface ProfileInfoSectionProps {
    profileName: string;
    onLogout: () => void;
    onSelectOtherProfile: () => void;
    onEditProfile: () => void;
}

export const ProfileInfoSection = ({ profileName, onLogout, onSelectOtherProfile, onEditProfile }: ProfileInfoSectionProps) => {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            {/* 프로필 이름 */}
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {profileName}
                </h2>
                <p className="text-gray-600">
                    프로필 주인
                </p>
            </div>
            
            {/* 구분선 */}
            <div className="border-t border-gray-200"></div>
            
            {/* 프로필 정보 수정 버튼 */}
            <div className="pt-4">
                <EditProfileButton onClick={onEditProfile} />
            </div>
            
            {/* 다른 프로필 선택 버튼 */}
            <div>
                <SelectOtherProfileButton onClick={onSelectOtherProfile} />
            </div>
            
            {/* 로그아웃 버튼 */}
            <div>
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};
