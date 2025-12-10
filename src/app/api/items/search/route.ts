// app/api/items/search/route.ts
import { NextRequest, NextResponse } from 'next/server';

/**
 * 분실물 검색 API 프록시
 *
 * 역할: 클라이언트 요청을 외부 API 서버로 전달
 * 보안: API_BASE_URL이 서버에만 존재 (클라이언트에 노출 안 됨)
 *
 * OpenAPI 명세:
 * - q: 검색어 (optional)
 * - tags: 태그 ID 배열 (optional, integer[])
 *
 * GET /api/items/search?q=검색어&tags=1&tags=2
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // 서버 사이드 환경 변수 (클라이언트에 노출 안 됨!)
    const apiBaseUrl = process.env.API_BASE_URL;

    if (!apiBaseUrl) {
      return NextResponse.json(
        { error: 'API_BASE_URL is not configured' },
        { status: 500 }
      );
    }

    // 외부 API URL 생성
    const externalUrl = new URL(`${apiBaseUrl}/items/search`);

    // 검색 파라미터 전달
    searchParams.forEach((value, key) => {
      externalUrl.searchParams.append(key, value);
    });

    // 외부 API 호출
    const response = await fetch(externalUrl.toString());

    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    );
  }
}
