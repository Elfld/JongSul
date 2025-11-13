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
 */
export const STATUS_INDEX = {
  LOST: 0,      // 분실
  STORED: 1,    // 보관 (수령 예약된 물품)
  FOUND: 2,     // 찾음 (가져간 물품)
} as const;

/**
 * 상태 문자열을 인덱스로 변환
 * 서버에서 상태명이 변경되어도 이 함수만 수정하면 됨
 */
export function getStatusIndex(status: string): number {
  const statusUpper = status.toUpperCase();

  // 서버 상태명 매핑 (필요시 여기만 수정)
  if (statusUpper.includes('LOST') || statusUpper === '분실') return STATUS_INDEX.LOST;
  if (statusUpper.includes('STORED') || statusUpper === '보관') return STATUS_INDEX.STORED;
  if (statusUpper.includes('FOUND') || statusUpper === '찾음') return STATUS_INDEX.FOUND;

  return STATUS_INDEX.LOST; // 기본값
}

/**
 * 상태 정보 반환
 */
export function getStatusInfo(status: string) {
  const index = getStatusIndex(status);

  switch (index) {
    case STATUS_INDEX.LOST:
      return { index, label: '분실', color: 'sky' };
    case STATUS_INDEX.STORED:
      return { index, label: '예약중', color: 'pink' };
    case STATUS_INDEX.FOUND:
      return { index, label: '수령완료', color: 'gray' };
    default:
      return { index, label: '분실', color: 'sky' };
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