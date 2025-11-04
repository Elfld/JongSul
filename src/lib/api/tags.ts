// lib/api/tags.ts
import { ApiClient } from './client';
import { TagResponse } from '@/lib/types/lostItem';

/**
 * 태그 API 서비스
 *
 * Next.js API Route (/api/tags)를 통해 외부 API와 통신합니다.
 */
export class TagService {
  /**
   * 모든 태그 목록을 조회합니다
   * @returns 태그 목록
   */
  static async fetchAllTags(): Promise<TagResponse[]> {
    return ApiClient.get<TagResponse[]>('/api/tags');
  }
}
