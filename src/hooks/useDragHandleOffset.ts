/**
 * useDragHandleOffset Hook
 *
 * DragHandleOffsetContext를 사용하여 드래그 핸들의 offset을 설정하는 hook
 * 드래그 핸들 클릭 시 실제 DOM 위치를 측정하여 마우스와의 상대적 거리를 계산
 */

import { useContext } from 'react';
import { DragHandleOffsetContext } from '../contexts/DndContextProvider';

export const useDragHandleOffset = () => {
  return useContext(DragHandleOffsetContext);
};
