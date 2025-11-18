// src/lib/types/lostItem.ts

/**
 * OpenAPI 명세에 따른 실제 API 타입 정의
 */

// 태그 응답 타입
export interface TagResponse {
  id: number;
  name: string;
}

// 분실물 아이템 응답 타입
export interface ItemResponse {
  id: number;
  photo_url: string | null;
  location: string | null;
  status: string;
  registered_at: string; // ISO 8601 datetime
  tags: TagResponse[];
}

// 검색 파라미터
export interface SearchParams {
  q?: string;        // 검색어 (1-50자)
  tags?: number[];   // 태그 ID 배열
}

// Pickup 코드 응답
export interface PickupCodeResponse {
  code: string;
  expires_at: string; // ISO 8601 datetime
}

// Claim API 응답
export interface ClaimResponse {
  item: ItemResponse;
  pickup_code: PickupCodeResponse;
}

// MyPage 관련 타입
export interface MyItemDetailResponse {
  item: ItemResponse;
  pickup_code: PickupCodeResponse;
}

/**
 * 상태 정보 반환
 *
 * 서버에서 한글로 넘어오는 상태를 직접 매핑:
 * - "보관" → 예약 가능 (카드에 배지 표기 안함)
 * - "예약" → 예약중 (분홍색 배지)
 * - "찾음" → 수령완료 (회색 배지)
 */
export function getStatusInfo(status: string) {
  if (status === '보관') {
    return { label: '예약가능', color: 'sky' };
  }
  if (status === '예약') {
    return { label: '예약중', color: 'pink' };
  }
  if (status === '찾음') {
    return { label: '수령완료', color: 'gray' };
  }

  // 기본값 (보관 = 예약가능)
  return { label: '예약가능', color: 'sky' };
}

/**
 * ============================================================
 * LEGACY - 이전 Mock API 타입 (참고용)
 * ============================================================
 */

// export interface LostItem {
//   id: number;
//   image: string;
//   date: string;
//   tag: string;
//   location: string;
//   description: string;
// }

// export interface ApiResponse {
//   items: LostItem[];
//   total: number;
//   hasMore: boolean;
// }