// lib/hooks/useDragScroll.ts
import { useRef, useState, useCallback } from 'react';

export interface DragScrollOptions {
  scrollSpeed?: number;
  dragThreshold?: number; // 드래그로 인식할 최소 이동 거리
}

/**
 * 드래그로 스크롤하는 기능을 제공하는 Custom Hook
 * 재사용성을 높이기 위해 로직을 분리
 *
 * 개선사항:
 * - 드래그와 클릭 구분 (dragThreshold)
 * - 텍스트 선택 방지
 * - 버튼 위에서도 드래그 가능
 */
export function useDragScroll(options: DragScrollOptions = {}) {
  const { scrollSpeed = 1, dragThreshold = 5 } = options;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false); // 실제로 드래그했는지
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;

    setIsDragging(true);
    setHasDragged(false); // 드래그 시작 시 초기화
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const x = e.pageX - containerRef.current.offsetLeft;
      const distance = Math.abs(x - startX);

      // dragThreshold 이상 이동하면 실제 드래그로 인식
      if (distance > dragThreshold) {
        e.preventDefault();
        setHasDragged(true);
        const walk = (x - startX) * scrollSpeed;
        containerRef.current.scrollLeft = scrollLeft - walk;
      }
    },
    [isDragging, startX, scrollLeft, scrollSpeed, dragThreshold]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    // hasDragged는 유지 (클릭 핸들러에서 확인용)
    setTimeout(() => setHasDragged(false), 0); // 다음 틱에 초기화
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
    setTimeout(() => setHasDragged(false), 0);
  }, []);

  return {
    containerRef,
    isDragging,
    hasDragged, // 실제 드래그 여부 반환
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave,
    },
  };
}
