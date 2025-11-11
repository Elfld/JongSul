# 🔐 인증 시스템 구현 분석

> **작성일**: 2025-11-11
> **목적**: 회원가입/로그인 API 구현 방식과 서버 동작 흐름 분석

---

## 📊 현재 아키텍처 (3-Layer Proxy Pattern)

```
┌─────────────┐      ┌──────────────────┐      ┌─────────────────┐
│  Browser    │ ───► │  Next.js API     │ ───► │  External API   │
│  (Client)   │      │  Route (Proxy)   │      │  Server         │
└─────────────┘      └──────────────────┘      └─────────────────┘
    fetch()              fetch()                   FastAPI
    /api/users/login     API_BASE_URL +           /main/users/login
                         /main/users/login
```

### Layer 1: 클라이언트 (브라우저)
- **위치**: `src/lib/contexts/AuthContext.tsx`, `src/app/login/page.tsx`
- **역할**: 사용자 입력 받기, UI 표시
- **통신**: `fetch('/api/users/login', { ... })`

### Layer 2: Next.js API Route (프록시)
- **위치**: `src/app/api/users/login/route.ts`
- **역할**:
  - 클라이언트 요청을 외부 API로 중계
  - API_BASE_URL 환경변수 보호 (클라이언트에 노출 안 됨)
  - 에러 처리 및 응답 가공
- **통신**: `fetch(API_BASE_URL + '/main/users/login', { ... })`

### Layer 3: 외부 API 서버
- **위치**: `API_BASE_URL` (환경변수)
- **역할**: 실제 비즈니스 로직 처리 (DB 조회, 토큰 생성 등)
- **기술**: FastAPI (Python)

---

## 🔍 OpenAPI 명세 분석

### 1. 회원가입 API

**엔드포인트**: `POST /users/register`

**전체 URL 구성**:
```
API_BASE_URL + /main/users/register
             ↑ servers[0].url
```

**Request Body** (`UserCreate` schema):
```json
{
  "email": "user@example.com",      // required, format: email
  "password": "password123",         // required, string
  "name": "홍길동",                   // required, string
  "contact_info": "010-1234-5678"   // optional, string | null
}
```

**Response** (`UserResponse` schema):
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "홍길동"
}
```

**⚠️ 중요**:
- ❌ Response에 `access_token` 없음!
- ❌ 회원가입 후 자동 로그인 불가
- ✅ 회원가입 성공 → 로그인 페이지 이동 필요

---

### 2. 로그인 API

**엔드포인트**: `POST /users/login`

**전체 URL 구성**:
```
API_BASE_URL + /main/users/login
```

**Request Body** (`UserLogin` schema):
```json
{
  "email": "user@example.com",  // required, format: email
  "password": "password123"      // required, string
}
```

**Response** (`Token` schema):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**⚠️ 중요**:
- ❌ Response에 `user` 정보 없음! (id, email, name 등)
- ✅ `access_token`과 `token_type`만 반환
- 💡 사용자 정보가 필요하면 별도 API 호출 필요 (현재 명세에는 없음)

---

### 3. Protected API 인증 방식

**Security Scheme** (`APIKeyHeader`):
```yaml
securitySchemes:
  APIKeyHeader:
    type: apiKey
    in: header
    name: Authorization
```

**사용 방법**:
```typescript
fetch('/api/items/123/claim', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${access_token}`
    //               ↑ Bearer prefix 필요!
  }
})
```

**Protected API 목록**:
- POST `/items/{item_id}/claim` - 소유권 주장
- GET `/items/me` - 내 예약 목록
- GET `/items/me/{item_id}` - 내 예약 상세

---

## 🚀 구현 전략

### 전략 1: 회원가입 후 자동 로그인 (권장)

**장점**: 사용자 경험 최고
**단점**: API 2번 호출 필요

```typescript
async function register(email, password, name, contact_info) {
  // 1단계: 회원가입
  const registerRes = await fetch('/api/users/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name, contact_info })
  });

  if (!registerRes.ok) throw new Error('회원가입 실패');

  // 2단계: 자동 로그인
  const loginRes = await fetch('/api/users/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });

  const { access_token } = await loginRes.json();

  // 3단계: 토큰 저장
  localStorage.setItem('access_token', access_token);
}
```

### 전략 2: 회원가입 후 로그인 페이지 이동 (단순)

**장점**: 구현 간단
**단점**: 사용자가 다시 로그인해야 함

```typescript
async function register(email, password, name, contact_info) {
  const res = await fetch('/api/users/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name, contact_info })
  });

  if (res.ok) {
    router.push('/login?message=회원가입 완료. 로그인해주세요');
  }
}
```

**✅ 최종 선택**: **전략 1 (자동 로그인)** 채택

---

## 🛠️ 구현 상세

### Step 1: API 프록시 구현

#### `/api/users/register/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const apiBaseUrl = process.env.API_BASE_URL;

    // 외부 API 호출
    const response = await fetch(`${apiBaseUrl}/main/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.detail || '회원가입 실패' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: '서버 오류' },
      { status: 500 }
    );
  }
}
```

**에러 처리**:
- `409 Conflict`: 이메일 중복
- `400 Bad Request`: 유효성 검증 실패
- `422 Validation Error`: 필드 형식 오류

#### `/api/users/login/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const apiBaseUrl = process.env.API_BASE_URL;

    // 외부 API 호출
    const response = await fetch(`${apiBaseUrl}/main/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.detail || '로그인 실패' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: '서버 오류' },
      { status: 500 }
    );
  }
}
```

**에러 처리**:
- `401 Unauthorized`: 비밀번호 불일치
- `404 Not Found`: 사용자 없음

---

### Step 2: AuthContext 구현

**수정 사항**:
- ❌ 기존: 회원가입 응답에서 `access_token` 받는다고 가정
- ✅ 수정: 회원가입 후 자동으로 로그인 API 호출

```typescript
async function register(email, password, name, phone) {
  // 1. 회원가입
  const registerRes = await fetch('/api/users/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      name,
      contact_info: phone
    }),
  });

  if (!registerRes.ok) {
    const errorData = await registerRes.json();
    throw new Error(errorData.error || '회원가입 실패');
  }

  // 2. 자동 로그인
  await login(email, password);
}

async function login(email, password) {
  const loginRes = await fetch('/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!loginRes.ok) {
    const errorData = await loginRes.json();
    throw new Error(errorData.error || '로그인 실패');
  }

  const { access_token } = await loginRes.json();

  // 3. 토큰 저장
  setToken(access_token);
  localStorage.setItem('access_token', access_token);

  // 참고: user 정보는 별도로 관리하거나
  // 현재는 email만 저장 (서버에서 user 정보 안 줌)
  setUser({ email }); // 임시 - 나중에 user info API 필요
}
```

---

### Step 3: Protected API 호출 시 토큰 추가

**ApiClient 개선** (`src/lib/api/client.ts`):

```typescript
export class ApiClient {
  // 토큰 가져오기
  private static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  }

  // POST with Auth
  static async postWithAuth<T>(endpoint: string, body: unknown): Promise<T> {
    const url = new URL(endpoint, window.location.origin);
    const token = this.getToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Bearer 토큰 추가
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status === 401) {
        // 인증 만료 처리
        localStorage.removeItem('access_token');
        window.location.href = '/login';
      }
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }
}
```

---

## 📝 서버 동작 흐름 요약

### 회원가입 플로우
```
1. 사용자 입력 (email, password, name, phone)
   ↓
2. Browser → fetch('/api/users/register')
   ↓
3. Next.js API Route → fetch(API_BASE_URL + '/main/users/register')
   ↓
4. External API → DB에 사용자 저장
   ↓
5. External API → { id, email, name } 반환
   ↓
6. Next.js API Route → 클라이언트로 전달
   ↓
7. AuthContext → 자동으로 login() 호출
   ↓
8. Browser → fetch('/api/users/login')
   ↓
9. External API → { access_token, token_type } 반환
   ↓
10. AuthContext → localStorage에 토큰 저장
```

### 로그인 플로우
```
1. 사용자 입력 (email, password)
   ↓
2. Browser → fetch('/api/users/login')
   ↓
3. Next.js API Route → fetch(API_BASE_URL + '/main/users/login')
   ↓
4. External API → DB에서 사용자 확인, JWT 생성
   ↓
5. External API → { access_token, token_type } 반환
   ↓
6. AuthContext → localStorage에 토큰 저장
   ↓
7. router.push('/') → 메인 페이지 이동
```

### Protected API 호출 플로우 (예: 소유권 주장)
```
1. 사용자가 "동의" 버튼 클릭
   ↓
2. Browser → fetch('/api/items/123/claim', {
               headers: { Authorization: 'Bearer xxx' }
             })
   ↓
3. Next.js API Route → fetch(API_BASE_URL + '/main/items/123/claim', {
                           headers: { Authorization: 'Bearer xxx' }
                         })
   ↓
4. External API → JWT 검증 → DB에 claim 저장
   ↓
5. External API → { item, pickup_code } 반환
   ↓
6. Browser → 수령 코드 화면 표시
```

---

## ⚠️ 주의사항

### 1. OpenAPI 명세와 실제 응답 차이
- 명세에는 user 정보가 로그인 응답에 없음
- 실제 구현 시 백엔드 팀 확인 필요

### 2. 토큰 저장 위치
- **localStorage**: 새로고침 후에도 유지
- **단점**: XSS 공격에 취약
- **대안**: httpOnly 쿠키 (백엔드 수정 필요)

### 3. 토큰 만료 처리
- 401 응답 시 자동 로그아웃 + 로그인 페이지 이동
- Refresh Token 구현 필요 시 백엔드 협의

### 4. API_BASE_URL 설정
- `.env.local` 파일에 추가:
  ```bash
  API_BASE_URL=http://localhost:8000
  # 또는
  API_BASE_URL=https://api.example.com
  ```

---

## ✅ 다음 단계

1. ✅ API 프록시 구현 (`/api/users/register`, `/api/users/login`)
2. ✅ AuthContext 수정 (자동 로그인 로직)
3. ✅ 로그인/회원가입 페이지 UI
4. ✅ Header에 로그인/로그아웃 버튼
5. ✅ Protected API 호출 시 토큰 추가
6. ✅ 빌드 및 테스트

---

**마지막 업데이트**: 2025-11-11
