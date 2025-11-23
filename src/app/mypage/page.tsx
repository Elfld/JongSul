'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Package, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { MyItemDetailResponse, getStatusInfo } from '@/lib/types/lostItem';
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

function MyPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logout, isAuthenticated, isLoading } = useAuth();

  // URL 파라미터에서 모달 ID 가져오기
  const modalItemId = searchParams.get('modal');

  // 예약 목록 상태
  const [claimedItems, setClaimedItems] = useState<ClaimedItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [itemsError, setItemsError] = useState<string | null>(null);

  // 모달 상태
  const [selectedItem, setSelectedItem] = useState<ClaimedItem | null>(null);
  const [selectedDetailData, setSelectedDetailData] = useState<MyItemDetailResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const isLoggingOut = useRef(false);

  // 인증 가드: 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoggingOut.current) {
      router.push('/login?redirect=/mypage&message=로그인이 필요한 페이지입니다.');
    }
  }, [isAuthenticated, isLoading, router]);

  // 예약 목록 가져오기
  useEffect(() => {
    if (!isAuthenticated || isLoading) {
      return;
    }

    async function fetchMyItems() {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setItemsError('로그인이 필요합니다.');
        setItemsLoading(false);
        return;
      }

      try {
        setItemsLoading(true);
        setItemsError(null);

        const response = await fetch('/api/items/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          // 401: 토큰 만료
          if (response.status === 401) {
            localStorage.removeItem('access_token');
            router.push('/login?redirect=/mypage&message=로그인이 필요합니다.');
            return;
          }

          throw new Error('예약 목록을 불러오는데 실패했습니다.');
        }

        const data: ClaimedItem[] = await response.json();
        setClaimedItems(data);
      } catch (err) {
        setItemsError(err instanceof Error ? err.message : '오류가 발생했습니다.');
      } finally {
        setItemsLoading(false);
      }
    }

    fetchMyItems();
  }, [isAuthenticated, isLoading, router]);

  // URL 파라미터로 모달 자동 오픈
  useEffect(() => {
    if (!modalItemId || itemsLoading || claimedItems.length === 0) return;

    const targetItem = claimedItems.find(item => item.id === Number(modalItemId));
    if (targetItem && !selectedItem) {
      // 직접 모달 열기 로직 (handleItemClick 대신)
      setSelectedItem(targetItem);
      setDetailLoading(true);
      setSelectedDetailData(null);

      const token = localStorage.getItem('access_token');
      if (token) {
        fetch(`/api/items/me/${targetItem.id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        })
          .then(res => res.ok ? res.json() : Promise.reject())
          .then((data: MyItemDetailResponse) => setSelectedDetailData(data))
          .catch(() => setSelectedItem(null))
          .finally(() => setDetailLoading(false));
      }

      // URL에서 modal 파라미터 제거 (히스토리 교체)
      router.replace('/mypage', { scroll: false });
    }
  }, [modalItemId, itemsLoading, claimedItems, selectedItem, router]);

  const handleGoHome = () => {
    router.push('/');
  };

  const handleLogout = () => {
    isLoggingOut.current = true;
    logout();
    router.replace('/');
  };

  // 분실물 카드 클릭 핸들러 - 상세 정보 가져오기
  const handleItemClick = async (item: ClaimedItem) => {
    setSelectedItem(item);
    setDetailLoading(true);
    setSelectedDetailData(null);

    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('로그인이 필요합니다.');
      router.push('/login?redirect=/mypage');
      return;
    }

    try {
      const response = await fetch(`/api/items/me/${item.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('access_token');
          router.push('/login?redirect=/mypage&message=로그인이 필요합니다.');
          return;
        }
        throw new Error('예약 상세 정보를 불러오는데 실패했습니다.');
      }

      const detailData: MyItemDetailResponse = await response.json();
      setSelectedDetailData(detailData);
    } catch (err) {
      alert(err instanceof Error ? err.message : '오류가 발생했습니다.');
      setSelectedItem(null); // 에러 시 모달 닫기
    } finally {
      setDetailLoading(false);
    }
  };

  // 상세 모달 닫기
  const handleCloseDetailModal = () => {
    setSelectedItem(null);
    setSelectedDetailData(null);
    setShowCancelModal(false);
  };

  // 예약 취소 버튼 클릭
  const handleCancelReservation = () => {
    setShowCancelModal(true);
  };

  // 취소 확정
  const handleConfirmCancel = async (reason: string) => {
    if (!selectedItem) return;

    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('로그인이 필요합니다.');
      router.push('/login?redirect=/mypage');
      return;
    }

    try {
      // POST /api/items/me/{id}/cancel API 호출
      const response = await fetch(`/api/items/me/${selectedItem.id}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cancel_reason: reason,
        }),
      });

      if (!response.ok) {
        // 401: 토큰 만료
        if (response.status === 401) {
          localStorage.removeItem('access_token');
          router.push('/login?redirect=/mypage&message=로그인이 필요합니다.');
          return;
        }

        // 403: 권한 없음
        if (response.status === 403) {
          alert('이 예약을 취소할 권한이 없습니다.');
          return;
        }

        // 404: 예약 없음
        if (response.status === 404) {
          alert('예약을 찾을 수 없습니다.');
          return;
        }

        throw new Error('예약 취소에 실패했습니다.');
      }

      // 성공 시 목록에서 제거
      setClaimedItems(prev => prev.filter(item => item.id !== selectedItem.id));

      alert(`예약이 취소되었습니다.\n사유: ${reason}`);

      // 모든 모달 닫기
      setShowCancelModal(false);
      setSelectedItem(null);
      setSelectedDetailData(null);

    } catch (err) {
      alert(err instanceof Error ? err.message : '오류가 발생했습니다.');
    }
  };

  // 수령 대기 / 완료 분리
  const pendingItems = claimedItems.filter((item) => {
    const statusInfo = getStatusInfo(item.status);
    return statusInfo.label === '예약중';
  });
  const completedItems = claimedItems.filter((item) => {
    const statusInfo = getStatusInfo(item.status);
    return statusInfo.label === '수령완료';
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={handleGoHome}
            className="p-2 hover:bg-white rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">마이페이지</h1>
        </div>

        {/* 계정 정보 카드 */}
        <div className="bg-white rounded-xl px-4 py-3 mb-6 flex items-center justify-between shadow-sm">
          <span className="text-sm text-gray-600 truncate mr-4">
            {user?.email || '로그인 필요'}
          </span>
          <button
            onClick={handleLogout}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">로그아웃</span>
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

          {/* 로딩 상태 */}
          {itemsLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
              <span className="ml-3 text-gray-600">로딩 중...</span>
            </div>
          ) : itemsError ? (
            /* 에러 상태 */
            <div className="text-center py-8">
              <p className="text-red-600">{itemsError}</p>
            </div>
          ) : (
            <>
              {/* 수령 대기 목록 */}
              {pendingItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-75">
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
          detailData={selectedDetailData}
          detailLoading={detailLoading}
          onClose={handleCloseDetailModal}
          onCancelReservation={handleCancelReservation}
        />
      )}

      {/* 예약 취소 모달 */}
      {showCancelModal && (
        <CancelReservationModal
          onClose={() => setShowCancelModal(false)}
          onConfirm={handleConfirmCancel}
        />
      )}
    </div>
  );
}

// Suspense로 감싸서 export (useSearchParams 사용 시 필요)
export default function MyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
      </div>
    }>
      <MyPageContent />
    </Suspense>
  );
}
