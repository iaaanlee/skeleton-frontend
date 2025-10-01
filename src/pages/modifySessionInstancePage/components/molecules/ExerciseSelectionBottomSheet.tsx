import React, { useState } from 'react';
import { useSearchExercises, useExerciseCategories, useRecentExercises } from '../../../../services/workoutService/sessionModificationService';
import { useProfile } from '../../../../contexts/ProfileContext';
import type { ExerciseTemplate, ExerciseSearchParams } from '../../../../types/workout';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: ExerciseTemplate) => void;
};

export const ExerciseSelectionBottomSheet: React.FC<Props> = ({ isOpen, onClose, onSelectExercise }) => {
  const { currentProfile } = useProfile();
  const [activeTab, setActiveTab] = useState<'search' | 'recent' | 'categories'>('recent');
  const [searchParams, setSearchParams] = useState<ExerciseSearchParams>({
    q: '',
    limit: 20,
    offset: 0
  });

  const { data: searchResults, isLoading: isSearching } = useSearchExercises(searchParams);
  const { data: categories } = useExerciseCategories();
  const { data: recentExercises } = useRecentExercises(currentProfile?.profileId || '');

  const handleSearchChange = (query: string) => {
    setSearchParams(prev => ({
      ...prev,
      q: query,
      offset: 0
    }));
    if (query.trim()) {
      setActiveTab('search');
    }
  };

  const handleCategoryFilter = (category: string) => {
    setSearchParams(prev => ({
      ...prev,
      category: prev.category === category ? undefined : category,
      offset: 0
    }));
    setActiveTab('search');
  };

  const handleExerciseSelect = (exercise: ExerciseTemplate) => {
    onSelectExercise(exercise);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[8000] flex items-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="relative w-full max-h-[80vh] bg-white rounded-t-xl overflow-hidden">
        {/* Handle */}
        <div className="flex justify-center py-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">운동 선택</h2>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="운동명으로 검색..."
              value={searchParams.q || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Tabs */}
          <div className="flex mt-4 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('recent')}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'recent'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              최근 사용
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'categories'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              카테고리
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'search'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              검색 결과
            </button>
          </div>
        </div>

        {/* Categories Filter (when categories tab is active) */}
        {activeTab === 'categories' && categories && (
          <div className="px-4 pb-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => handleCategoryFilter(category.name)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                    searchParams.category === category.name
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-6">
          {activeTab === 'recent' && (
            <div className="space-y-2">
              {/* 테스트용 기본 운동 목록 추가 */}
              {(!recentExercises?.exercises || recentExercises.exercises.length === 0) && !isSearching ? (
                <>
                  <ExerciseCard
                    exercise={{
                      _id: 'push-up',
                      exerciseName: '푸시업',
                      description: '가슴, 어깨, 삼두근을 단련하는 운동',
                      category: '가슴',
                      difficulty: 'beginner',
                      targetMuscles: ['가슴', '어깨', '삼두근'],
                      equipment: [],
                      isActive: true,
                      createdAt: '2024-01-01T00:00:00.000Z',
                      updatedAt: '2024-01-01T00:00:00.000Z'
                    }}
                    onSelect={handleExerciseSelect}
                  />
                  <ExerciseCard
                    exercise={{
                      _id: 'squat',
                      exerciseName: '스쿼트',
                      description: '하체 전체를 단련하는 기본 운동',
                      category: '하체',
                      difficulty: 'beginner',
                      targetMuscles: ['대퇴사두근', '대둔근'],
                      equipment: [],
                      isActive: true,
                      createdAt: '2024-01-01T00:00:00.000Z',
                      updatedAt: '2024-01-01T00:00:00.000Z'
                    }}
                    onSelect={handleExerciseSelect}
                  />
                  <ExerciseCard
                    exercise={{
                      _id: 'pull-up',
                      exerciseName: '풀업',
                      description: '등과 팔 근육을 단련하는 운동',
                      category: '등',
                      difficulty: 'intermediate',
                      targetMuscles: ['광배근', '이두근'],
                      equipment: ['풀업바'],
                      isActive: true,
                      createdAt: '2024-01-01T00:00:00.000Z',
                      updatedAt: '2024-01-01T00:00:00.000Z'
                    }}
                    onSelect={handleExerciseSelect}
                  />
                </>
              ) : (
                recentExercises?.exercises.map((exercise) => (
                  <ExerciseCard
                    key={exercise._id}
                    exercise={exercise}
                    onSelect={handleExerciseSelect}
                  />
                ))
              )}
              {(!recentExercises?.exercises || recentExercises.exercises.length === 0) && isSearching && (
                <div className="text-center py-8 text-gray-500">
                  <p>최근 사용한 운동을 불러오는 중...</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="text-center py-8 text-gray-500">
              <p>카테고리를 선택하여 운동을 검색하세요.</p>
            </div>
          )}

          {activeTab === 'search' && (
            <div className="space-y-2">
              {isSearching ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-gray-100 rounded-lg p-4 h-20" />
                  ))}
                </div>
              ) : searchResults?.exercises && searchResults.exercises.length > 0 ? (
                searchResults.exercises.map((exercise) => (
                  <ExerciseCard
                    key={exercise._id}
                    exercise={exercise}
                    onSelect={handleExerciseSelect}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>
                    {searchParams.q ? '검색 결과가 없습니다.' : '검색어를 입력하세요.'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Exercise Card Component
const ExerciseCard: React.FC<{
  exercise: ExerciseTemplate;
  onSelect: (exercise: ExerciseTemplate) => void;
}> = ({ exercise, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(exercise)}
      className="w-full text-left bg-white border rounded-lg p-4 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 mb-1">{exercise.exerciseName}</h3>
          {exercise.description && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{exercise.description}</p>
          )}

          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span className="px-2 py-1 bg-gray-100 rounded">{exercise.category}</span>
            <span className="px-2 py-1 bg-gray-100 rounded capitalize">{exercise.difficulty}</span>
            {exercise.equipment && exercise.equipment.length > 0 && (
              <span className="px-2 py-1 bg-gray-100 rounded">{exercise.equipment[0]}</span>
            )}
          </div>

          {exercise.targetMuscles && exercise.targetMuscles.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-gray-500">
                주요 근육: {exercise.targetMuscles.join(', ')}
              </p>
            </div>
          )}
        </div>

        <div className="ml-4">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
      </div>
    </button>
  );
};