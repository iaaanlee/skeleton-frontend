import React from 'react';
import type { PinState } from '../../../../types/workout';
import { PinSystemHelpers } from '../../../../types/workout';

type Props = {
  pinState: PinState;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
};

/**
 * Pin Indicator Component - Stage 4B
 * Displays visual indicator for Pin System state with 4-tier priority
 */
export const PinIndicator: React.FC<Props> = ({
  pinState,
  size = 'md',
  showLabel = false,
  className = ''
}) => {
  const effectivePin = PinSystemHelpers.getEffectivePinState(pinState);
  const pinIcon = PinSystemHelpers.getPinIcon(pinState);

  if (!effectivePin.activePin || !pinIcon) {
    return null; // No pin state - nothing to show
  }

  // Size configurations
  const sizeConfig = {
    sm: {
      containerClass: 'w-4 h-4',
      textClass: 'text-xs',
      iconSize: '12px'
    },
    md: {
      containerClass: 'w-5 h-5',
      textClass: 'text-sm',
      iconSize: '16px'
    },
    lg: {
      containerClass: 'w-6 h-6',
      textClass: 'text-base',
      iconSize: '20px'
    }
  };

  const config = sizeConfig[size];

  // Pin type labels for display
  const pinLabels = {
    sessionPin: '전체 고정',
    partPin: '파트 고정',
    setPin: '세트 고정',
    exercisePin: '운동 고정'
  };

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {/* Pin Icon */}
      <div
        className={`
          ${config.containerClass}
          flex items-center justify-center
          rounded-full
          ${pinIcon.color}
          ${effectivePin.activePin === 'sessionPin' ? 'animate-pulse' : ''}
        `}
        style={{ fontSize: config.iconSize }}
        title={`${pinLabels[effectivePin.activePin]} - 구조가 보호되어 있습니다`}
      >
        {pinIcon.icon}
      </div>

      {/* Optional Label */}
      {showLabel && (
        <span className={`${config.textClass} ${pinIcon.color} font-medium`}>
          {pinLabels[effectivePin.activePin]}
        </span>
      )}
    </div>
  );
};