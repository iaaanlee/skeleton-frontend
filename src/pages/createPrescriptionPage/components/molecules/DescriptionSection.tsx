import React from 'react';

type DescriptionSectionProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export const DescriptionSection: React.FC<DescriptionSectionProps> = ({
  value,
  onChange,
  className = ''
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-medium text-blue-900 mb-2">
        운동 분석 요청사항
      </h3>
      <p className="text-sm text-blue-700 mb-4">
        분석하고 싶은 운동에 대한 설명이나 특별한 요청사항을 자유롭게 작성해주세요.
      </p>
      
      <div className="space-y-3">
        <textarea
          value={value}
          onChange={handleChange}
          placeholder="예시: 스쿼트 자세가 올바른지 확인해주세요. 무릎이 발끝을 넘어가지 않는지, 허리가 굽지 않는지 중점적으로 분석해주세요."
          className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>자유롭게 운동 분석 요청사항을 작성하세요</span>
          <span>{value.length} / 1000자</span>
        </div>
      </div>
    </div>
  );
};
