import { NextRequest, NextResponse } from 'next/server';

/**
 * 인증번호 검증 API 프록시
 *
 * OpenAPI 명세:
 * - Endpoint: POST /users/email/verify
 * - Request: VerificationRequest { email, code }
 * - Response: VerificationResponse { message, verification_token }
 *
 * 동작:
 * - 입력된 6자리 인증번호 검증
 * - 성공 시 verification_token 발급 (10분 유효)
 * - 이 토큰은 회원가입 시 필수로 제출
 *
 * 에러 처리:
 * - 400 Bad Request: 인증번호 불일치 또는 시간 만료
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
    const externalUrl = `${apiBaseUrl}/users/email/verify`;

    console.log('[인증번호 검증 프록시] 외부 API 호출:', externalUrl);
    console.log('[인증번호 검증 프록시] Request Body:', {
      email: body.email,
      code: body.code,
    });

    const response = await fetch(externalUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: body.email,
        code: body.code,
      }),
    });

    // 4. 에러 처리
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      console.error('[인증번호 검증 프록시] 외부 API 에러:', {
        status: response.status,
        error: errorData,
      });

      // 4-1. 400 Bad Request: 인증번호 불일치 또는 만료
      if (response.status === 400) {
        return NextResponse.json(
          {
            error:
              errorData.detail ||
              '인증번호가 올바르지 않거나 유효기간이 만료되었습니다.',
          },
          { status: 400 }
        );
      }

      // 4-2. 기타 에러
      return NextResponse.json(
        { error: errorData.detail || '인증번호 확인에 실패했습니다.' },
        { status: response.status }
      );
    }

    // 5. 성공 응답
    const data = await response.json();

    console.log('[인증번호 검증 프록시] 성공:', {
      email: body.email,
      message: data.message,
      has_token: !!data.verification_token,
    });

    return NextResponse.json(data);
  } catch (error) {
    // 6. 네트워크 에러 등 예외 처리
    console.error('[인증번호 검증 프록시] Exception:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
