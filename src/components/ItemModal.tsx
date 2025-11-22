// components/ItemModal.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Package, MapPin, Calendar } from 'lucide-react';
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
 * 모바일 최적화:
 * - 이미지 영역 크게 (aspect-square)
 * - 설명 부분 2열 그리드
 * - ESC 키 / 뒤로가기로 닫기
 */
export default function ItemModal({ item, onClose }: ItemModalProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [imageError, setImageError] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // 날짜 포맷팅 (ISO 8601 → YYYY년 MM월 DD일)
  const formattedDate = new Date(item.registered_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // 짧은 날짜 (모바일용)
  const shortDate = new Date(item.registered_at).toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
  });

  // 상태 정보 가져오기
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

  // 뒤로가기로 닫기 (모바일 포함)
  useEffect(() => {
    // 모달 열릴 때 히스토리에 상태 추가
    history.pushState({ modal: true }, '');

    const handlePopState = () => {
      onClose();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [onClose]);

  // 모달 열릴 때 body 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // 분실물 찾기 페이지로 이동
  const handleClaimClick = () => {
    if (isButtonDisabled) return;

    // 로그인 확인
    if (!isAuthenticated) {
      setShowConfirmDialog(true);
      return;
    }

    // 히스토리 정리 후 이동
    history.back();
    setTimeout(() => {
      router.push(`/claim/${item.id}`);
    }, 10);
  };

  // 닫기 핸들러 (히스토리 정리)
  const handleClose = () => {
    history.back();
  };

  // 로그인 확인 다이얼로그 - 확인 버튼
  const handleConfirmLogin = () => {
    setShowConfirmDialog(false);
    history.back();
    setTimeout(() => {
      router.push(`/login?redirect=/claim/${item.id}&message=소유권 주장을 위해 로그인이 필요합니다.`);
    }, 10);
  };

  // 로그인 확인 다이얼로그 - 취소 버튼
  const handleCancelLogin = () => {
    setShowConfirmDialog(false);
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-end md:items-center justify-center z-50 md:p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white w-full md:rounded-3xl md:max-w-4xl md:max-h-[90vh] max-h-[95vh] overflow-hidden flex flex-col md:flex-row rounded-t-3xl animate-in slide-in-from-bottom md:slide-in-from-bottom-0 md:zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 이미지 영역 */}
        <div className="relative aspect-square md:aspect-auto md:w-1/2 bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center flex-shrink-0">
          {item.photo_url && !imageError ? (
            <Image
              src={item.photo_url}
              alt={item.tags[0]?.name || '분실물'}
              fill
              className="object-contain p-4"
              onError={() => setImageError(true)}
            />
          ) : (
            <Package className="w-32 h-32 md:w-48 md:h-48 text-sky-400" />
          )}
          {/* 닫기 버튼 - 모바일에서 이미지 위에 */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full transition-colors shadow-md md:hidden"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* 정보 영역 */}
        <div className="md:w-1/2 p-5 md:p-8 overflow-y-auto flex flex-col">
          {/* 헤더 - 데스크톱 */}
          <div className="hidden md:flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-sky-600">분실물 상세</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-sky-50 rounded-full transition-colors flex-shrink-0"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* 태그 목록 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {item.tags.map((tag) => (
              <span key={tag.id} className="px-3 py-1 bg-sky-100 text-sky-600 rounded-full text-base font-medium">
                {tag.name}
              </span>
            ))}
            {/* 상태 칩 */}
            <span
              className={`px-3 py-1 rounded-full text-base font-medium ${
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

          {/* 정보 그리드 - 모바일 2열 */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* 등록 날짜 */}
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500">등록일</span>
              </div>
              <p className="text-sm md:text-base font-medium text-gray-800">
                <span className="md:hidden">{shortDate}</span>
                <span className="hidden md:inline">{formattedDate}</span>
              </p>
            </div>

            {/* 위치 */}
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500">위치</span>
              </div>
              <p className="text-sm md:text-base font-medium text-gray-800 truncate">
                {item.location || '정보 없음'}
              </p>
            </div>
          </div>

          {/* 예약 버튼 */}
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

      {/* 로그인 확인 다이얼로그 */}
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
