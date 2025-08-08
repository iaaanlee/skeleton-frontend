import React from 'react';
import { BackButton } from '../../../../../components/common/organisms/BackButton';
import { ROUTES } from '../../../../../constants/routes';

export const EditProfileHeaderContent = () => {
    return (
        <div className="flex justify-between items-center h-16">
            {/* 좌측: 뒤로가기 버튼 */}
            <BackButton backRoute={ROUTES.PROFILE} />
            
            {/* 중앙: 제목 */}
            <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">
                    프로필 정보 수정
                </h1>
            </div>
            
            {/* 우측: 빈 공간 (균형을 위해) */}
            <div className="w-10"></div>
        </div>
    );
};
