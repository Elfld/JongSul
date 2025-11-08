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