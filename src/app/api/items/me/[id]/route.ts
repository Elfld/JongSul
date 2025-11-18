import { NextRequest, NextResponse } from 'next/server';

/**
 * MyPage Detail API 프록시
 *
 * GET /api/items/me/{id}
 * - Authorization 헤더 필수
 * - 내 예약 상세 정보 조회 (pickup_code 포함)
 * - 외부 API로 요청 중계
 */
export async function GET(
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

  const externalUrl = `${apiBaseUrl}/main/items/me/${itemId}`;
  console.log('[MyPage 상세] 외부 API 호출:', externalUrl);

  try {
    // 외부 API 호출
    const response = await fetch(externalUrl, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    // 성공 로깅
    if (response.ok) {
      console.log('[MyPage 상세] 성공:', {
        status: response.status,
        itemId,
        hasPickupCode: !!data.pickup_code,
      });
    }

    // 에러 처리
    if (!response.ok) {
      // 에러 로깅
      console.error('[MyPage 상세] 외부 API 에러:', {
        status: response.status,
        statusText: response.statusText,
        itemId,
        error: data,
      });

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
          { error: '예약 정보를 찾을 수 없습니다.' },
          { status: 404 }
        );
      }

      // 500+: 서버 오류
      if (response.status >= 500) {
        return NextResponse.json(
          { error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
          { status: 500 }
        );
      }

      // 기타 오류
      return NextResponse.json(
        { error: data.error || data.detail || '예약 상세 정보를 불러오는데 실패했습니다.' },
        { status: response.status }
      );
    }

    // 성공 응답
    return NextResponse.json(data);

  } catch (error) {
    // 네트워크 오류 로깅
    console.error('[MyPage 상세] 네트워크 에러:', {
      itemId,
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      { error: '네트워크 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
