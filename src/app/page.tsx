// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CategoryChips from '@/components/CategoryChips';
import ItemCard from '@/components/ItemCard';
import ItemModal from '@/components/ItemModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useItemSearch } from '@/lib/hooks/useItemSearch';
import { ItemResponse, TagResponse } from '@/lib/types/lostItem';
import { TagService } from '@/lib/services/TagService';

/**
 * 분실물 찾기 메인 페이지
 *
 * OpenAPI 명세 적용:
 * - 태그를 ID 기반으로 관리
 * - /tags/ 엔드포인트로 동적 태그 로드
 * - /items/search 엔드포인트 사용
 * - 무한 스크롤 제거 (서버에서 페이지네이션 미지원)
 */
export default function Home() {
  // 태그 목록 (API에서 로드)
  const [availableTags, setAvailableTags] = useState<TagResponse[]>([]);
  const [tagsLoading, setTagsLoading] = useState(true);

  // 검색 & 필터링 상태 관리 (Custom Hook)
  const {
    searchQuery,
    selectedTags,
    items,
    loading,
    debouncedSearch,
    debouncedTags,
    setSearchQuery,
    toggleTag,
    clearAllTags,
    fetchItems,
  } = useItemSearch();

  // 모달 상태
  const [selectedItem, setSelectedItem] = useState<ItemResponse | null>(null);

  // 태그 목록 로드 (컴포넌트 마운트 시 1회)
  useEffect(() => {
    const loadTags = async () => {
      try {
        const tags = await TagService.fetchAllTags();
        setAvailableTags(tags);
      } catch (error) {
        console.error('Failed to load tags:', error);
      } finally {
        setTagsLoading(false);
      }
    };

    loadTags();
  }, []);

  // 검색어/필터 변경 시 재검색
  useEffect(() => {
    if (tagsLoading) return; // 태그 로딩 중에는 검색하지 않음

    fetchItems();
  }, [debouncedSearch, debouncedTags, fetchItems, tagsLoading]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* 헤더 & 필터 */}
      <div className="sticky top-0 z-40">
        <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <CategoryChips
          tags={availableTags}
          selectedTagIds={selectedTags}
          onTagToggle={toggleTag}
          onClearAll={clearAllTags}
        />
      </div>

      {/* 아이템 그리드 */}
      <main className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />
          ))}
        </div>

        {/* 빈 상태 */}
        {items.length === 0 && !loading && !tagsLoading && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">검색 결과가 없습니다</p>
          </div>
        )}

        {/* 로딩 */}
        {loading && (
          <div className="flex justify-center py-20">
            <LoadingSpinner />
          </div>
        )}
      </main>

      {/* 아이템 상세 모달 */}
      {selectedItem && <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  );
}

/**
 * ============================================================
 * LEGACY - 이전 무한 스크롤 코드 (참고용)
 * ============================================================
 */

// import { useInfiniteScroll } from '@/lib/hooks/useInfiniteScroll';
// const categories = ['시계', '지갑', '카드', '인형', '가방', '우산', '열쇠', '핸드폰'];

// const [page, setPage] = useState(1);
// const [hasMore, setHasMore] = useState(true);

// const loadMore = useCallback(async () => {
//   if (loading || !hasMore) return;
//   const nextPage = page + 1;
//   const data = await fetchItems(nextPage, false);
//   if (data) {
//     setHasMore(data.hasMore);
//     setPage(nextPage);
//   }
// }, [loading, hasMore, page, fetchItems]);

// const { observerTarget } = useInfiniteScroll(loadMore, { threshold: 0.5 });

// <div ref={observerTarget} className="h-20">
//   {loading && <LoadingSpinner />}
// </div>
