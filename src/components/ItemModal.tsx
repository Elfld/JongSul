// components/ItemModal.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Package, MapPin, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { ItemResponse, getStatusInfo } from '@/lib/types/lostItem';
import ConfirmDialog from './ConfirmDialog';

interface ItemModalProps {
  item: ItemResponse;
  onClose: () => void;
}

/**
 * 분실물 상세 모달 컴포넌트
 *
 * - 데스크톱: 원본 레이아웃 (이미지 2/3 + 설명 1/3, 세로 나열)
 * - 모바일: 바텀시트 (이미지 위 + 설명 아래 2열 그리드)
 */
export default function ItemModal({ item, onClose }: ItemModalProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [imageError, setImageError] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // 날짜 포맷팅
  const formattedDate = new Date(item.registered_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const shortDate = new Date(item.registered_at).toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
  });

  // 상태 정보
  const statusInfo = getStatusInfo(item.status);
  const isReserved = statusInfo.label === '예약중';
  const isPickedUp = statusInfo.label === '수령완료';
  const isButtonDisabled = isReserved || isPickedUp;

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

  // 뒤로가기는 URL 라우팅으로 자동 처리됨 (page.tsx에서 ?modal= 파라미터 관리)

  // body 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleClaimClick = () => {
    if (isButtonDisabled) return;
    if (!isAuthenticated) {
      setShowConfirmDialog(true);
      return;
    }
    router.push(`/claim/${item.id}`);
  };

  const handleClose = () => {
    onClose();
  };

  const handleConfirmLogin = () => {
    setShowConfirmDialog(false);
    router.push(`/login?redirect=/claim/${item.id}&message=소유권 주장을 위해 로그인이 필요합니다.`);
  };

  const handleCancelLogin = () => {
    setShowConfirmDialog(false);
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-end md:items-center justify-center z-50 md:p-4"
      onClick={handleClose}
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
              onClick={handleClose}
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
                  isReserved
                    ? 'bg-pink-100 text-pink-600'
                    : isPickedUp
                    ? 'bg-gray-100 text-gray-600'
                    : 'bg-green-100 text-green-600'
                }`}
              >
                {statusInfo.label}
              </span>
            </div>

            {/* 버튼 */}
            <button
              onClick={handleClaimClick}
              disabled={isButtonDisabled}
              className={`mt-auto w-full py-3.5 rounded-full font-semibold transition-colors ${
                isButtonDisabled
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-sky-500 text-white hover:bg-sky-600 active:bg-sky-700'
              }`}
            >
              {isReserved ? '예약중인 물품입니다' : isPickedUp ? '수령 완료된 물품입니다' : '수령 예약하기'}
            </button>
          </div>
        </div>

        {/* ===== 데스크톱 레이아웃 (원본) ===== */}
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
              <h2 className="text-2xl font-bold text-sky-600">분실물 상세</h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-sky-50 rounded-full transition-colors flex-shrink-0"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="space-y-6 flex-grow">
              {/* 태그 목록 */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-4 h-4 text-gray-500" />
                  <h3 className="text-sm font-semibold text-gray-500">카테고리</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span key={tag.id} className="px-3 py-1 bg-sky-100 text-sky-600 rounded-full text-lg font-medium">
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* 상태 */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {isReserved || isPickedUp ? (
                    <CheckCircle className="w-4 h-4 text-gray-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-gray-500" />
                  )}
                  <h3 className="text-sm font-semibold text-gray-500">상태</h3>
                </div>
                <p
                  className={`text-lg font-medium ${
                    isReserved
                      ? 'text-pink-600'
                      : isPickedUp
                      ? 'text-gray-600'
                      : 'text-gray-800'
                  }`}
                >
                  {statusInfo.label}
                </p>
              </div>

              {/* 등록 날짜 */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <h3 className="text-sm font-semibold text-gray-500">등록 날짜</h3>
                </div>
                <p className="text-lg text-gray-800">{formattedDate}</p>
              </div>

              {/* 위치 */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <h3 className="text-sm font-semibold text-gray-500">보관함 위치</h3>
                </div>
                <p className="text-lg text-gray-800">{item.location || '위치 정보 없음'}</p>
              </div>
            </div>

            <button
              onClick={handleClaimClick}
              disabled={isButtonDisabled}
              className={`mt-8 w-full py-3 rounded-full font-semibold transition-colors ${
                isButtonDisabled
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-sky-500 text-white hover:bg-sky-600'
              }`}
            >
              수령 예약하기
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        message="로그인이 필요한 기능입니다.&#10;로그인하시겠습니까?"
        confirmText="로그인"
        cancelText="취소"
        onConfirm={handleConfirmLogin}
        onCancel={handleCancelLogin}
      />
    </div>
  );
}
