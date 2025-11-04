// components/CategoryChips.tsx
'use client';

import { X } from 'lucide-react';
import { useDragScroll } from '@/lib/hooks/useDragScroll';
import { TagResponse } from '@/lib/types/lostItem';

interface CategoryChipsProps {
  tags: TagResponse[];          // API에서 로드한 태그 목록
  selectedTagIds: number[];     // 선택된 태그 ID 배열
  onTagToggle: (tagId: number) => void;  // 태그 ID로 토글
  onClearAll: () => void;
}

/**
 * 카테고리 필터 칩 컴포넌트
 *
 * OpenAPI 명세 적용:
 * - 태그를 ID 기반으로 관리
 * - /tags/ API에서 동적으로 로드
 * - 드래그 스크롤 유지
 */
export default function CategoryChips({
  tags,
  selectedTagIds,
  onTagToggle,
  onClearAll,
}: CategoryChipsProps) {
  // 드래그 스크롤 Hook 적용
  const { containerRef, isDragging, hasDragged, handlers } = useDragScroll();

  return (
    <div className="bg-white border-b border-sky-100 px-6 py-4">
      <div
        ref={containerRef}
        className={`flex gap-3 overflow-x-auto scrollbar-hide select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        {...handlers}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* 전체 해제 버튼 */}
        <button
          onClick={(e) => {
            // 드래그 중이었다면 클릭 무시
            if (hasDragged) {
              e.preventDefault();
              return;
            }
            onClearAll();
          }}
          disabled={selectedTagIds.length === 0}
          className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            selectedTagIds.length > 0
              ? 'bg-red-500 text-white hover:bg-red-600 cursor-pointer'
              : 'bg-gray-200 text-gray-600 opacity-50'
          }`}
        >
          <X className="w-4 h-4" />
        </button>

        {/* 태그 버튼들 (동적 로드) */}
        {tags.map((tag) => (
          <button
            key={tag.id}
            onClick={(e) => {
              // 드래그 중이었다면 클릭 무시
              if (hasDragged) {
                e.preventDefault();
                return;
              }
              onTagToggle(tag.id);
            }}
            className={`flex-shrink-0 px-5 py-2 rounded-full transition-all ${
              selectedTagIds.includes(tag.id)
                ? 'bg-sky-600 text-white hover:bg-sky-700'
                : 'bg-sky-100 text-sky-700 hover:bg-sky-200'
            }`}
          >
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * ============================================================
 * LEGACY - 이전 문자열 기반 태그 코드 (참고용)
 * ============================================================
 */

// interface CategoryChipsProps {
//   categories: string[];
//   selectedTags: string[];
//   onTagToggle: (tag: string) => void;
//   onClearAll: () => void;
// }

// {categories.map((tag) => (
//   <button
//     key={tag}
//     onClick={(e) => {
//       if (hasDragged) {
//         e.preventDefault();
//         return;
//       }
//       onTagToggle(tag);
//     }}
//     className={`flex-shrink-0 px-5 py-2 rounded-full transition-all ${
//       selectedTags.includes(tag)
//         ? 'bg-sky-600 text-white hover:bg-sky-700'
//         : 'bg-sky-100 text-sky-700 hover:bg-sky-200'
//     }`}
//   >
//     {tag}
//   </button>
// ))}
