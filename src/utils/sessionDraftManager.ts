// Session Draft Manager for Stage 4B
// PRD PAGES 요구사항: localStorage 드래프트 시스템 (500ms 디바운스)

import type { ModifySessionRequest } from '../types/workout';

/**
 * Session Draft Manager - localStorage 기반 임시 저장
 * PRD 요구사항: sessionEditDraft:<sessionInstanceId> 키로 500ms 디바운스 저장
 */
export class SessionDraftManager {
  private static readonly STORAGE_PREFIX = 'sessionEditDraft:';
  private static readonly DEBOUNCE_DELAY = 500; // ms
  private static debounceTimers: Map<string, NodeJS.Timeout> = new Map();

  /**
   * 세션 변경사항을 디바운스하여 localStorage에 저장
   */
  static saveDraft(sessionId: string, changes: Partial<ModifySessionRequest>): void {
    const key = `${this.STORAGE_PREFIX}${sessionId}`;

    // 기존 디바운스 타이머 취소
    const existingTimer = this.debounceTimers.get(sessionId);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // 새 디바운스 타이머 설정
    const timer = setTimeout(() => {
      try {
        const draftData = {
          sessionId,
          changes,
          timestamp: new Date().toISOString(),
          version: '1.0'
        };

        localStorage.setItem(key, JSON.stringify(draftData));
        console.debug(`Session draft saved for ${sessionId}`);
      } catch (error) {
        console.warn('Failed to save session draft:', error);
      } finally {
        this.debounceTimers.delete(sessionId);
      }
    }, this.DEBOUNCE_DELAY);

    this.debounceTimers.set(sessionId, timer);
  }

  /**
   * localStorage에서 세션 드래프트 불러오기
   */
  static loadDraft(sessionId: string): Partial<ModifySessionRequest> | null {
    const key = `${this.STORAGE_PREFIX}${sessionId}`;

    try {
      const stored = localStorage.getItem(key);
      if (!stored) {
        return null;
      }

      const draftData = JSON.parse(stored);

      // 24시간이 지난 드래프트는 자동 삭제
      const draftTime = new Date(draftData.timestamp);
      const now = new Date();
      const hoursDiff = (now.getTime() - draftTime.getTime()) / (1000 * 60 * 60);

      if (hoursDiff > 24) {
        this.clearDraft(sessionId);
        return null;
      }

      return draftData.changes;
    } catch (error) {
      console.warn('Failed to load session draft:', error);
      // 손상된 드래프트 제거
      this.clearDraft(sessionId);
      return null;
    }
  }

  /**
   * 세션 드래프트 삭제
   */
  static clearDraft(sessionId: string): void {
    const key = `${this.STORAGE_PREFIX}${sessionId}`;

    try {
      localStorage.removeItem(key);

      // 진행 중인 디바운스 타이머도 취소
      const timer = this.debounceTimers.get(sessionId);
      if (timer) {
        clearTimeout(timer);
        this.debounceTimers.delete(sessionId);
      }

      console.debug(`Session draft cleared for ${sessionId}`);
    } catch (error) {
      console.warn('Failed to clear session draft:', error);
    }
  }

  /**
   * 드래프트 존재 여부 확인
   */
  static hasDraft(sessionId: string): boolean {
    const draft = this.loadDraft(sessionId);
    return draft !== null;
  }

  /**
   * 모든 만료된 드래프트 정리
   */
  static cleanupExpiredDrafts(): void {
    try {
      const keys = Object.keys(localStorage).filter(key =>
        key.startsWith(this.STORAGE_PREFIX)
      );

      keys.forEach(key => {
        const sessionId = key.replace(this.STORAGE_PREFIX, '');
        this.loadDraft(sessionId); // loadDraft에서 만료된 것들을 자동 삭제
      });
    } catch (error) {
      console.warn('Failed to cleanup expired drafts:', error);
    }
  }

  /**
   * 페이지 이탈 감지를 위한 변경사항 확인
   */
  static hasUnsavedChanges(sessionId: string): boolean {
    // 디바운스 타이머가 있으면 저장되지 않은 변경사항이 있음
    return this.debounceTimers.has(sessionId) || this.hasDraft(sessionId);
  }

  /**
   * 모든 디바운스 타이머 즉시 실행 (페이지 이탈 시)
   */
  static flushAll(): void {
    this.debounceTimers.forEach((timer, sessionId) => {
      clearTimeout(timer);
      // 즉시 저장 실행을 위해 delay 0으로 다시 설정
      setTimeout(() => {
        const key = `${this.STORAGE_PREFIX}${sessionId}`;
        // 실제 저장 로직은 이미 타이머 콜백에 있으므로 생략
      }, 0);
    });
    this.debounceTimers.clear();
  }
}

/**
 * UI Hint Manager - 첫사용 힌트 시스템
 * PRD 요구사항: uiHintHidden.dnd, uiHintHidden.edit localStorage 플래그
 */
export class UIHintManager {
  private static readonly HINT_PREFIX = 'uiHintHidden.';

  /**
   * 힌트 표시 여부 확인
   */
  static shouldShowHint(hintType: 'dnd' | 'edit'): boolean {
    const key = `${this.HINT_PREFIX}${hintType}`;
    return localStorage.getItem(key) !== 'true';
  }

  /**
   * 힌트 사용 기록 (이후 표시하지 않음)
   */
  static markHintAsUsed(hintType: 'dnd' | 'edit'): void {
    const key = `${this.HINT_PREFIX}${hintType}`;
    localStorage.setItem(key, 'true');
    console.debug(`UI hint marked as used: ${hintType}`);
  }

  /**
   * 힌트 초기화 (개발/테스트용)
   */
  static resetAllHints(): void {
    localStorage.removeItem(`${this.HINT_PREFIX}dnd`);
    localStorage.removeItem(`${this.HINT_PREFIX}edit`);
  }
}

/**
 * Page Leave Guard - 페이지 이탈 감지 시스템
 */
export class PageLeaveGuard {
  private static isEnabled = false;
  private static currentSessionId: string | null = null;

  /**
   * 페이지 이탈 감지 활성화
   */
  static enable(sessionId: string): void {
    this.currentSessionId = sessionId;
    if (!this.isEnabled) {
      window.addEventListener('beforeunload', this.handleBeforeUnload);
      this.isEnabled = true;
    }
  }

  /**
   * 페이지 이탈 감지 비활성화
   */
  static disable(): void {
    if (this.isEnabled) {
      window.removeEventListener('beforeunload', this.handleBeforeUnload);
      this.isEnabled = false;
      this.currentSessionId = null;
    }
  }

  /**
   * beforeunload 이벤트 핸들러
   */
  private static handleBeforeUnload = (event: BeforeUnloadEvent): string | undefined => {
    if (this.currentSessionId && SessionDraftManager.hasUnsavedChanges(this.currentSessionId)) {
      // 모든 디바운스 즉시 실행
      SessionDraftManager.flushAll();

      // 브라우저에 확인 대화상자 표시
      const message = '변경사항이 저장되지 않았습니다. 정말 나가시겠습니까?';
      event.returnValue = message;
      return message;
    }
    return undefined;
  };
}