import { NextRequest, NextResponse } from 'next/server';

/**
 * Claim API 프록시
 *
 * POST /api/items/{id}/claim
 * - Authorization 헤더 필수
 * - 외부 API로 요청 중계
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: itemId } = await params;

  // Authorization 헤더 추출
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: '인증이 필요합니다.' },
      { status: 401 }
    );
  }

  const apiBaseUrl = process.env.API_BASE_URL;
  if (!apiBaseUrl) {
    return NextResponse.json(
      { error: 'API 서버 설정이 없습니다.' },
      { status: 500 }
    );
  }

  try {
    // 외부 API 호출
    const response = await fetch(`${apiBaseUrl}/main/items/${itemId}/claim`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    // 에러 처리
    if (!response.ok) {
      // 401: 토큰 만료/유효하지 않음
      if (response.status === 401) {
        return NextResponse.json(
          { error: '로그인이 필요합니다. 다시 로그인해주세요.' },
          { status: 401 }
        );
      }

      // 404: 분실물 없음
      if (response.status === 404) {
        return NextResponse.json(
          { error: '분실물을 찾을 수 없습니다.' },
          { status: 404 }
        );
      }

      // 409: 이미 신청됨
      if (response.status === 409) {
        return NextResponse.json(
          { error: '이미 신청된 분실물입니다.' },
          { status: 409 }
        );
      }

      // 422: 유효성 검증 실패
      if (response.status === 422) {
        return NextResponse.json(
          { error: '잘못된 요청입니다.', details: data },
          { status: 422 }
        );
      }

      // 500+: 서버 오류
      if (response.status >= 500) {
        console.error('Claim API server error:', response.status, data);
        return NextResponse.json(
          { error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
          { status: 500 }
        );
      }

      // 기타 오류
      return NextResponse.json(
        { error: data.error || '소유권 주장에 실패했습니다.' },
        { status: response.status }
      );
    }

    // 성공 응답
    return NextResponse.json(data);

  } catch (error) {
    // 네트워크 오류
    if (!(error instanceof Error)) {
      console.error('Claim API network error:', error);
    }
    return NextResponse.json(
      { error: '네트워크 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
