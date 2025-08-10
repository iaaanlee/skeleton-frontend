import React from 'react';

type FileListHeaderProps = {
  title: string;
  fileCount: number;
  onAddClick?: () => void;
  showAddButton?: boolean;
};

export const FileListHeader: React.FC<FileListHeaderProps> = ({
  title,
  fileCount,
  onAddClick,
  showAddButton = false
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span className="text-sm text-gray-500">({fileCount}개)</span>
      </div>
      
      <div className="flex items-center space-x-3">
        {showAddButton && onAddClick && (
          <button
            onClick={onAddClick}
            className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>추가</span>
          </button>
        )}
      </div>
    </div>
  );
};
