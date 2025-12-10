import { NextRequest, NextResponse } from 'next/server';

/**
 * Cancel Reservation API 프록시
 *
 * POST /api/items/me/{id}/cancel
 * - Authorization 헤더 필수
 * - 예약 취소 요청을 외부 API로 중계
 * - Request body에 cancel_reason 필수
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

  // Request body 추출
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: '잘못된 요청 형식입니다.' },
      { status: 400 }
    );
  }

  // cancel_reason 검증
  if (!body.cancel_reason || typeof body.cancel_reason !== 'string') {
    return NextResponse.json(
      { error: '취소 사유를 입력해주세요.' },
      { status: 400 }
    );
  }

  const externalUrl = `${apiBaseUrl}/items/me/${itemId}/cancel`;

  try {
    // 외부 API 호출
    const response = await fetch(externalUrl, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cancel_reason: body.cancel_reason,
      }),
    });

    const data = await response.json();

    // 에러 처리
    if (!response.ok) {
      // 400: Bad Request
      if (response.status === 400) {
        return NextResponse.json(
          {
            error: '잘못된 요청입니다.',
            detail: data.detail || data.error || '요청 데이터를 확인해주세요.',
            raw: data,
          },
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

      // 403: 권한 없음 (다른 사람의 예약)
      if (response.status === 403) {
        return NextResponse.json(
          { error: '이 예약을 취소할 권한이 없습니다.' },
          { status: 403 }
        );
      }

      // 404: 예약 없음
      if (response.status === 404) {
        return NextResponse.json(
          { error: '예약을 찾을 수 없습니다.' },
          { status: 404 }
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
          error: data.error || data.detail || '예약 취소에 실패했습니다.',
          detail: data.detail,
          raw: data,
        },
        { status: response.status }
      );
    }

    // 성공 응답 (200 OK with ItemResponse)
    return NextResponse.json(data);

  } catch {
    return NextResponse.json(
      { error: '네트워크 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
