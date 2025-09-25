// Pin System Types for Stage 4B: DnD + Pin System UI Integration

/**
 * Pin System State Types - 4-tier priority system
 */
export type PinType = 'sessionPin' | 'partPin' | 'setPin' | 'exercisePin';

/**
 * Pin System State for UI Components
 */
export type PinState = {
  sessionPin: boolean;
  partPin: boolean;
  setPin: boolean;
  exercisePin: boolean;
};

/**
 * Effective Pin State - highest priority pin determines UI behavior
 */
export type EffectivePinState = {
  activePin: PinType | null;
  isProtected: boolean;
  canEdit: boolean;
  canDrag: boolean;
  canDelete: boolean;
};

/**
 * Pin UI Configuration for Visual System
 */
export type PinUIConfig = {
  pinType: PinType;
  backgroundColor: string;
  borderColor: string;
  borderWidth: string;
  icon: string;
  iconColor: string;
  opacity: string;
  pulse: boolean;
};

/**
 * Pin Status for Real-time Updates
 */
export type PinStatus = {
  partIndex?: number;
  setIndex?: number;
  exerciseIndex?: number;
  pinState: PinState;
  effectivePinState: EffectivePinState;
  lastModified: Date;
};

/**
 * LocalId System for Pin Areas - PRD SYSTEM 요구사항
 * Pin 영역 내부에서 외부 참조 대신 사용하는 영구 식별자
 */
export type LocalIdSystem = {
  partLocalId?: string;    // 16자리 랜덤 문자열
  setLocalId?: string;     // 16자리 랜덤 문자열
  exerciseLocalId?: string; // 16자리 랜덤 문자열
};

/**
 * Pin Area Blueprint Policy - PRD SYSTEM 정책
 * Pin 영역에서는 모든 BlueprintId가 null이어야 하고 LocalId만 사용
 */
export type PinAreaPolicy = {
  allowBlueprintId: boolean;    // Pin 영역에서는 항상 false
  requireLocalId: boolean;      // Pin 영역에서는 항상 true
  requireOrder: boolean;        // Pin 영역에서는 항상 true
  isSnapshot: boolean;          // 스냅샷 고정 여부
};

/**
 * Pin Change Detection Event
 */
export type PinChangeEvent = {
  type: 'structure_change' | 'spec_change';
  level: 'session' | 'part' | 'set' | 'exercise';
  targetIndex: {
    partIndex?: number;
    setIndex?: number;
    exerciseIndex?: number;
  };
  changeType: 'add' | 'delete' | 'reorder' | 'modify';
  shouldPromotePin: boolean;
  newPinState: Partial<PinState>;
  // Stage 4A 연동을 위한 추가 필드
  triggerSnapshot?: boolean;    // 스냅샷 생성 여부
  targetLocalIds?: LocalIdSystem; // 대상 LocalId 정보
  blueprintPromotionRequired?: boolean; // Blueprint → LocalId 변환 필요
};

/**
 * Pin Visual Styles Constants
 */
export const PIN_VISUAL_STYLES: Record<PinType, PinUIConfig> = {
  sessionPin: {
    pinType: 'sessionPin',
    backgroundColor: 'bg-purple-50',
    borderColor: 'border-purple-300',
    borderWidth: 'border-2',
    icon: '🔒',
    iconColor: 'text-purple-600',
    opacity: 'opacity-95',
    pulse: true
  },
  partPin: {
    pinType: 'partPin',
    backgroundColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    borderWidth: 'border-2',
    icon: '📌',
    iconColor: 'text-blue-600',
    opacity: 'opacity-90',
    pulse: false
  },
  setPin: {
    pinType: 'setPin',
    backgroundColor: 'bg-green-50',
    borderColor: 'border-green-300',
    borderWidth: 'border-2',
    icon: '📍',
    iconColor: 'text-green-600',
    opacity: 'opacity-90',
    pulse: false
  },
  exercisePin: {
    pinType: 'exercisePin',
    backgroundColor: 'bg-yellow-50',
    borderColor: 'border-yellow-300',
    borderWidth: 'border-2',
    icon: '🔐',
    iconColor: 'text-yellow-600',
    opacity: 'opacity-85',
    pulse: false
  }
};

/**
 * Pin Priority Order (higher index = higher priority)
 */
export const PIN_PRIORITY_ORDER: PinType[] = ['exercisePin', 'setPin', 'partPin', 'sessionPin'];

/**
 * Helper Functions for Pin System Logic
 */
export const PinSystemHelpers = {
  /**
   * Get the effective pin state based on 4-tier priority
   */
  getEffectivePinState(pinState: PinState): EffectivePinState {
    // sessionPin has highest priority
    if (pinState.sessionPin) {
      return {
        activePin: 'sessionPin',
        isProtected: true,
        canEdit: false,
        canDrag: false,
        canDelete: false
      };
    }

    // partPin has second priority
    if (pinState.partPin) {
      return {
        activePin: 'partPin',
        isProtected: true,
        canEdit: false,
        canDrag: false,
        canDelete: false
      };
    }

    // setPin has third priority
    if (pinState.setPin) {
      return {
        activePin: 'setPin',
        isProtected: true,
        canEdit: true, // Allow spec editing
        canDrag: false,
        canDelete: false
      };
    }

    // exercisePin has lowest priority
    if (pinState.exercisePin) {
      return {
        activePin: 'exercisePin',
        isProtected: true,
        canEdit: true, // Allow spec editing
        canDrag: false,
        canDelete: false
      };
    }

    // No pin - full editing allowed
    return {
      activePin: null,
      isProtected: false,
      canEdit: true,
      canDrag: true,
      canDelete: true
    };
  },

  /**
   * Get visual style class names for Pin state
   */
  getPinStyleClasses(pinState: PinState): string {
    const effectivePin = this.getEffectivePinState(pinState);

    if (!effectivePin.activePin) {
      return 'bg-white border-gray-200'; // Default style
    }

    const config = PIN_VISUAL_STYLES[effectivePin.activePin];
    const classes = [
      config.backgroundColor,
      config.borderColor,
      config.borderWidth,
      config.opacity
    ];

    if (config.pulse) {
      classes.push('animate-pulse');
    }

    return classes.join(' ');
  },

  /**
   * Get Pin icon and color for display
   */
  getPinIcon(pinState: PinState): { icon: string; color: string } | null {
    const effectivePin = this.getEffectivePinState(pinState);

    if (!effectivePin.activePin) {
      return null;
    }

    const config = PIN_VISUAL_STYLES[effectivePin.activePin];
    return {
      icon: config.icon,
      color: config.iconColor
    };
  },

  /**
   * Should promote to higher pin level based on change type
   */
  shouldPromotePin(changeEvent: PinChangeEvent): boolean {
    switch (changeEvent.type) {
      case 'structure_change':
        return true; // All structure changes require pin promotion
      case 'spec_change':
        return false; // Spec changes only require exercisePin
      default:
        return false;
    }
  },

  /**
   * Calculate new pin state after structure change
   */
  calculatePromotedPinState(changeEvent: PinChangeEvent, currentPinState: PinState): PinState {
    if (!this.shouldPromotePin(changeEvent)) {
      return { ...currentPinState, exercisePin: true }; // Spec changes only
    }

    switch (changeEvent.level) {
      case 'session':
        return {
          sessionPin: true,
          partPin: true,
          setPin: true,
          exercisePin: true
        };
      case 'part':
        return {
          ...currentPinState,
          partPin: true,
          setPin: true,
          exercisePin: true
        };
      case 'set':
        return {
          ...currentPinState,
          setPin: true,
          exercisePin: true
        };
      case 'exercise':
        return {
          ...currentPinState,
          exercisePin: true
        };
      default:
        return currentPinState;
    }
  },

  /**
   * Generate 16-character random LocalId for Pin areas
   */
  generateLocalId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  /**
   * Get Pin Area Policy based on Pin state
   */
  getPinAreaPolicy(pinState: PinState): PinAreaPolicy {
    const effectivePin = this.getEffectivePinState(pinState);

    // Pin 영역에서는 모든 외부 참조 차단
    if (effectivePin.activePin) {
      return {
        allowBlueprintId: false,    // 모든 BlueprintId는 null
        requireLocalId: true,       // LocalId 필수
        requireOrder: true,         // Order 필수
        isSnapshot: true           // 스냅샷 고정 상태
      };
    }

    // 비Pin 영역에서는 BlueprintId 허용
    return {
      allowBlueprintId: true,
      requireLocalId: false,
      requireOrder: false,
      isSnapshot: false
    };
  },

  /**
   * Validate Pin area data structure compliance
   */
  validatePinAreaCompliance(data: any, policy: PinAreaPolicy): boolean {
    if (!policy.isSnapshot) {
      return true; // 비Pin 영역은 검증 불필요
    }

    // Pin 영역 불변식 검증
    if (policy.requireLocalId && !data.localId) {
      console.warn('Pin area missing required localId:', data);
      return false;
    }

    if (!policy.allowBlueprintId && data.blueprintId) {
      console.warn('Pin area contains forbidden blueprintId:', data);
      return false;
    }

    if (policy.requireOrder && typeof data.order !== 'number') {
      console.warn('Pin area missing required order:', data);
      return false;
    }

    return true;
  },

  /**
   * Create enhanced Pin change event for Stage 4A integration
   */
  createPinChangeEvent(
    type: 'structure_change' | 'spec_change',
    level: 'session' | 'part' | 'set' | 'exercise',
    targetIndex: { partIndex?: number; setIndex?: number; exerciseIndex?: number },
    changeType: 'add' | 'delete' | 'reorder' | 'modify'
  ): PinChangeEvent {
    const shouldPromote = this.shouldPromotePin({ type } as PinChangeEvent);

    return {
      type,
      level,
      targetIndex,
      changeType,
      shouldPromotePin: shouldPromote,
      newPinState: {},
      // Stage 4A 연동 필드
      triggerSnapshot: shouldPromote && type === 'structure_change',
      blueprintPromotionRequired: shouldPromote,
      targetLocalIds: {
        partLocalId: level === 'part' || level === 'session' ? this.generateLocalId() : undefined,
        setLocalId: level === 'set' || level === 'part' || level === 'session' ? this.generateLocalId() : undefined,
        exerciseLocalId: this.generateLocalId() // 모든 레벨에서 exercise LocalId 생성
      }
    };
  }
};