'use client';

import Image from 'next/image';

export interface ClaimedItem {
  id: number;
  tags: string[];
  location: string;
  registered_at: string;
  photo_url: string | null;
  code: string;
  status: 'pending' | 'completed';
  expires_at: string;
}

interface ClaimedItemCardProps {
  item: ClaimedItem;
}

/**
 * 수령 예정/완료 분실물 카드 컴포넌트
 *
 * 기능:
 * - 분실물 정보 표시
 * - 수령 코드 표시
 * - 수령 상태 배지
 * - 유효기간 표시
 */
export default function ClaimedItemCard({ item }: ClaimedItemCardProps) {
  // 날짜 포맷팅
  const formattedDate = new Date(item.registered_at).toLocaleDateString('ko-KR', {
    month: 'numeric',
    day: 'numeric',
  });

  const formattedExpires = new Date(item.expires_at).toLocaleDateString('ko-KR', {
    month: 'numeric',
    day: 'numeric',
  });

  const isPending = item.status === 'pending';

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* 이미지 */}
        <div className="relative w-24 h-24 flex-shrink-0 bg-gradient-to-br from-sky-100 to-sky-200 rounded-xl overflow-hidden">
          {item.photo_url ? (
            <Image
              src={item.photo_url}
              alt={item.tags[0] || '분실물'}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">
              📦
            </div>
          )}
        </div>

        {/* 정보 */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-sm font-semibold text-sky-600"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* 상태 배지 */}
            <span
              className={`text-xs font-medium px-3 py-1 rounded-full ${
                isPending
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {isPending ? '🟡 수령대기' : '✓ 수령완료'}
            </span>
          </div>

          <div className="space-y-1 text-sm text-gray-600">
            <p>📍 {item.location}</p>
            <p>📅 {formattedDate}</p>

            {/* 수령 코드 */}
            {isPending && (
              <p className="font-semibold text-sky-600">
                🔑 코드: {item.code}
              </p>
            )}

            {/* 유효기간 또는 수령 완료 메시지 */}
            {isPending ? (
              <p className="text-xs text-gray-500">
                ⏰ ~{formattedExpires}까지
              </p>
            ) : (
              <p className="text-xs text-green-600 font-medium">
                ✓ 수령 완료
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
