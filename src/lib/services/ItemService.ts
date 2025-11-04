// lib/services/ItemService.ts
import { ItemResponse, SearchParams } from '@/lib/types/lostItem';

/**
 * 분실물 아이템 관련 API 호출을 담당하는 Service 클래스
 * OpenAPI 명세에 따라 구현됨
 *
 * 환경 변수:
 * - NEXT_PUBLIC_API_URL: API 서버 기본 URL (기본값: 현재 호스트)
 *
 * 엔드포인트:
 * - GET /items/           : 전체 분실물 목록
 * - GET /items/search     : 검색 (q, tags)
 * - GET /items/{item_id}  : 단일 아이템 상세
 */
export class ItemService {
  /**
   * API 기본 URL 가져오기
   * 환경 변수가 설정되어 있으면 사용, 없으면 현재 호스트 사용
   */
  private static getBaseUrl(): string {
    if (typeof window === 'undefined') {
      // 서버 사이드에서는 환경 변수 사용
      return process.env.NEXT_PUBLIC_API_URL || '';
    }
    // 클라이언트 사이드에서는 환경 변수 또는 현재 호스트 사용
    return process.env.NEXT_PUBLIC_API_URL || window.location.origin;
  }

  /**
   * 전체 분실물 목록을 조회합니다
   * @returns 아이템 목록
   */
  static async fetchAllItems(): Promise<ItemResponse[]> {
    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl}/items/`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch items: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 검색어 및/또는 태그로 분실물을 검색합니다
   * @param params 검색 파라미터 (q: 검색어, tags: 태그 ID 배열)
   * @returns 검색된 아이템 목록
   */
  static async searchItems(params: SearchParams): Promise<ItemResponse[]> {
    const baseUrl = this.getBaseUrl();
    const url = new URL(`${baseUrl}/items/search`);

    // 검색어 추가 (있을 경우)
    if (params.q && params.q.trim()) {
      url.searchParams.append('q', params.q.trim());
    }

    // 태그 ID 추가 (있을 경우)
    // tags=1&tags=2&tags=3 형태로 추가
    if (params.tags && params.tags.length > 0) {
      params.tags.forEach(tagId => {
        url.searchParams.append('tags', tagId.toString());
      });
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Failed to search items: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 특정 아이템의 상세 정보를 조회합니다
   * @param itemId 아이템 ID
   * @returns 아이템 상세 정보
   */
  static async fetchItemById(itemId: number): Promise<ItemResponse> {
    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl}/items/${itemId}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch item: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 서버 상태 확인 (헬스 체크)
   * @returns 서버 상태 정보
   */
  static async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl}/api/health`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Health check failed');
      }

      return response.json();
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }
}

/**
 * ============================================================
 * LEGACY - 이전 Mock API 코드 (참고용)
 * ============================================================
 */

// export interface SearchParams {
//   search: string;
//   tags: string[];
//   page: number;
//   limit: number;
// }

// static async fetchItems(params: SearchParams): Promise<ApiResponse> {
//   const queryParams = new URLSearchParams({
//     search: params.search,
//     tags: params.tags.join(','),
//     page: params.page.toString(),
//     limit: params.limit.toString(),
//   });
//
//   const baseUrl = this.getBaseUrl();
//   const url = `${baseUrl}/api/items?${queryParams}`;
//
//   const response = await fetch(url);
//
//   if (!response.ok) {
//     throw new Error(`Failed to fetch items: ${response.statusText}`);
//   }
//
//   return response.json();
// }
