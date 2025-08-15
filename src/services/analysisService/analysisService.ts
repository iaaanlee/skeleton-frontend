// Analysis 관련 API service 정의 (레거시 지원 - 새로운 분리된 서비스들을 사용)
import { exerciseAnalysisService } from "../exerciseAnalysisService";
import { analysisJobService } from "../analysisJobService";
import { 
  AnalysisJob, 
  AnalysisStatusInfo, 
  StartAnalysisRequest, 
  StartAnalysisResponse 
} from "../../types/analysis/analysis";

type IAnalysisService = {
  startAnalysis: (request: StartAnalysisRequest) => Promise<StartAnalysisResponse>;
  getAnalysisStatus: (analysisJobId: string) => Promise<AnalysisStatusInfo>;
  getAnalysisJob: (analysisJobId: string) => Promise<AnalysisJob>;
  cancelAnalysis: (analysisJobId: string) => Promise<void>;
};

class AnalysisService implements IAnalysisService { 
  // 분석 시작 (exerciseAnalysisService로 위임)
  async startAnalysis(request: StartAnalysisRequest) {
    return exerciseAnalysisService.startAnalysis(request);
  }

  // 분석 상태 조회 (analysisJobService로 위임)
  async getAnalysisStatus(analysisJobId: string) {
    return analysisJobService.getAnalysisStatus(analysisJobId);
  }

  // 분석 작업 조회 (analysisJobService로 위임)
  async getAnalysisJob(analysisJobId: string) {
    return analysisJobService.getAnalysisJob(analysisJobId);
  }

  // 분석 취소 (analysisJobService로 위임)
  async cancelAnalysis(analysisJobId: string) {
    return analysisJobService.cancelAnalysis(analysisJobId);
  }
}

export const analysisService = new AnalysisService();
