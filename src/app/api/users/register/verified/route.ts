import { NextRequest, NextResponse } from 'next/server';

/**
 * 인증된 회원가입 API 프록시
 *
 * OpenAPI 명세:
 * - Endpoint: POST /users/register/verified
 * - Request: UserCreateVerified { email, password, name, contact_info?, verification_token }
 * - Response: UserResponse { id, email, name }
 *
 * 동작:
 * - verification_token으로 이메일 인증 확인
 * - 인증된 사용자만 회원가입 가능
 * - 토큰 유효기간: 10분
 *
 * 에러 처리:
 * - 400 Bad Request: 이메일 불일치 또는 중복 가입
 * - 401 Unauthorized: 유효하지 않거나 만료된 토큰
 * - 422 Validation Error: 필드 형식 오류
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
    const externalUrl = `${apiBaseUrl}/users/register/verified`;

    console.log('[인증된 회원가입 프록시] 외부 API 호출:', externalUrl);
    console.log('[인증된 회원가입 프록시] Request Body:', {
      email: body.email,
      name: body.name,
      contact_info: body.contact_info,
      has_verification_token: !!body.verification_token,
      // password와 verification_token은 로그 출력 안 함 (보안)
    });

    const response = await fetch(externalUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
        name: body.name,
        contact_info: body.contact_info || null,
        verification_token: body.verification_token,
      }),
    });

    // 4. 에러 처리
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      console.error('[인증된 회원가입 프록시] 외부 API 에러:', {
        status: response.status,
        error: errorData,
      });

      // 4-1. 400 Bad Request: 이메일 불일치 또는 중복
      if (response.status === 400) {
        return NextResponse.json(
          {
            error:
              errorData.detail ||
              '이메일이 일치하지 않거나 이미 가입된 이메일입니다.',
          },
          { status: 400 }
        );
      }

      // 4-2. 401 Unauthorized: 토큰 만료 또는 위조
      if (response.status === 401) {
        return NextResponse.json(
          {
            error:
              errorData.detail ||
              '인증 토큰이 유효하지 않거나 만료되었습니다. 다시 인증해주세요.',
          },
          { status: 401 }
        );
      }

      // 4-3. 422 Validation Error: 필드 형식 오류
      if (response.status === 422) {
        return NextResponse.json(
          {
            error: '입력 형식이 올바르지 않습니다.',
            detail: errorData.detail,
          },
          { status: 422 }
        );
      }

      // 4-4. 기타 에러
      return NextResponse.json(
        { error: errorData.detail || '회원가입에 실패했습니다.' },
        { status: response.status }
      );
    }

    // 5. 성공 응답
    const data = await response.json();

    console.log('[인증된 회원가입 프록시] 성공:', {
      id: data.id,
      email: data.email,
      name: data.name,
    });

    return NextResponse.json(data);
  } catch (error) {
    // 6. 네트워크 에러 등 예외 처리
    console.error('[인증된 회원가입 프록시] Exception:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
