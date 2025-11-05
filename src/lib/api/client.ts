// lib/api/client.ts

/**
 * API 클라이언트 기본 클래스
 *
 * 모든 API 요청은 이 클라이언트를 통해 Next.js API Route로 전달됩니다.
 * Next.js API Route는 프록시 역할을 하여 외부 API 서버와 통신합니다.
 *
 * 데이터 흐름:
 * Component → Service (lib/api/) → Next.js API Route (app/api/) → External API
 */
export class ApiClient {
  /**
   * GET 요청
   * @param endpoint API 엔드포인트 (예: '/items/search')
   * @param params URL 검색 파라미터
   */
  static async get<T>(endpoint: string, params?: Record<string, string | string[]>): Promise<T> {
    const url = new URL(endpoint, window.location.origin);

    // 파라미터 추가
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => url.searchParams.append(key, v));
        } else if (value) {
          url.searchParams.append(key, value);
        }
      });
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * POST 요청 (추후 확장용)
   */
  static async post<T>(endpoint: string, body: unknown): Promise<T> {
    const url = new URL(endpoint, window.location.origin);

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}
