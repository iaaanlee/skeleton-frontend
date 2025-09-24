import React from 'react';
import { useSeriesByProfile } from '../../../../services/workoutService';
import { SeriesSummary } from '../../../../types/workout';

type Props = {
  profileId: string;
};

export const SeriesStrip: React.FC<Props> = ({ profileId }) => {
  const { data: seriesData, isLoading, error } = useSeriesByProfile({
    profileId,
    limit: 10, // 최대 10개만 표시
  });

  if (isLoading) {
    return (
      <div className="bg-white py-4 border-b border-gray-200">
        <div className="px-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">시리즈</h3>
          <div className="flex gap-3 overflow-x-auto">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-32 h-20 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white py-4 border-b border-gray-200">
        <div className="px-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">시리즈</h3>
          <div className="text-sm text-gray-500">시리즈를 불러올 수 없습니다.</div>
        </div>
      </div>
    );
  }

  const series = seriesData?.series || [];

  return (
    <div className="bg-white py-4 border-b border-gray-200">
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700">시리즈</h3>
          {series.length > 0 && (
            <button className="text-xs text-blue-600 hover:text-blue-800">
              더보기
            </button>
          )}
        </div>

        {series.length === 0 ? (
          <div className="text-sm text-gray-500 text-center py-8">
            등록된 시리즈가 없습니다.
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {series.map((seriesItem) => (
              <SeriesCard key={seriesItem.seriesId} series={seriesItem} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const SeriesCard: React.FC<{ series: SeriesSummary }> = ({ series }) => {
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'started': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex-shrink-0 w-48 bg-gray-50 rounded-lg p-3 border hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-sm text-gray-900 truncate flex-1">
          {series.seriesName}
        </h4>
        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(series.status)}`}>
          {series.status === 'scheduled' && '예정'}
          {series.status === 'started' && '진행중'}
          {series.status === 'completed' && '완료'}
        </span>
      </div>

      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
        {series.description || '설명이 없습니다.'}
      </p>

      <div className="flex items-center justify-between text-xs">
        {series.difficulty && (
          <span className={`px-2 py-1 rounded-full ${getDifficultyColor(series.difficulty)}`}>
            {series.difficulty}
          </span>
        )}
        {series.estimatedDurationMinutes && (
          <span className="text-gray-500">
            ~{series.estimatedDurationMinutes}분
          </span>
        )}
      </div>
    </div>
  );
};