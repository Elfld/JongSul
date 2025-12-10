// app/api/items/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

/**
 * 특정 분실물 상세 정보 API 프록시
 *
 * 역할: 클라이언트 요청을 외부 API 서버로 전달
 * 보안: API_BASE_URL이 서버에만 존재 (클라이언트에 노출 안 됨)
 *
 * GET /api/items/{id}
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: itemId } = await params;

    // 서버 사이드 환경 변수
    const apiBaseUrl = process.env.API_BASE_URL;

    if (!apiBaseUrl) {
      return NextResponse.json(
        { error: 'API_BASE_URL is not configured' },
        { status: 500 }
      );
    }

    // 외부 API URL 생성
    const externalUrl = `${apiBaseUrl}/items/${itemId}`;

    // 외부 API 호출
    const response = await fetch(externalUrl);

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Item not found' },
          { status: 404 }
        );
      }

      throw new Error(`External API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch item' },
      { status: 500 }
    );
  }
}
