# 🎨 Frontend 상태 관리 시스템 마이그레이션 가이드

## 📋 개요

더 직관적이고 사용자 친화적인 분석 상태 관리 시스템으로 업그레이드합니다.

---

## 🔄 **주요 변경 사항**

### **1. 상태 타입 통일**
```typescript
// ❌ 기존: 여러 타입이 혼재
type AnalysisStatus = 'pending' | 'blazepose_processing' | ...
type PrescriptionStatus = 'processing' | 'completed' | 'failed'

// ✅ 신규: 통합 타입 사용
import { UnifiedAnalysisStatus } from './types/analysis/unified-status'
```

### **2. 상태 체크 로직 개선**
```typescript
// ❌ 기존: 복잡한 배열 체크
const completedStatuses = ['llm_completed'];
const failedStatuses = ['blazepose_server_failed', 'blazepose_pose_failed', ...];

// ✅ 신규: 직관적인 헬퍼 사용
import { isCompletedStatus, isFailedStatus } from './utils/status-migration'
```

---

## 🛠 **컴포넌트별 마이그레이션**

### **1. Progress Utils 업데이트**

```typescript
// pages/analysisProgressPage/utils/progressUtils.ts

// ❌ 기존 방식
export const getProgressPercentage = (currentStatus: AnalysisStatus): number => {
  switch (currentStatus) {
    case 'pending': return 10;
    case 'blazepose_processing': return 30;
    case 'blazepose_completed': return 60;
    case 'llm_processing': return 80;
    case 'llm_completed': return 100;
    // ... 복잡한 실패 상태 처리
  }
};

// ✅ 새로운 방식
import { calculateProgress, getStatusDisplayProps } from '../../../utils/status-migration';

export const getProgressPercentage = (currentStatus: string): number => {
  return calculateProgress(currentStatus);
};

export const getStatusDisplayInfo = (currentStatus: string, message?: string) => {
  return getStatusDisplayProps(currentStatus, message);
};
```

### **2. Navigation Hook 업데이트**

```typescript
// hooks/useAnalysisNavigation.ts

// ❌ 기존 방식
export const useAnalysisNavigation = (status: AnalysisStatus) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (status === 'llm_completed') {
      // 처방 기록으로 이동
    } else if (status === 'blazepose_server_failed') {
      // create-prescription으로 이동
    } else if (status === 'blazepose_pose_failed') {
      // create-prescription으로 이동
    }
    // ... 복잡한 분기 처리
  }, [status, navigate]);
};

// ✅ 새로운 방식
import { getNavigationAction } from '../utils/status-migration';

export const useAnalysisNavigation = (status: string) => {
  const navigate = useNavigate();

  useEffect(() => {
    const action = getNavigationAction(status);
    
    if (action) {
      const timer = setTimeout(() => {
        navigate(action.navigate === 'prescription-history' ? 
          ROUTES.PRESCRIPTION_HISTORY : 
          ROUTES.CREATE_PRESCRIPTION
        );
      }, action.delay);
      
      return () => clearTimeout(timer);
    }
  }, [status, navigate]);
};
```

### **3. Status Display 컴포넌트**

```tsx
// components/molecules/StatusDisplay.tsx

// ❌ 기존 방식
interface StatusDisplayProps {
  status: AnalysisStatus;
  message?: string;
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({ status, message }) => {
  const getVariant = () => {
    switch (status) {
      case 'llm_completed': return 'success';
      case 'blazepose_server_failed':
      case 'blazepose_pose_failed':
      case 'llm_server_failed':
      case 'llm_api_failed':
      case 'llm_failed':
      case 'failed': return 'error';
      default: return 'info';
    }
  };

  return (
    <div className={`status-${getVariant()}`}>
      {getStatusText(status)}
    </div>
  );
};

// ✅ 새로운 방식
import { getStatusDisplayProps, getStatusIcon } from '../../utils/status-migration';

interface StatusDisplayProps {
  status: string;
  message?: string;
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({ status, message }) => {
  const displayProps = getStatusDisplayProps(status, message);
  const icon = getStatusIcon(status);

  return (
    <div className={`status-${displayProps.variant}`}>
      <span className="status-icon">{icon}</span>
      <div>
        <div className="status-text">{displayProps.text}</div>
        {displayProps.description && (
          <div className="status-description">{displayProps.description}</div>
        )}
        {displayProps.showRetry && (
          <button className="retry-button">
            {displayProps.retryText}
          </button>
        )}
      </div>
    </div>
  );
};
```

### **4. Create Prescription 페이지**

```tsx
// pages/createPrescriptionPage/components/AnalysisButton.tsx

// ❌ 기존 방식
const AnalysisButton = ({ analysisJob, prescription, onStart }) => {
  const canStart = () => {
    if (!analysisJob) return true;
    
    const failedStatuses = [
      'blazepose_server_failed', 'blazepose_pose_failed',
      'llm_server_failed', 'llm_api_failed', 'llm_failed', 'failed'
    ];
    
    return failedStatuses.includes(analysisJob.status);
  };
  
  const getButtonText = () => {
    if (!analysisJob) return '분석 시작';
    
    if (analysisJob.status === 'llm_completed') {
      return '분석 완료';
    } else if (['llm_server_failed', 'llm_api_failed', 'llm_failed'].includes(analysisJob.status)) {
      return '처방 생성 재시작';
    } else {
      return '분석 재시작';
    }
  };

  return (
    <button disabled={!canStart()} onClick={onStart}>
      {getButtonText()}
    </button>
  );
};

// ✅ 새로운 방식
import { getAnalysisStartInfo } from '../../../utils/status-migration';

const AnalysisButton = ({ analysisJob, prescription, onStart }) => {
  const startInfo = getAnalysisStartInfo(
    analysisJob?.status, 
    prescription?.status
  );

  return (
    <div>
      {startInfo.showWarning && (
        <div className="warning-message">
          ⚠️ {startInfo.warningMessage}
        </div>
      )}
      
      <button 
        disabled={!startInfo.canStart} 
        onClick={() => onStart(startInfo.restartFrom)}
      >
        {startInfo.buttonText}
      </button>
      
      <div className="status-message">
        {startInfo.statusMessage}
      </div>
    </div>
  );
};
```

### **5. Prescription History 페이지**

```tsx
// pages/prescriptionHistoryPage/components/PrescriptionCard.tsx

// ❌ 기존 방식
const PrescriptionCard = ({ prescription }) => {
  const getStatusBadge = () => {
    switch (prescription.status) {
      case 'completed': return <Badge variant="success">완료</Badge>;
      case 'failed': return <Badge variant="error">실패</Badge>;
      case 'processing': return <Badge variant="info">진행 중</Badge>;
      default: return <Badge variant="gray">알 수 없음</Badge>;
    }
  };

  return (
    <div className="prescription-card">
      {getStatusBadge()}
      {/* ... */}
    </div>
  );
};

// ✅ 새로운 방식
import { getPrescriptionDisplayStatus, getStatusDisplayProps } from '../../../utils/status-migration';

const PrescriptionCard = ({ prescription }) => {
  const displayStatus = getPrescriptionDisplayStatus(prescription.analysisJob?.status);
  const statusProps = getStatusDisplayProps(prescription.analysisJob?.status);

  return (
    <div className="prescription-card">
      <Badge variant={statusProps.variant}>
        {statusProps.text}
      </Badge>
      
      {statusProps.showRetry && (
        <button className="retry-button">
          {statusProps.retryText}
        </button>
      )}
      
      {/* ... */}
    </div>
  );
};
```

---

## 📱 **모바일 대응**

### **1. 알림 시스템**

```typescript
// utils/notifications.ts

import { getNotificationMessage } from './status-migration';

export const showAnalysisNotification = (status: string) => {
  const notification = getNotificationMessage(status);
  
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(notification.title, {
      body: notification.message,
      icon: `/icons/${notification.type}.png`
    });
  }
};
```

### **2. 상태별 진동 패턴**

```typescript
// utils/haptics.ts

import { isCompletedStatus, isFailedStatus } from './status-migration';

export const vibrate = (status: string) => {
  if (!navigator.vibrate) return;
  
  if (isCompletedStatus(status)) {
    navigator.vibrate([100, 50, 100]); // 성공 패턴
  } else if (isFailedStatus(status)) {
    navigator.vibrate([200, 100, 200, 100, 200]); // 실패 패턴
  }
};
```

---

## 🧪 **테스트 업데이트**

### **1. 컴포넌트 테스트**

```typescript
// __tests__/StatusDisplay.test.tsx

import { render } from '@testing-library/react';
import StatusDisplay from '../components/StatusDisplay';

describe('StatusDisplay', () => {
  it('완료 상태를 올바르게 표시한다', () => {
    const { getByText } = render(
      <StatusDisplay status="llm_completed" />
    );
    
    expect(getByText('분석이 완료되었습니다')).toBeInTheDocument();
  });
  
  it('실패 상태에서 재시도 버튼을 표시한다', () => {
    const { getByText } = render(
      <StatusDisplay status="pose_detection_failed" />
    );
    
    expect(getByText('다른 이미지로 재시도')).toBeInTheDocument();
  });
});
```

### **2. Hook 테스트**

```typescript
// __tests__/useAnalysisNavigation.test.tsx

import { renderHook } from '@testing-library/react-hooks';
import { useAnalysisNavigation } from '../hooks/useAnalysisNavigation';

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn()
}));

describe('useAnalysisNavigation', () => {
  it('완료 시 prescription-history로 이동한다', () => {
    const navigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigate);
    
    renderHook(() => useAnalysisNavigation('llm_completed'));
    
    setTimeout(() => {
      expect(navigate).toHaveBeenCalledWith('/prescription-history');
    }, 2100);
  });
});
```

---

## 🎯 **성능 최적화**

### **1. 메모이제이션**

```typescript
// hooks/useAnalysisStatus.ts

import { useMemo } from 'react';
import { getStatusDisplayProps } from '../utils/status-migration';

export const useAnalysisStatus = (status: string, message?: string) => {
  return useMemo(() => {
    return getStatusDisplayProps(status, message);
  }, [status, message]);
};
```

### **2. 조건부 렌더링 최적화**

```tsx
// components/AnalysisProgress.tsx

import { memo } from 'react';
import { isCompletedStatus, isFailedStatus } from '../utils/status-migration';

const AnalysisProgress = memo(({ status }: { status: string }) => {
  // 상태가 변경되지 않으면 리렌더링하지 않음
  if (isCompletedStatus(status)) {
    return <CompletedState />;
  } else if (isFailedStatus(status)) {
    return <FailedState />;
  } else {
    return <ProcessingState />;
  }
});
```

---

## 📋 **체크리스트**

### **마이그레이션 완료 확인**

- [ ] `utils/status-migration.ts` 파일 추가
- [ ] `types/analysis/unified-status.ts` 파일 추가
- [ ] Progress utils 업데이트
- [ ] Navigation hook 업데이트
- [ ] Status display 컴포넌트 업데이트
- [ ] Create prescription 페이지 업데이트
- [ ] Prescription history 페이지 업데이트
- [ ] 테스트 케이스 업데이트
- [ ] 타입스크립트 에러 해결
- [ ] 빌드 성공 확인

### **동작 테스트**

- [ ] 분석 시작 버튼 정상 작동
- [ ] 상태별 진행률 표시 정확성
- [ ] 실패 시 적절한 재시작 지점 제공
- [ ] 네비게이션 로직 정상 작동
- [ ] 알림 메시지 정확성

---

## 🎉 **마이그레이션 완료!**

새로운 상태 관리 시스템으로 더 안정적이고 사용자 친화적인 분석 경험을 제공할 수 있습니다.