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
 *
 * 환경 변수:
 * - NEXT_PUBLIC_API_URL: API 서버 기본 URL (기본값: 현재 호스트)
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

    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl}/api/items?${queryParams}`;

    const response = await fetch(url);

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
    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl}/api/items/${id}`;

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
