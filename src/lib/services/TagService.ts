// lib/services/TagService.ts
import { TagResponse } from '@/lib/types/lostItem';

/**
 * 태그 관련 API 호출을 담당하는 Service 클래스
 *
 * 엔드포인트:
 * - GET /tags/ : 모든 태그 목록 조회
 */
export class TagService {
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
   * 모든 태그 목록을 조회합니다
   * @returns 태그 목록 (TagResponse[])
   */
  static async fetchAllTags(): Promise<TagResponse[]> {
    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl}/tags/`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch tags: ${response.statusText}`);
    }

    return response.json();
  }
}
