import React from 'react';
import { DropdownButton } from '../atoms/DropdownButton';
import { CloseButton } from '../atoms/CloseButton';

interface ProfileDropdownProps {
    isOpen: boolean;
    onSelectOtherProfile: () => void;
    onLogout: () => void;
    onClose: () => void;
}

export const ProfileDropdown = ({ 
    isOpen, 
    onSelectOtherProfile, 
    onLogout, 
    onClose 
}: ProfileDropdownProps) => {
    if (!isOpen) return null;

    return (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
            <CloseButton onClick={onClose} />
            <div className="py-1 pt-8">
                <DropdownButton 
                    label="다른 프로필 선택" 
                    onClick={onSelectOtherProfile} 
                />
                <DropdownButton 
                    label="로그아웃" 
                    onClick={onLogout} 
                    isDanger={true}
                />
            </div>
        </div>
    );
};
