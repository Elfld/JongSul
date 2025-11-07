// components/ItemModal.tsx
'use client';

import Image from 'next/image';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ItemResponse } from '@/lib/types/lostItem';

interface ItemModalProps {
  item: ItemResponse;
  onClose: () => void;
}

/**
 * 분실물 상세 모달 컴포넌트
 *
 * OpenAPI 명세 적용:
 * - photo_url 사용
 * - tags 배열 모두 표시
 * - registered_at datetime 포맷팅
 * - status 필드 추가
 * - location null 처리
 * - description 제거 (API에 없음)
 */
export default function ItemModal({ item, onClose }: ItemModalProps) {
  const router = useRouter();

  // 날짜 포맷팅 (ISO 8601 → YYYY년 MM월 DD일)
  const formattedDate = new Date(item.registered_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // 분실물 찾기 페이지로 이동
  const handleClaimClick = () => {
    router.push(`/claim/${item.id}`);
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative md:w-2/3 bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center p-12">
          {item.photo_url ? (
            <Image src={item.photo_url} alt={item.tags[0]?.name || '분실물'} fill className="object-contain rounded-xl" />
          ) : (
            <div className="text-sky-400" style={{ fontSize: '12rem' }}>📦</div>
          )}
        </div>
        <div className="md:w-1/3 p-8 overflow-y-auto flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-sky-600">분실물 상세</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-sky-50 rounded-full transition-colors flex-shrink-0"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          <div className="space-y-6 flex-grow">
            {/* 태그 목록 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">카테고리</h3>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span key={tag.id} className="px-3 py-1 bg-sky-100 text-sky-600 rounded-full text-sm font-medium">
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>

            {/* 상태 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">상태</h3>
              <p className="text-lg text-gray-800">{item.status}</p>
            </div>

            {/* 등록 날짜 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">등록 날짜</h3>
              <p className="text-lg text-gray-800">📅 {formattedDate}</p>
            </div>

            {/* 위치 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">분실함 위치</h3>
              <p className="text-lg text-gray-800">
                📍 {item.location || '위치 정보 없음'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClaimClick}
            className="mt-8 w-full bg-sky-500 text-white py-3 rounded-full font-semibold hover:bg-sky-600 transition-colors"
          >
            내 물건 찾기
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * ============================================================
 * LEGACY - 이전 LostItem 기반 코드 (참고용)
 * ============================================================
 */

// import { LostItem } from '@/lib/types/lostItem';

// interface ItemModalProps {
//   item: LostItem;
//   onClose: () => void;
// }

// <h2 className="text-2xl font-bold text-sky-600">{item.tag}</h2>
// <img src={item.image} alt={item.tag} className="max-w-full max-h-full object-contain rounded-xl" />
// <p className="text-lg text-gray-800">📅 {item.date}</p>
// <p className="text-lg text-gray-800">📍 {item.location}</p>
// <div>
//   <h3 className="text-sm font-semibold text-gray-500 mb-2">상세 설명</h3>
//   <p className="text-lg text-gray-800">{item.description}</p>
// </div>