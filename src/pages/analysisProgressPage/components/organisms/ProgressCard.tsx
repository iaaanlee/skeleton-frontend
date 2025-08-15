import React from 'react';
import ProgressBar from '../atoms/ProgressBar';
import StatusDisplay from '../molecules/StatusDisplay';
import StageItem from '../molecules/StageItem';
import { AnalysisStatus, AnalysisStage } from '../../../../types/analysis/analysis';
import { ANALYSIS_STAGES, ANALYSIS_STAGE_TEXT } from '../../../../constants/analysis';

export type ProgressCardProps = {
  status: AnalysisStatus;
  message?: string;
  className?: string;
};

const ProgressCard: React.FC<ProgressCardProps> = ({
  status,
  message,
  className = ''
}) => {
  const getProgressPercentage = (currentStatus: AnalysisStatus): number => {
    switch (currentStatus) {
      case 'pending':
        return 10;
      case 'blazepose_processing':
        return 30;
      case 'blazepose_completed':
        return 60;
      case 'llm_processing':
        return 80;
      case 'llm_completed':
        return 100;
      case 'blazepose_server_failed':
      case 'blazepose_pose_failed':
      case 'failed':
        return 0;
      default:
        return 10;
    }
  };

  const getStatusText = (currentStatus: AnalysisStatus): string => {
    switch (currentStatus) {
      case 'pending':
        return ANALYSIS_STAGE_TEXT.PENDING;
      case 'blazepose_processing':
        return ANALYSIS_STAGE_TEXT.BLAZEPOSE_PROCESSING;
      case 'blazepose_completed':
        return ANALYSIS_STAGE_TEXT.BLAZEPOSE_COMPLETED;
      case 'llm_processing':
        return ANALYSIS_STAGE_TEXT.LLM_PROCESSING;
      case 'llm_completed':
        return ANALYSIS_STAGE_TEXT.LLM_COMPLETED;
      case 'blazepose_server_failed':
        return ANALYSIS_STAGE_TEXT.BLAZEPOSE_FAILED;
      case 'blazepose_pose_failed':
        return '포즈 감지 실패';
      case 'failed':
        return '분석 실패';
      default:
        return '분석 중...';
    }
  };

  const getStatusDescription = (currentStatus: AnalysisStatus): string => {
    if (currentStatus === 'blazepose_server_failed') {
      return '자세 분석 서버 연결에 실패했습니다. 잠시 후 운동 처방 페이지로 돌아갑니다.';
    }
    if (currentStatus === 'blazepose_pose_failed') {
      return '업로드하신 이미지에서 포즈를 감지할 수 없습니다. 다른 이미지로 다시 시도해주세요.';
    }
    return message || '분석이 진행 중입니다. 잠시만 기다려주세요.';
  };

  // 단계별 완료 상태 확인
  const isStageCompleted = (stage: AnalysisStage): boolean => {
    switch (stage) {
      case 'pending':
        return ['blazepose_processing', 'blazepose_completed', 'llm_processing', 'llm_completed'].includes(status);
      case 'blazepose_processing':
        return ['blazepose_completed', 'llm_processing', 'llm_completed'].includes(status);
      case 'blazepose_completed':
        return ['llm_processing', 'llm_completed'].includes(status);
      case 'llm_processing':
        return ['llm_completed'].includes(status);
      case 'llm_completed':
        return status === 'llm_completed';
      default:
        return false;
    }
  };

  // 단계별 활성 상태 확인
  const isStageActive = (stage: AnalysisStage): boolean => {
    return status === stage;
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-8 ${className}`}>
      {/* 진행률 바 */}
      <ProgressBar
        percentage={getProgressPercentage(status)}
        className="mb-8"
      />

      {/* 상태 메시지 */}
      <StatusDisplay
        status={status}
        title={getStatusText(status)}
        description={getStatusDescription(status)}
        className="mb-8"
      />

      {/* 분석 단계 표시 */}
      <div className="space-y-4">
        {ANALYSIS_STAGES.map((stage) => (
          <StageItem
            key={stage}
            stage={stage}
            title={ANALYSIS_STAGE_TEXT[stage.toUpperCase() as keyof typeof ANALYSIS_STAGE_TEXT] || stage}
            isCompleted={isStageCompleted(stage)}
            isActive={isStageActive(stage)}
          />
        ))}
      </div>

      {/* 예상 시간 */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          예상 소요 시간: 약 1-2분
        </p>
      </div>
    </div>
  );
};

export default ProgressCard;