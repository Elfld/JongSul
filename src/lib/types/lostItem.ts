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
 * 상태 인덱스 상수
 * 서버에서 문자열로 오더라도 인덱스로 관리
 *
 * 서버 상태 매핑:
 * - "보관" → AVAILABLE (예약 가능, 카드에 표기 안함)
 * - "예약" → RESERVED (예약중, 분홍색 배지)
 * - "찾음" → COMPLETED (수령완료, 회색 배지)
 */
export const STATUS_INDEX = {
  AVAILABLE: 0,  // 보관 중 (예약 가능한 상태)
  RESERVED: 1,   // 예약 중 (누군가 예약한 상태)
  COMPLETED: 2,  // 수령 완료 (찾아간 상태)
} as const;

/**
 * 상태 문자열을 인덱스로 변환
 * 서버에서 상태명이 변경되어도 이 함수만 수정하면 됨
 */
export function getStatusIndex(status: string): number {
  const statusUpper = status.toUpperCase();

  // 서버 상태명 매핑 (필요시 여기만 수정)
  if (statusUpper.includes('STORED') || statusUpper === '보관') return STATUS_INDEX.AVAILABLE;
  if (statusUpper.includes('RESERVED') || statusUpper === '예약') return STATUS_INDEX.RESERVED;
  if (statusUpper.includes('FOUND') || statusUpper === '찾음') return STATUS_INDEX.COMPLETED;

  return STATUS_INDEX.AVAILABLE; // 기본값
}

/**
 * 상태 정보 반환
 */
export function getStatusInfo(status: string) {
  const index = getStatusIndex(status);

  switch (index) {
    case STATUS_INDEX.AVAILABLE:
      return { index, label: '예약가능', color: 'sky' };
    case STATUS_INDEX.RESERVED:
      return { index, label: '예약중', color: 'pink' };
    case STATUS_INDEX.COMPLETED:
      return { index, label: '수령완료', color: 'gray' };
    default:
      return { index, label: '예약가능', color: 'sky' };
  }
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