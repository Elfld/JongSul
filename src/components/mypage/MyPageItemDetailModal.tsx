'use client';

import { useState, useEffect } from 'react';
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

  const handleCancelClick = () => {
    if (onCancelReservation) {
      onCancelReservation();
    }
  };

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // body 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // 짧은 날짜 포맷 (모바일용)
  const shortDate = new Date(item.registered_at).toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-end md:items-center justify-center z-50 md:p-4"
      onClick={onClose}
    >
      {/* 모바일: 바텀시트 / 데스크톱: 센터 모달 */}
      <div
        className="bg-white w-full max-h-[95vh] md:max-h-[90vh] overflow-hidden flex flex-col rounded-t-3xl md:rounded-3xl md:max-w-6xl animate-in slide-in-from-bottom md:slide-in-from-bottom-0 md:zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ===== 모바일 레이아웃 ===== */}
        <div className="md:hidden flex flex-col h-full">
          {/* 이미지 영역 */}
          <div className="relative aspect-[4/3] bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center flex-shrink-0">
            {item.photo_url && !imageError ? (
              <Image
                src={item.photo_url}
                alt={item.tags[0]?.name || '분실물'}
                fill
                className="object-contain p-4"
                onError={() => setImageError(true)}
              />
            ) : (
              <Package className="w-32 h-32 text-sky-400" />
            )}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full transition-colors shadow-md"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* 정보 영역 */}
          <div className="flex-1 p-5 overflow-y-auto flex flex-col">
            {/* 태그 */}
            <div className="flex flex-wrap gap-2 mb-4">
              {item.tags.map((tag) => (
                <span key={tag.id} className="px-3 py-1 bg-sky-100 text-sky-600 rounded-full text-base font-medium">
                  {tag.name}
                </span>
              ))}
            </div>

            {/* 2열 그리드 */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500">등록일</span>
                </div>
                <p className="text-sm font-medium text-gray-800">{shortDate}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500">위치</span>
                </div>
                <p className="text-sm font-medium text-gray-800 truncate">{item.location || '정보 없음'}</p>
              </div>
            </div>

            {/* 상태 칩 */}
            <div className="mb-4">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  isPending ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                }`}
              >
                {isPending ? '수령 대기' : '수령 완료'}
              </span>
            </div>

            {/* 수령 코드 (pending만) */}
            {isPending && (
              <div className="bg-sky-50 rounded-xl p-4 mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <Key className="w-4 h-4 text-sky-600" />
                  <span className="text-xs font-semibold text-sky-600">수령 코드</span>
                </div>
                {detailLoading ? (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">로딩 중...</span>
                  </div>
                ) : detailData ? (
                  <>
                    <p className="text-2xl font-bold text-sky-600 mb-1">{detailData.pickup_code.code}</p>
                    <p className="text-xs text-gray-600">키오스크에서 입력하세요</p>
                  </>
                ) : (
                  <p className="text-sm text-red-500">코드를 불러올 수 없습니다</p>
                )}
              </div>
            )}

            {/* 유효기간 (pending만) */}
            {isPending && detailData && !detailLoading && (
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <span className="text-xs font-semibold text-gray-600">유효기간</span>
                </div>
                <p className="text-sm font-medium text-gray-800">{formattedExpires}까지</p>
              </div>
            )}

            {/* 예약 취소 버튼 */}
            {isPending && (
              <button
                onClick={handleCancelClick}
                className="mt-auto w-full py-3.5 rounded-full font-semibold transition-colors bg-red-500 text-white hover:bg-red-600 active:bg-red-700"
              >
                예약 취소
              </button>
            )}
          </div>
        </div>

        {/* ===== 데스크톱 레이아웃 ===== */}
        <div className="hidden md:flex md:flex-row h-full">
          {/* 이미지 영역 - 2/3 */}
          <div className="relative w-2/3 bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center p-12">
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

          {/* 정보 영역 - 1/3 */}
          <div className="w-1/3 p-8 overflow-y-auto flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-sky-600">수령 분실물</h2>
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
                <h3 className="text-sm font-semibold text-gray-500 mb-2">보관함 위치</h3>
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
                        키오스크에서 이 코드를 입력하여 수령하세요
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

            {/* 예약 취소 버튼 (수령 대기 중일 때만 표시) */}
            {isPending && (
              <button
                onClick={handleCancelClick}
                className="mt-8 w-full py-3 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition-colors"
              >
                예약 취소
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
