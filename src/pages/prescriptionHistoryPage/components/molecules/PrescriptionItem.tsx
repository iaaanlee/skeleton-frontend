import React from 'react';

type PrescriptionItemProps = {
  prescription: any;
  onClick: () => void;
};

export const PrescriptionItem: React.FC<PrescriptionItemProps> = ({
  prescription,
  onClick
}) => {
  const thumbnailUrl = prescription.thumbnailUrl;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <button
      onClick={onClick}
      className="w-full p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left"
    >
      <div className="flex items-center space-x-4">
        {/* 썸네일 이미지 또는 기본 아이콘 */}
        {thumbnailUrl ? (
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
            <img 
              src={thumbnailUrl} 
              alt="분석 결과 썸네일"
              className="w-full h-full object-cover"
              onError={(e) => {
                // 이미지 로드 실패 시 기본 아이콘으로 대체
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center hidden">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        ) : (
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        )}
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {prescription.title || '운동 자세 분석'}
            </h3>
            <span className="text-sm text-gray-500">
              {formatDate(prescription.createdAt)}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mt-1">
            {prescription.description || '운동 자세 분석 결과'}
          </p>
          
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              {prescription.fileCount || 0}개 이미지
            </span>
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
              분석 완료
            </span>
          </div>
        </div>
        
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
};
