// lib/hooks/useDragScroll.ts
import { useRef, useState, useCallback, useEffect } from 'react';

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
 * - 마우스가 영역 밖으로 나가도 드래그 유지 (document 레벨 이벤트)
 */
export function useDragScroll(options: DragScrollOptions = {}) {
  const { scrollSpeed = 1, dragThreshold = 5 } = options;

  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);

  // useRef로 값 저장 (리렌더링 없이 최신값 유지)
  const dragState = useRef({
    startX: 0,
    scrollLeft: 0,
  });

  // 마우스 다운 - 드래그 시작
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;

    setIsDragging(true);
    setHasDragged(false);

    dragState.current = {
      startX: e.pageX - containerRef.current.offsetLeft,
      scrollLeft: containerRef.current.scrollLeft,
    };
  }, []);

  // 드래그 중일 때 document 레벨 이벤트 등록
  useEffect(() => {
    if (!isDragging) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const x = e.pageX - containerRef.current.offsetLeft;
      const { startX, scrollLeft } = dragState.current;
      const distance = Math.abs(x - startX);

      if (distance > dragThreshold) {
        e.preventDefault();
        setHasDragged(true);
        const walk = (x - startX) * scrollSpeed;
        containerRef.current.scrollLeft = scrollLeft - walk;
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setTimeout(() => setHasDragged(false), 0);
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, scrollSpeed, dragThreshold]);

  return {
    containerRef,
    isDragging,
    hasDragged,
    handlers: {
      onMouseDown: handleMouseDown,
    },
  };
}
