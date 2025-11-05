// lib/api/items.ts
import { ApiClient } from './client';
import { ItemResponse, SearchParams } from '@/lib/types/lostItem';

/**
 * 분실물 아이템 API 서비스
 *
 * Next.js API Route (/api/items/)를 통해 외부 API와 통신합니다.
 * 모든 요청은 서버 사이드 프록시를 거치므로 보안이 강화됩니다.
 */
export class ItemService {
  /**
   * 검색어 및/또는 태그로 분실물을 검색합니다
   * @param params 검색 파라미터 (q: 검색어, tags: 태그 ID 배열)
   * @returns 검색된 아이템 목록
   */
  static async searchItems(params: SearchParams): Promise<ItemResponse[]> {
    const queryParams: Record<string, string | string[]> = {};

    if (params.q) {
      queryParams.q = params.q;
    }

    if (params.tags && params.tags.length > 0) {
      queryParams.tags = params.tags.map(String);
    }

    return ApiClient.get<ItemResponse[]>('/api/items/search', queryParams);
  }

  /**
   * 전체 분실물 목록을 조회합니다
   * @returns 아이템 목록
   */
  static async fetchAllItems(): Promise<ItemResponse[]> {
    return ApiClient.get<ItemResponse[]>('/api/items');
  }

  /**
   * 특정 아이템의 상세 정보를 조회합니다
   * @param itemId 아이템 ID
   * @returns 아이템 상세 정보
   */
  static async fetchItemById(itemId: number): Promise<ItemResponse> {
    return ApiClient.get<ItemResponse>(`/api/items/${itemId}`);
  }
}
