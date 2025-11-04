// lib/hooks/useItemSearch.ts
import { useState, useCallback } from 'react';
import { ItemResponse } from '@/lib/types/lostItem';
import { ItemService } from '@/lib/services/ItemService';
import { useDebounce } from './useDebounce';

/**
 * 검색어와 필터링 상태를 관리하는 Custom Hook
 * OpenAPI 명세에 맞춰 태그 ID 기반으로 동작
 *
 * 변경사항:
 * - 태그를 string[] → number[] (ID 기반)
 * - 페이지네이션 제거 (서버에서 전체 결과 반환)
 * - searchItems 사용
 */
export function useItemSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<number[]>([]); // 태그 ID 배열
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 500);
  const debouncedTags = useDebounce(selectedTags, 300);

  /**
   * 아이템을 검색합니다
   * 페이지네이션 없이 전체 결과 반환
   */
  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await ItemService.searchItems({
        q: debouncedSearch || undefined,
        tags: debouncedTags.length > 0 ? debouncedTags : undefined,
      });

      setItems(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch items';
      setError(errorMessage);
      console.error(errorMessage, err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, debouncedTags]);

  /**
   * 태그를 토글합니다 (선택/해제)
   * @param tagId 태그 ID
   */
  const toggleTag = useCallback((tagId: number) => {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
    );
  }, []);

  /**
   * 모든 태그 선택을 해제합니다
   */
  const clearAllTags = useCallback(() => {
    setSelectedTags([]);
  }, []);

  /**
   * 검색 결과를 초기화합니다
   */
  const resetItems = useCallback(() => {
    setItems([]);
  }, []);

  return {
    // 상태
    searchQuery,
    selectedTags,
    items,
    loading,
    error,
    debouncedSearch,
    debouncedTags,

    // 액션
    setSearchQuery,
    setItems,
    toggleTag,
    clearAllTags,
    fetchItems,
    resetItems,
  };
}

/**
 * ============================================================
 * LEGACY - 이전 페이지네이션 기반 코드 (참고용)
 * ============================================================
 */

// const [selectedTags, setSelectedTags] = useState<string[]>([]);
// const [items, setItems] = useState<LostItem[]>([]);

// const fetchItems = useCallback(async (page: number, reset: boolean = false) => {
//   setLoading(true);
//   setError(null);
//
//   try {
//     const data = await ItemService.fetchItems({
//       search: debouncedSearch,
//       tags: debouncedTags,
//       page,
//       limit: 12,
//     });
//
//     setItems(prev => reset ? data.items : [...prev, ...data.items]);
//     return data;
//   } catch (err) {
//     const errorMessage = err instanceof Error ? err.message : 'Failed to fetch items';
//     setError(errorMessage);
//     console.error(errorMessage, err);
//     return null;
//   } finally {
//     setLoading(false);
//   }
// }, [debouncedSearch, debouncedTags]);

// const toggleTag = useCallback((tag: string) => {
//   setSelectedTags(prev =>
//     prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
//   );
// }, []);
