// app/api/tags/route.ts
import { NextResponse } from 'next/server';

/**
 * 태그 목록 API 프록시
 *
 * 역할: 클라이언트 요청을 외부 API 서버로 전달
 * 보안: API_BASE_URL이 서버에만 존재 (클라이언트에 노출 안 됨)
 *
 * GET /api/tags
 */
export async function GET() {
  try {
    // 서버 사이드 환경 변수 (클라이언트에 노출 안 됨!)
    const apiBaseUrl = process.env.API_BASE_URL;

    if (!apiBaseUrl) {
      return NextResponse.json(
        { error: 'API_BASE_URL is not configured' },
        { status: 500 }
      );
    }

    // 외부 API 호출
    const response = await fetch(`${apiBaseUrl}/tags/`);

    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}
