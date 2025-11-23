// lib/hooks/useMyReservedIds.ts
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';

/**
 * 로그인한 사용자의 예약 아이템 ID 목록을 가져오는 훅
 *
 * 용도:
 * - 메인 페이지에서 내가 예약한 아이템인지 판별
 * - ItemCard/ItemModal에 isMyReservation prop 전달용
 *
 * @returns 예약한 아이템 ID 배열 (로그아웃 시 빈 배열)
 */
export function useMyReservedIds() {
  const { isAuthenticated } = useAuth();
  const [myReservedIds, setMyReservedIds] = useState<number[]>([]);

  useEffect(() => {
    // 로그아웃 상태면 초기화
    if (!isAuthenticated) {
      setMyReservedIds([]);
      return;
    }

    const fetchMyReservedItems = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      try {
        const response = await fetch('/api/items/me', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          const ids = data.map((item: { id: number }) => item.id);
          setMyReservedIds(ids);
        }
      } catch (error) {
        console.error('Failed to fetch my reserved items:', error);
      }
    };

    fetchMyReservedItems();
  }, [isAuthenticated]);

  return myReservedIds;
}
