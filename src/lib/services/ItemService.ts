// lib/services/ItemService.ts
import { LostItem, ApiResponse } from '@/lib/types/lostItem';

export interface SearchParams {
  search: string;
  tags: string[];
  page: number;
  limit: number;
}

/**
 * 분실물 아이템 관련 API 호출을 담당하는 Service 클래스
 * 의존성 역전 원칙(DIP)을 적용하여 API 호출 로직을 추상화
 */
export class ItemService {
  /**
   * 분실물 아이템 목록을 조회합니다
   * @param params 검색 파라미터 (검색어, 태그, 페이지, 제한)
   * @returns 아이템 목록과 페이지네이션 정보
   */
  static async fetchItems(params: SearchParams): Promise<ApiResponse> {
    const queryParams = new URLSearchParams({
      search: params.search,
      tags: params.tags.join(','),
      page: params.page.toString(),
      limit: params.limit.toString(),
    });

    const response = await fetch(`/api/items?${queryParams}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch items: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 특정 아이템의 상세 정보를 조회합니다 (추후 확장용)
   * @param id 아이템 ID
   * @returns 아이템 상세 정보
   */
  static async fetchItemById(id: string): Promise<LostItem> {
    const response = await fetch(`/api/items/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch item: ${response.statusText}`);
    }

    return response.json();
  }
}
