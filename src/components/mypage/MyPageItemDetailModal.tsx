'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, MapPin, Calendar, Key, Clock, CheckCircle, AlertCircle, Package, Loader2 } from 'lucide-react';
import { ClaimedItem } from './ClaimedItemCard';
import { MyItemDetailResponse, getStatusInfo } from '@/lib/types/lostItem';

interface MyPageItemDetailModalProps {
  item: ClaimedItem;
  detailData: MyItemDetailResponse | null;
  detailLoading: boolean;
  onClose: () => void;
  onCancelReservation?: () => void;
}

/**
 * 마이페이지 분실물 상세 모달
 *
 * 기능:
 * - 수령 예정/완료 분실물 상세 정보 표시
 * - 수령 코드 및 코드 유효기간 표시 (detailData에서 가져옴)
 * - 상세 정보 로딩 처리
 */
export default function MyPageItemDetailModal({
  item,
  detailData,
  detailLoading,
  onClose,
  onCancelReservation,
}: MyPageItemDetailModalProps) {
  const [imageError, setImageError] = useState(false);

  // 날짜 포맷팅
  const formattedDate = new Date(item.registered_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // 상태 정보
  const statusInfo = getStatusInfo(item.status);
  const isPending = statusInfo.label === '예약중';

  // 코드 유효기간 포맷팅 (detailData가 있을 때만)
  const formattedExpires = detailData
    ? new Date(detailData.pickup_code.expires_at).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  // TODO: DELETE API 구현 후 활성화
  /*
  const handleCancelClick = () => {
    if (onCancelReservation) {
      onCancelReservation();
    }
  };
  */

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 왼쪽: 이미지 영역 */}
        <div className="relative md:w-2/3 bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center p-12">
          {item.photo_url && !imageError ? (
            <Image
              src={item.photo_url}
              alt={item.tags[0]?.name || '분실물'}
              fill
              className="object-contain rounded-xl"
              onError={() => setImageError(true)}
            />
          ) : (
            <Package className="w-48 h-48 text-sky-400" />
          )}
        </div>

        {/* 오른쪽: 정보 영역 */}
        <div className="md:w-1/3 p-8 overflow-y-auto flex flex-col">
          {/* 헤더 */}
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-sky-600">수령 분실물</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-sky-50 rounded-full transition-colors flex-shrink-0"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* 정보 섹션 */}
          <div className="space-y-6 flex-grow">
            {/* 태그 목록 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">카테고리</h3>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 bg-sky-100 text-sky-600 rounded-full text-sm font-medium border border-sky-200"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>

            {/* 상태 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">상태</h3>
              <div className="flex items-center gap-2">
                {isPending ? (
                  <>
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <span className="text-lg font-medium text-yellow-700">수령 대기</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-lg font-medium text-green-700">수령 완료</span>
                  </>
                )}
              </div>
            </div>

            {/* 등록 날짜 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">등록 날짜</h3>
              <div className="flex items-center gap-2 text-lg text-gray-800">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span>{formattedDate}</span>
              </div>
            </div>

            {/* 위치 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">분실함 위치</h3>
              <div className="flex items-center gap-2 text-lg text-gray-800">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span>{item.location || '위치 정보 없음'}</span>
              </div>
            </div>

            {/* 수령 코드 (pending만, detailData 로딩 후 표시) */}
            {isPending && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-2">수령 코드</h3>
                {detailLoading ? (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>코드 로딩 중...</span>
                  </div>
                ) : detailData ? (
                  <>
                    <div className="flex items-center gap-2 text-xl font-bold text-sky-600">
                      <Key className="w-5 h-5" />
                      <span>{detailData.pickup_code.code}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      분실함에서 이 코드를 사용하여 수령하세요
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-red-500">코드를 불러올 수 없습니다</p>
                )}
              </div>
            )}

            {/* 코드 유효기간 (pending만, detailData 로딩 후 표시) */}
            {isPending && detailData && !detailLoading && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-2">코드 유효기간</h3>
                <div className="flex items-center gap-2 text-lg text-gray-800">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <span>{formattedExpires}까지</span>
                </div>
              </div>
            )}
          </div>

          {/* TODO: 예약 취소 기능 - DELETE API 구현 후 활성화
          {isPending && (
            <button
              onClick={handleCancelClick}
              className="mt-8 w-full py-3 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition-colors"
            >
              예약 취소
            </button>
          )}
          */}
        </div>
      </div>
    </div>
  );
}
