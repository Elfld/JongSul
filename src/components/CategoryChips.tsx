// components/CategoryChips.tsx
'use client';

import { X } from 'lucide-react';
import { useDragScroll } from '@/lib/hooks/useDragScroll';

interface CategoryChipsProps {
  categories: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClearAll: () => void;
}

/**
 * 카테고리 필터 칩 컴포넌트
 *
 * 리팩토링 완료:
 * - 드래그 스크롤 로직을 useDragScroll Hook으로 분리
 * - 재사용성 향상
 * - 코드 라인 수: 83줄 → 60줄
 */
export default function CategoryChips({
  categories,
  selectedTags,
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
          disabled={selectedTags.length === 0}
          className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            selectedTags.length > 0
              ? 'bg-red-500 text-white hover:bg-red-600 cursor-pointer'
              : 'bg-gray-200 text-gray-600 opacity-50'
          }`}
        >
          <X className="w-4 h-4" />
        </button>

        {/* 카테고리 버튼들 */}
        {categories.map((tag) => (
          <button
            key={tag}
            onClick={(e) => {
              // 드래그 중이었다면 클릭 무시
              if (hasDragged) {
                e.preventDefault();
                return;
              }
              onTagToggle(tag);
            }}
            className={`flex-shrink-0 px-5 py-2 rounded-full transition-all ${
              selectedTags.includes(tag)
                ? 'bg-sky-600 text-white hover:bg-sky-700'
                : 'bg-sky-100 text-sky-700 hover:bg-sky-200'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
