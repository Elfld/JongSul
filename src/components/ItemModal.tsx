// components/ItemModal.tsx
'use client';

import { useState } from 'react';
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
  const { isAuthenticated } = useAuth();
  const [imageError, setImageError] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // 날짜 포맷팅 (ISO 8601 → YYYY년 MM월 DD일)
  const formattedDate = new Date(item.registered_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // 상태 정보 가져오기
  const statusInfo = getStatusInfo(item.status);
  const isReserved = statusInfo.label === '예약중';
  const isPickedUp = statusInfo.label === '수령완료';
  const isButtonDisabled = isReserved || isPickedUp;

  // 분실물 찾기 페이지로 이동
  const handleClaimClick = () => {
    if (isButtonDisabled) return;

    // 로그인 확인
    if (!isAuthenticated) {
      setShowConfirmDialog(true);
      return;
    }

    router.push(`/claim/${item.id}`);
  };

  // 로그인 확인 다이얼로그 - 확인 버튼
  const handleConfirmLogin = () => {
    setShowConfirmDialog(false);
    router.push(`/login?redirect=/claim/${item.id}&message=소유권 주장을 위해 로그인이 필요합니다.`);
  };

  // 로그인 확인 다이얼로그 - 취소 버튼
  const handleCancelLogin = () => {
    setShowConfirmDialog(false);
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
                <h3 className="text-sm font-semibold text-gray-500">분실함 위치</h3>
              </div>
              <p className="text-lg text-gray-800">
                {item.location || '위치 정보 없음'}
              </p>
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