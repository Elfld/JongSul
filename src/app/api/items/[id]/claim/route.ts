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

  const externalUrl = `${apiBaseUrl}/items/${itemId}/claim`;
  console.log('[Claim 프록시] 외부 API 호출:', externalUrl);

  try {
    // 외부 API 호출
    const response = await fetch(externalUrl, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    // 성공 로깅
    if (response.ok) {
      console.log('[Claim 프록시] 성공:', {
        status: response.status,
        itemId,
        hasPickupCode: !!data.pickup_code,
      });
    }

    // 에러 처리
    if (!response.ok) {
      // 에러 로깅 (모든 에러)
      console.error('[Claim 프록시] 외부 API 에러:', {
        status: response.status,
        statusText: response.statusText,
        itemId,
        error: data,
      });

      // 400: Bad Request (이미 예약된 경우 등)
      if (response.status === 400) {
        // 외부 API detail에서 "claimed" 관련 메시지 감지
        const detail = (data.detail || data.error || '').toLowerCase();
        const errorMessage = detail.includes('claimed') || detail.includes('already')
          ? '이미 예약된 물품입니다.'
          : '잘못된 요청입니다.';

        return NextResponse.json(
          { error: errorMessage },
          { status: 400 }
        );
      }

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
        return NextResponse.json(
          { error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
          { status: 500 }
        );
      }

      // 기타 오류
      return NextResponse.json(
        {
          error: data.error || data.detail || '소유권 주장에 실패했습니다.',
          detail: data.detail,
          raw: data, // 디버깅용
        },
        { status: response.status }
      );
    }

    // 성공 응답
    return NextResponse.json(data);

  } catch (error) {
    // 네트워크 오류 로깅
    console.error('[Claim 프록시] 네트워크 에러:', {
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
