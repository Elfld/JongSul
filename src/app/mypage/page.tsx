'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';
import NotificationSettings from '@/components/mypage/NotificationSettings';
import ClaimedItemCard, { ClaimedItem } from '@/components/mypage/ClaimedItemCard';
import MyPageItemDetailModal from '@/components/mypage/MyPageItemDetailModal';
import CancelReservationModal from '@/components/mypage/CancelReservationModal';

/**
 * 마이페이지
 *
 * 섹션:
 * 1. 알림 설정 (NotificationSettings)
 * 2. 수령 예정/완료 분실물 목록 (ClaimedItemCard)
 */

// Mock 데이터 (TODO: API 연동 시 실제 데이터로 대체)
const mockClaimedItems: ClaimedItem[] = [
  {
    id: 1,
    tags: ['지갑'],
    location: '5호관',
    registered_at: '2025-11-06T10:00:00Z',
    photo_url: null,
    code: '123456',
    status: 'pending',
    expires_at: '2025-11-13T10:00:00Z',
  },
  {
    id: 2,
    tags: ['핸드폰'],
    location: '3호관',
    registered_at: '2025-11-05T14:30:00Z',
    photo_url: null,
    code: '654321',
    status: 'completed',
    expires_at: '2025-11-12T14:30:00Z',
  },
  {
    id: 3,
    tags: ['이어폰', '케이스'],
    location: '중앙도서관',
    registered_at: '2025-11-04T09:15:00Z',
    photo_url: null,
    code: '789012',
    status: 'pending',
    expires_at: '2025-11-11T09:15:00Z',
  },
];

export default function MyPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const [selectedItem, setSelectedItem] = useState<ClaimedItem | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleGoHome = () => {
    router.push('/');
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // 분실물 카드 클릭 핸들러
  const handleItemClick = (item: ClaimedItem) => {
    setSelectedItem(item);
  };

  // 상세 모달 닫기
  const handleCloseDetailModal = () => {
    setSelectedItem(null);
    setShowCancelModal(false);
  };

  // 예약 취소 버튼 클릭
  const handleCancelReservation = () => {
    setShowCancelModal(true);
  };

  // 취소 확정
  const handleConfirmCancel = (reason: string) => {
    // TODO: API 호출 - 예약 취소 요청
    console.log('예약 취소:', selectedItem?.id, '사유:', reason);

    // TODO: 성공 시 목록에서 제거 또는 상태 업데이트
    alert(`예약이 취소되었습니다.\n사유: ${reason}`);

    // 모든 모달 닫기
    setShowCancelModal(false);
    setSelectedItem(null);
  };

  // 수령 대기 / 완료 분리
  const pendingItems = mockClaimedItems.filter((item) => item.status === 'pending');
  const completedItems = mockClaimedItems.filter((item) => item.status === 'completed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={handleGoHome}
              className="p-2 hover:bg-white rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-3xl font-bold text-gray-800">마이페이지</h1>
          </div>

          {/* 로그아웃 버튼 */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">로그아웃</span>
          </button>
        </div>

        {/* 섹션 1: 알림 설정 */}
        <div className="mb-8">
          <NotificationSettings />
        </div>

        {/* 섹션 2: 수령 예정 분실물 */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Package className="w-6 h-6 text-sky-500" />
            <h2 className="text-xl font-bold text-gray-800">
              수령 예정 분실물
            </h2>
          </div>

          {/* 수령 대기 목록 */}
          {pendingItems.length > 0 ? (
            <div className="space-y-4 mb-6">
              {pendingItems.map((item) => (
                <ClaimedItemCard
                  key={item.id}
                  item={item}
                  onClick={() => handleItemClick(item)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">수령 대기 중인 분실물이 없습니다.</p>
            </div>
          )}

          {/* 구분선 */}
          {completedItems.length > 0 && (
            <>
              <div className="border-t border-gray-200 my-6" />
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                수령 완료
              </h3>
              <div className="space-y-4 opacity-75">
                {completedItems.map((item) => (
                  <ClaimedItemCard
                    key={item.id}
                    item={item}
                    onClick={() => handleItemClick(item)}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* 홈으로 돌아가기 버튼 */}
        <div className="mt-8">
          <button
            onClick={handleGoHome}
            className="w-full py-3 bg-sky-500 text-white rounded-full font-semibold hover:bg-sky-600 transition-colors"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>

      {/* 상세 모달 */}
      {selectedItem && (
        <MyPageItemDetailModal
          item={selectedItem}
          onClose={handleCloseDetailModal}
          onCancelReservation={handleCancelReservation}
        />
      )}

      {/* 취소 확인 모달 */}
      {showCancelModal && (
        <CancelReservationModal
          onClose={() => setShowCancelModal(false)}
          onConfirm={handleConfirmCancel}
        />
      )}
    </div>
  );
}
