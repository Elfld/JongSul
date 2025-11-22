// components/ItemCard.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Package, MapPin, Calendar } from 'lucide-react';
import { ItemResponse, getStatusInfo } from '@/lib/types/lostItem';

interface ItemCardProps {
  item: ItemResponse;
  onClick: () => void;
}

/**
 * 분실물 카드 컴포넌트
 *
 * OpenAPI 명세 적용:
 * - photo_url 사용
 * - tags 배열 표시
 * - registered_at datetime 포맷팅
 * - location null 처리
 */
export default function ItemCard({ item, onClick }: ItemCardProps) {
  const [imageError, setImageError] = useState(false);

  // 날짜 포맷팅 (ISO 8601 → YYYY-MM-DD)
  const formattedDate = new Date(item.registered_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  // 상태 정보 가져오기
  const statusInfo = getStatusInfo(item.status);
  const showStatusChip = statusInfo.label !== '예약가능';

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer"
    >
      <div className="relative aspect-[4/3] bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center">
        {item.photo_url && !imageError ? (
          <Image
            src={item.photo_url}
            alt={item.tags[0]?.name || '분실물'}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <Package className="w-16 h-16 text-sky-400" />
        )}
      </div>
      <div className="p-4 bg-white">
        {/* 태그 목록 (최대 3개 표시) + 상태 칩 */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {item.tags.slice(0, 3).map((tag) => (
            <span key={tag.id} className="px-3 py-1 bg-sky-100 text-sky-600 rounded-full text-sm font-medium">
              {tag.name}
            </span>
          ))}
          {item.tags.length > 3 && (
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
              +{item.tags.length - 3}
            </span>
          )}
          {/* 상태 칩 (예약중/수령완료만 표시) */}
          {showStatusChip && (
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                statusInfo.label === '예약중'
                  ? 'bg-pink-100 text-pink-600'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {statusInfo.label}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span>{item.location || '위치 정보 없음'}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500 text-xs">
          <Calendar className="w-4 h-4" />
          <span>{formattedDate}</span>
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

// interface ItemCardProps {
//   item: LostItem;
//   onClick: () => void;
// }

// <img src={item.image} alt={item.tag} className="w-full h-full object-cover" />
// <span className="px-3 py-1 bg-sky-100 text-sky-600 rounded-full text-sm font-medium">
//   {item.tag}
// </span>
// <p className="text-gray-600 text-sm mb-1">📍 {item.location}</p>
// <p className="text-gray-500 text-xs">📅 {item.date}</p>