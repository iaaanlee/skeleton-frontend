import React from 'react';

type DescriptionSectionProps = {
  value: {
    ans1: string;
    ans2: string;
  };
  onChange: (value: { ans1: string; ans2: string }) => void;
  className?: string;
};

export const DescriptionSection: React.FC<DescriptionSectionProps> = ({
  value,
  onChange,
  className = ''
}) => {
  const handleAns1Change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ ...value, ans1: e.target.value });
  };

  const handleAns2Change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ ...value, ans2: e.target.value });
  };

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-medium text-blue-900 mb-2">
        운동 분석 요청사항
      </h3>
      <p className="text-sm text-blue-700 mb-4">
        분석하고 싶은 운동에 대한 질문에 답변해주세요.
      </p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-blue-800 mb-2">
            질문 1
          </label>
          <textarea
            value={value.ans1}
            onChange={handleAns1Change}
            placeholder="첫 번째 질문에 대한 답변을 입력해주세요..."
            className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
            <span>첫 번째 질문 답변</span>
            <span>{value.ans1.length} / 500자</span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-blue-800 mb-2">
            질문 2
          </label>
          <textarea
            value={value.ans2}
            onChange={handleAns2Change}
            placeholder="두 번째 질문에 대한 답변을 입력해주세요..."
            className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
            <span>두 번째 질문 답변</span>
            <span>{value.ans2.length} / 500자</span>
          </div>
        </div>
      </div>
    </div>
  );
};
