'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Package, MapPin, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { TagResponse, getStatusInfo } from '@/lib/types/lostItem';

// API 응답 구조에 맞춘 타입 정의
export interface ClaimedItem {
  id: number;
  tags: TagResponse[];
  location: string | null;
  registered_at: string;
  photo_url: string | null;
  status: string; // "STORED", "FOUND" 등
}

interface ClaimedItemCardProps {
  item: ClaimedItem;
  onClick?: () => void;
}

/**
 * 수령 예정/완료 분실물 카드 컴포넌트
 *
 * 기능:
 * - 분실물 정보 표시 (이미지, 태그, 위치, 등록일)
 * - 수령 상태 배지 (예약중/수령완료)
 * - 클릭 시 상세 모달 표시 (코드는 모달에서만 표시)
 */
export default function ClaimedItemCard({ item, onClick }: ClaimedItemCardProps) {
  const [imageError, setImageError] = useState(false);

  // 날짜 포맷팅
  const formattedDate = new Date(item.registered_at).toLocaleDateString('ko-KR', {
    month: 'numeric',
    day: 'numeric',
  });

  // 상태 정보 가져오기
  const statusInfo = getStatusInfo(item.status);
  const isPending = statusInfo.label === '예약중';

  return (
    <div
      className="bg-white rounded-2xl p-4 border border-gray-100 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      {/* 1행: 이미지 + 상태 배지 */}
      <div className="flex items-start justify-between mb-3">
        <div className="relative w-20 h-20 flex-shrink-0 bg-gradient-to-br from-sky-100 to-sky-200 rounded-xl overflow-hidden">
          {item.photo_url && !imageError ? (
            <Image
              src={item.photo_url}
              alt={item.tags[0]?.name || '분실물'}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sky-400">
              <Package className="w-10 h-10" />
            </div>
          )}
        </div>

        {/* 상태 배지 */}
        <span
          className={`text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1 ${
            isPending
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-green-100 text-green-700'
          }`}
        >
          {isPending ? (
            <>
              <AlertCircle className="w-3 h-3" />
              수령대기
            </>
          ) : (
            <>
              <CheckCircle className="w-3 h-3" />
              수령완료
            </>
          )}
        </span>
      </div>

      {/* 2행: 태그들 */}
      <div className="flex gap-2 mb-3">
        {item.tags.map((tag) => (
          <span
            key={tag.id}
            className="px-3 py-1 bg-sky-100 text-sky-600 rounded-full text-sm font-medium border border-sky-200"
          >
            {tag.name}
          </span>
        ))}
      </div>

      {/* 3-4행: 위치, 날짜 */}
      <div className="space-y-1 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <span className="truncate">{item.location || '위치 정보 없음'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}
