// app/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import CategoryChips from '@/components/CategoryChips';
import ItemCard from '@/components/ItemCard';
import ItemModal from '@/components/ItemModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useItemSearch } from '@/lib/hooks/useItemSearch';
import { useMyReservedIds } from '@/lib/hooks/useMyReservedIds';
import { ItemResponse, TagResponse } from '@/lib/types/lostItem';
import { TagService } from '@/lib/api/tags';

/**
 * 분실물 찾기 메인 페이지
 *
 * OpenAPI 명세 적용:
 * - 태그를 ID 기반으로 관리
 * - /tags/ 엔드포인트로 동적 태그 로드
 * - /items/search 엔드포인트 사용
 * - 무한 스크롤 제거 (서버에서 페이지네이션 미지원)
 */

// useSearchParams()는 Suspense 경계 필요
function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 태그 목록 (API에서 로드)
  const [availableTags, setAvailableTags] = useState<TagResponse[]>([]);
  const [tagsLoading, setTagsLoading] = useState(true);

  // 내 예약 아이템 ID 목록 (훅으로 분리)
  const myReservedIds = useMyReservedIds();

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

  // 모달 상태 - URL 파라미터 기반
  const modalItemId = searchParams.get('modal');
  const selectedItem = modalItemId
    ? items.find((item) => item.id === Number(modalItemId))
    : null;

  // 모달 열기 - URL에 파라미터 추가
  const openModal = (item: ItemResponse) => {
    router.push(`?modal=${item.id}`, { scroll: false });
  };

  // 모달 닫기 - 뒤로가기
  const closeModal = () => {
    router.back();
  };

  // 태그 목록 로드 (컴포넌트 마운트 시 1회)
  useEffect(() => {
    const loadTags = async () => {
      try {
        const tags = await TagService.fetchAllTags();
        setAvailableTags(tags);
      } catch {
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
            <ItemCard
              key={item.id}
              item={item}
              isMyReservation={myReservedIds.includes(item.id)}
              onClick={() => openModal(item)}
            />
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
      {selectedItem && (
        <ItemModal
          item={selectedItem}
          isMyReservation={myReservedIds.includes(selectedItem.id)}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

// Suspense로 감싸서 export
export default function Home() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HomeContent />
    </Suspense>
  );
}
