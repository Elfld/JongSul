import { NextRequest, NextResponse } from 'next/server';

/**
 * 회원가입 API 프록시
 *
 * OpenAPI 명세:
 * - Endpoint: POST /users/register
 * - Request: UserCreate { email, password, name, contact_info? }
 * - Response: UserResponse { id, email, name }
 *
 * 주의: access_token은 반환되지 않음 (로그인 필요)
 *
 * 에러 처리:
 * - 409 Conflict: 이메일 중복
 * - 400 Bad Request: 유효성 검증 실패
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
    const externalUrl = `${apiBaseUrl}/users/register`;

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
      }),
    });

    // 4. 에러 처리
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // 4-1. 409 Conflict: 이메일 중복
      if (response.status === 409) {
        return NextResponse.json(
          { error: '이미 사용 중인 이메일입니다.' },
          { status: 409 }
        );
      }

      // 4-2. 400 Bad Request: 유효성 검증 실패
      if (response.status === 400) {
        return NextResponse.json(
          { error: '입력 정보가 올바르지 않습니다.' },
          { status: 400 }
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

    return NextResponse.json(data);
  } catch {
    // 6. 네트워크 에러 등 예외 처리
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
