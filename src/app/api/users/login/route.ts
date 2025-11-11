import { NextRequest, NextResponse } from 'next/server';

/**
 * 로그인 API 프록시
 *
 * OpenAPI 명세:
 * - Endpoint: POST /users/login
 * - Request: UserLogin { email, password }
 * - Response: Token { access_token, token_type }
 *
 * 주의: user 정보는 반환되지 않음 (토큰만)
 *
 * 에러 처리:
 * - 401 Unauthorized: 비밀번호 불일치
 * - 404 Not Found: 사용자 없음
 * - 422 Validation Error: 이메일 형식 오류
 * - 500 Internal Server Error: 서버 오류
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
    // 중요: /main prefix 추가
    const externalUrl = `${apiBaseUrl}/main/users/login`;

    console.log('[로그인 프록시] 외부 API 호출:', externalUrl);
    console.log('[로그인 프록시] Request:', { email: body.email });

    const response = await fetch(externalUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
      }),
    });

    // 4. 에러 처리
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      console.error('[로그인 프록시] 외부 API 에러:', {
        status: response.status,
        error: errorData,
      });

      // 4-1. 401 Unauthorized: 비밀번호 불일치
      if (response.status === 401) {
        return NextResponse.json(
          { error: '이메일 또는 비밀번호가 올바르지 않습니다.' },
          { status: 401 }
        );
      }

      // 4-2. 404 Not Found: 사용자 없음
      if (response.status === 404) {
        return NextResponse.json(
          { error: '존재하지 않는 사용자입니다.' },
          { status: 404 }
        );
      }

      // 4-3. 422 Validation Error: 필드 형식 오류
      if (response.status === 422) {
        return NextResponse.json(
          {
            error: '이메일 형식이 올바르지 않습니다.',
            detail: errorData.detail,
          },
          { status: 422 }
        );
      }

      // 4-4. 기타 에러
      return NextResponse.json(
        { error: errorData.detail || '로그인에 실패했습니다.' },
        { status: response.status }
      );
    }

    // 5. 성공 응답
    const data = await response.json();

    console.log('[로그인 프록시] 성공:', {
      token_type: data.token_type,
      token_length: data.access_token?.length,
    });

    return NextResponse.json(data);
  } catch (error) {
    // 6. 네트워크 에러 등 예외 처리
    console.error('[로그인 프록시] Exception:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
