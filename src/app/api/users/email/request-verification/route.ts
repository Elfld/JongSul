import { NextRequest, NextResponse } from 'next/server';

/**
 * 백엔드 에러 응답을 문자열로 변환
 */
function formatBackendError(errorData: any, fallback: string): string {
  if (typeof errorData?.error === 'string') {
    return errorData.error;
  }
  if (Array.isArray(errorData?.error)) {
    const messages = errorData.error
      .map((e: any) => e.msg || '')
      .filter((msg: string) => msg.length > 0);
    return messages.length > 0 ? messages.join(', ') : fallback;
  }
  return fallback;
}

/**
 * 이메일 인증번호 발송 API 프록시
 *
 * OpenAPI 명세:
 * - Endpoint: POST /users/email/request-verification
 * - Request: EmailRequest { email }
 * - Response: 200 OK (인증번호 발송 성공)
 *
 * 동작:
 * - 사용자 이메일로 6자리 인증번호 발송
 * - 인증번호 유효기간: 5분
 * - 중복 이메일 체크 포함
 *
 * 에러 처리:
 * - 400 Bad Request: 이미 가입된 이메일
 * - 422 Validation Error: 입력값 형식 오류
 * - 500 Internal Server Error: 이메일 발송 실패
 */
export async function POST(request: NextRequest) {
  try {
    // 1. 클라이언트 요청 Body 파싱
    const body = await request.json();

    // 2. 환경변수에서 API URL 가져오기
    const apiBaseUrl = process.env.API_BASE_URL;

    if (!apiBaseUrl) {
      return NextResponse.json(
        { error: 'API_BASE_URL is not configured' },
        { status: 500 }
      );
    }

    // 3. 외부 API 호출
    const externalUrl = `${apiBaseUrl}/users/email/request-verification`;

    console.log('[이메일 인증 요청 프록시] 외부 API 호출:', externalUrl);
    console.log('[이메일 인증 요청 프록시] Request Body:', {
      email: body.email,
    });

    const response = await fetch(externalUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: body.email,
      }),
    });

    // 4. 에러 처리
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      console.error('[이메일 인증 요청 프록시] 외부 API 에러:', {
        status: response.status,
        error: errorData,
      });

      // 4-1. 에러 메시지 변환
      const errorMessage = formatBackendError(
        errorData,
        '인증번호 발송에 실패했습니다.'
      );

      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    // 5. 성공 응답
    const data = await response.json();

    console.log('[이메일 인증 요청 프록시] 성공:', {
      email: body.email,
    });

    return NextResponse.json(data);
  } catch (error) {
    // 6. 네트워크 에러 등 예외 처리
    console.error('[이메일 인증 요청 프록시] Exception:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
