// app/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import CategoryChips from '@/components/CategoryChips';
import ItemCard from '@/components/ItemCard';
import ItemModal from '@/components/ItemModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useItemSearch } from '@/lib/hooks/useItemSearch';
import { useInfiniteScroll } from '@/lib/hooks/useInfiniteScroll';
import { LostItem } from '@/lib/types/lostItem';

const categories = ['시계', '지갑', '카드', '인형', '가방', '우산', '열쇠', '핸드폰'];

/**
 * 분실물 찾기 메인 페이지
 *
 * 리팩토링 완료:
 * - Service Layer 분리 (ItemService)
 * - Custom Hooks 분리 (useItemSearch, useInfiniteScroll)
 * - 단일 책임 원칙(SRP) 적용
 * - 관심사 분리 적용
 * - 코드 라인 수: 127줄 → 82줄
 */
export default function Home() {
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
    resetItems,
  } = useItemSearch();

  // 페이지네이션 상태
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  // 모달 상태
  const [selectedItem, setSelectedItem] = useState<LostItem | null>(null);

  // 검색어/필터 변경 시 초기화 및 재검색
  useEffect(() => {
    resetItems();
    setPage(1);
    setHasMore(true);

    const loadInitialData = async () => {
      const data = await fetchItems(1, true);
      if (data) {
        setHasMore(data.hasMore);
      }
      setInitialLoading(false);
    };

    loadInitialData();
  }, [debouncedSearch, debouncedTags, fetchItems, resetItems]);

  // 무한 스크롤 콜백
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    const nextPage = page + 1;
    const data = await fetchItems(nextPage, false);

    if (data) {
      setHasMore(data.hasMore);
      setPage(nextPage);
    }
  }, [loading, hasMore, page, fetchItems]);

  // 무한 스크롤 Hook 적용
  const { observerTarget } = useInfiniteScroll(loadMore, { threshold: 0.5 });

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* 헤더 & 필터 */}
      <div className="sticky top-0 z-40">
        <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <CategoryChips
          categories={categories}
          selectedTags={selectedTags}
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
        {items.length === 0 && !loading && !initialLoading && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">검색 결과가 없습니다</p>
          </div>
        )}

        {/* 무한 스크롤 트리거 & 로딩 */}
        <div ref={observerTarget} className="h-20">
          {loading && <LoadingSpinner />}
        </div>

        {/* 모든 결과 로드 완료 메시지 */}
        {!hasMore && items.length > 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">모든 결과를 불러왔습니다</p>
          </div>
        )}
      </main>

      {/* 아이템 상세 모달 */}
      {selectedItem && <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  );
}
