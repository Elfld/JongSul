// lib/hooks/useInfiniteScroll.ts
import { useEffect, useRef, useState } from 'react';

export interface InfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
}

/**
 * 무한 스크롤 기능을 제공하는 Custom Hook
 * 개방-폐쇄 원칙(OCP)을 적용하여 재사용 가능하고 확장 가능하게 구현
 */
export function useInfiniteScroll(
  onLoadMore: () => void | Promise<void>,
  options: InfiniteScrollOptions = {}
) {
  const { threshold = 0.5, rootMargin = '0px' } = options;
  const observerTarget = useRef<HTMLDivElement>(null);
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    if (!isEnabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { threshold, rootMargin }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
      observer.disconnect();
    };
  }, [onLoadMore, threshold, rootMargin, isEnabled]);

  /**
   * 무한 스크롤을 일시적으로 비활성화합니다
   */
  const disable = () => setIsEnabled(false);

  /**
   * 무한 스크롤을 활성화합니다
   */
  const enable = () => setIsEnabled(true);

  return {
    observerTarget,
    disable,
    enable,
    isEnabled,
  };
}
