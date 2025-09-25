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
    e.stopPropagation();

    if (!effectivePin.canEdit && effectivePin.isProtected) {
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

    onClick?.(e);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!effectivePin.canEdit) {
      return;
    }

    onDoubleClick?.(e);
  };

  return (
    <div
      className={`
        relative
        rounded-lg
        transition-all duration-200
        ${styleClasses}
        ${getCursorStyle()}
        ${className}
      `}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
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
      <div className={effectivePin.isProtected && !effectivePin.canEdit ? 'pointer-events-none' : ''}>
        {children}
      </div>

      {/* Protection Overlay (subtle visual indication) */}
      {effectivePin.isProtected && !effectivePin.canEdit && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-20 rounded-lg pointer-events-none" />
      )}
    </div>
  );
};