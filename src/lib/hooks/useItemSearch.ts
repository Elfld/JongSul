// lib/hooks/useItemSearch.ts
import { useState, useCallback } from 'react';
import { LostItem } from '@/lib/types/lostItem';
import { ItemService } from '@/lib/services/ItemService';
import { useDebounce } from './useDebounce';

/**
 * 검색어와 필터링 상태를 관리하는 Custom Hook
 * 단일 책임 원칙(SRP)을 적용하여 검색/필터 로직만 담당
 */
export function useItemSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [items, setItems] = useState<LostItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 500);
  const debouncedTags = useDebounce(selectedTags, 300);

  /**
   * 아이템을 검색합니다
   * @param page 페이지 번호
   * @param reset 기존 결과를 초기화할지 여부
   */
  const fetchItems = useCallback(async (page: number, reset: boolean = false) => {
    setLoading(true);
    setError(null);

    try {
      const data = await ItemService.fetchItems({
        search: debouncedSearch,
        tags: debouncedTags,
        page,
        limit: 12,
      });

      setItems(prev => reset ? data.items : [...prev, ...data.items]);
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
   */
  const toggleTag = useCallback((tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
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
