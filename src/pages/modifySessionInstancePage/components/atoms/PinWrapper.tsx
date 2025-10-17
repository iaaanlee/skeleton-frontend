import React from 'react';
import { PinIndicator } from './PinIndicator';
import type { PinState } from '../../../../types/workout';
import { PinSystemHelpers } from '../../../../types/workout';

type Props = {
  pinState: PinState;
  children: React.ReactNode;
  showPinIndicator?: boolean;
  pinIndicatorPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
  onClick?: (e?: React.MouseEvent) => void;
  onDoubleClick?: (e?: React.MouseEvent) => void;
};

/**
 * Pin Wrapper Component - Stage 4B
 * Applies Pin System styling and behavior to child components
 */
export const PinWrapper: React.FC<Props> = ({
  pinState,
  children,
  showPinIndicator = true,
  pinIndicatorPosition = 'top-right',
  className = '',
  onClick,
  onDoubleClick
}) => {
  const effectivePin = PinSystemHelpers.getEffectivePinState(pinState);
  const styleClasses = PinSystemHelpers.getPinStyleClasses(pinState);

  // ✅ 디버깅: effectivePin 상태 확인
  const hasPointerEventsNone = effectivePin.isProtected && !effectivePin.canEdit;
  const hasOnClickHandler = !!(onClick || (effectivePin.isProtected && !effectivePin.canEdit));

  React.useEffect(() => {
    console.log('🔷 PinWrapper render:', {
      pinState,
      effectivePin,
      hasPointerEventsNone,
      hasOnClickHandler,
      hasOnClickProp: !!onClick
    });

    if (hasPointerEventsNone) {
      console.warn('⚠️ PinWrapper children에 pointer-events-none 적용됨!', {
        effectivePin,
        pinState
      });
    }
  }, [pinState, effectivePin, hasPointerEventsNone, hasOnClickHandler, onClick]);

  // Position classes for pin indicator
  const indicatorPositionClasses = {
    'top-left': 'top-1 left-1',
    'top-right': 'top-1 right-1',
    'bottom-left': 'bottom-1 left-1',
    'bottom-right': 'bottom-1 right-1'
  };

  // Cursor style based on pin state
  const getCursorStyle = () => {
    if (!effectivePin.canEdit && !effectivePin.canDrag) {
      return 'cursor-not-allowed';
    }
    if (effectivePin.canDrag) {
      return 'cursor-grab hover:cursor-grabbing';
    }
    if (effectivePin.canEdit) {
      return 'cursor-pointer';
    }
    return 'cursor-default';
  };

  // Handle click events based on pin state
  const handleClick = (e: React.MouseEvent) => {
    console.log('🔷 PinWrapper handleClick 실행, onClick prop:', !!onClick, 'isProtected:', effectivePin.isProtected);

    // ✅ 보호된 상태일 때만 stopPropagation (클릭 활성화 허용)
    if (!effectivePin.canEdit && effectivePin.isProtected) {
      e.stopPropagation();

      // Show protection warning
      const pinType = effectivePin.activePin;
      const messages = {
        sessionPin: '전체 세션이 고정되어 편집할 수 없습니다.',
        partPin: '이 파트가 고정되어 편집할 수 없습니다.',
        setPin: '이 세트 구조가 고정되어 있습니다. 운동 내용만 편집할 수 있습니다.',
        exercisePin: '이 운동이 개별 수정된 상태입니다.'
      };

      if (pinType && messages[pinType]) {
        alert(messages[pinType]);
      }
      return;
    }

    // ✅ onClick prop이 있으면 호출하고 전파 차단
    if (onClick) {
      console.log('🔷 PinWrapper onClick prop 호출');
      e.stopPropagation();
      onClick(e);
      return;
    }

    // ✅ onClick prop이 없으면 이벤트 전파 허용 - 하지만 React에서는 명시적으로 허용해야 함!
    console.log('🔷 PinWrapper onClick prop 없음, 이벤트 전파되어야 함');
    // 아무것도 하지 않음 = 이벤트 계속 버블링
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    // ✅ 편집 불가능한 상태일 때만 stopPropagation
    if (!effectivePin.canEdit) {
      e.stopPropagation();
      return;
    }

    // ✅ onDoubleClick prop이 있으면 호출하고 전파 차단
    if (onDoubleClick) {
      e.stopPropagation();
      onDoubleClick(e);
    }

    // ✅ onDoubleClick prop이 없으면 이벤트 전파 허용
  };

  // ✅ onClick/onDoubleClick이 필요한 경우에만 추가
  const needsClickHandler = onClick || (effectivePin.isProtected && !effectivePin.canEdit);
  const needsDoubleClickHandler = onDoubleClick || !effectivePin.canEdit;

  return (
    <div
      className={`
        relative
        rounded-lg
        transition-all duration-200
        ${styleClasses}
        ${getCursorStyle()}
        ${className}
        !bg-transparent
      `}
      {...(needsClickHandler && { onClick: handleClick })}
      {...(needsDoubleClickHandler && { onDoubleClick: handleDoubleClick })}
    >
      {/* Pin Indicator */}
      {showPinIndicator && effectivePin.activePin && (
        <div className={`absolute ${indicatorPositionClasses[pinIndicatorPosition]} z-10`}>
          <PinIndicator
            pinState={pinState}
            size="sm"
          />
        </div>
      )}

      {/* Content */}
      <div className={(() => {
        const className = effectivePin.isProtected && !effectivePin.canEdit ? 'pointer-events-none' : '';
        if (className) {
          console.warn('⚠️⚠️⚠️ PinWrapper children div에 pointer-events-none 적용 중!', {
            effectivePin,
            pinState
          });
        }
        return className;
      })()}>
        {children}
      </div>

      {/* Protection Overlay (subtle visual indication) */}
      {effectivePin.isProtected && !effectivePin.canEdit && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-20 rounded-lg pointer-events-none" />
      )}
    </div>
  );
};