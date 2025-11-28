# 이메일 인증 회원가입 구현 기록

작성일: 2025-11-27
브랜치: `claude/email-verification-013XWjudsHGt33Yg9sXFRWLn`

---

## 📋 구현 개요

OpenAPI 2.0의 이메일 인증 회원가입 플로우를 구현했습니다.

### 플로우

```
1. 이메일 입력 → [인증요청] 클릭
   └─ POST /api/users/email/request-verification
   └─ 이메일로 6자리 인증번호 발송 (5분 유효)

2. 인증번호 6자리 입력
   └─ POST /api/users/email/verify
   └─ verification_token 발급 (10분 유효)
   └─ 자동 검증 (6자리 완성 시)

3. 나머지 정보 입력 → [회원가입]
   └─ POST /api/users/register/verified
   └─ verification_token과 함께 회원가입
```

---

## 🔧 구현 내용

### 1. API 프록시 레이어 (3개)

```
src/app/api/users/email/
├── request-verification/route.ts  # 인증번호 발송
├── verify/route.ts                # 인증번호 검증
└── register/verified/route.ts     # 인증된 회원가입
```

### 2. 타입 정의

**파일:** `src/lib/types/auth.ts`

```typescript
export interface EmailRequest {
  email: string;
}

export interface VerificationRequest {
  email: string;
  code: string;
}

export interface VerificationResponse {
  message: string;
  verification_token: string;
}

export interface UserCreateVerified {
  email: string;
  password: string;
  name: string;
  contact_info?: string | null;
  verification_token: string;
}
```

### 3. UI 수정

**파일:** `src/app/register/page.tsx`

```
📧 이메일 주소     [인증요청]  ← 버튼 추가
🔢 인증번호(6자리)            ← 필드 추가 (아이콘 없음)
🔒 비밀번호
🔒 비밀번호 확인
👤 이름
📱 연락처 (선택)
      [회원가입]
```

**주요 기능:**
- 6자리 숫자만 입력 가능
- 6자리 완성 시 자동 검증
- 인증 실패 시 인증번호만 초기화 (다른 필드 유지)
- 인증 완료 전 회원가입 버튼 비활성화

---

## 🐛 발생한 문제와 해결

### 문제 1: React 렌더링 에러

```
Objects are not valid as a React child (found: object with keys {type, loc, msg, input, ctx})
```

**원인:**
백엔드 에러 응답에 객체/배열이 포함되는데, React가 이를 직접 렌더링 시도

**해결:**
`typeof` 체크로 문자열만 렌더링

```tsx
{typeof error === 'string' ? error : '오류가 발생했습니다. 다시 시도해주세요.'}
```

---

### 문제 2: 백엔드 에러 응답 형식 불일치

**초기 가정:**
OpenAPI 명세에 `detail` 필드 사용

**실제 백엔드 응답:**

#### 400 에러
```json
{
  "error": "인증 시간이 만료되었거나 잘못된 요청입니다."
}
```
✅ `error` 필드 (detail 아님!)
✅ 문자열

#### 422 Validation Error
```json
{
  "error": [
    {
      "type": "value_error",
      "loc": ["body", "email"],
      "msg": "value is not a valid email address: An email address must have an @-sign.",
      "input": "",
      "ctx": {
        "reason": "An email address must have an @-sign."
      }
    }
  ]
}
```
✅ `error` 필드 (detail 아님!)
✅ 배열

**해결:**
`formatBackendError()` 함수 구현

```typescript
function formatBackendError(errorData: any, fallback: string): string {
  // error 필드가 문자열
  if (typeof errorData?.error === 'string') {
    return errorData.error;
  }

  // error 필드가 배열 (422 validation error)
  if (Array.isArray(errorData?.error)) {
    const messages = errorData.error
      .map((e: any) => e.msg || '')
      .filter((msg: string) => msg.length > 0);
    return messages.length > 0 ? messages.join(', ') : fallback;
  }

  // 기본값
  return fallback;
}
```

**적용:**
3개 API 프록시 모두 동일한 함수 적용

```typescript
const errorMessage = formatBackendError(
  errorData,
  '인증번호 확인에 실패했습니다.'
);

return NextResponse.json({ error: errorMessage }, { status: response.status });
```

---

## 📊 커밋 히스토리

### 1. c5de1bf - feat: 이메일 인증 회원가입 구현

```diff
+ src/app/api/users/email/request-verification/route.ts
+ src/app/api/users/email/verify/route.ts
+ src/app/api/users/register/verified/route.ts
+ src/lib/types/auth.ts
M src/app/register/page.tsx
```

- API 프록시 3개 생성
- 회원가입 페이지에 이메일 인증 기능 추가
- 타입 정의 추가

### 2. 7a51dba - fix: 에러 메시지 렌더링 오류 방지

```diff
M src/app/register/page.tsx
```

- React 객체 렌더링 에러 방지 (typeof 체크)
- 에러 응답 디버깅용 콘솔 로그 추가

### 3. 1e39994 - fix: 백엔드 에러 응답 형식 처리 개선

```diff
M src/app/api/users/email/request-verification/route.ts
M src/app/api/users/email/verify/route.ts
M src/app/api/users/register/verified/route.ts
```

- formatBackendError 함수 추가 (3개 파일 공통)
- error 필드 처리 (detail → error 변경)
- 400/422 에러 형식 대응

---

## 🧪 테스트 방법

### 환경 설정

`.env.local`:
```
API_BASE_URL=https://skubr5x2p0.execute-api.us-west-2.amazonaws.com/main
```

### 테스트 시나리오

1. **개발 서버 실행**
   ```bash
   npm run dev
   ```

2. **회원가입 페이지 접속**
   ```
   http://localhost:3000/register
   ```

3. **정상 플로우**
   - 이메일 입력 → 인증요청
   - 이메일에서 6자리 코드 확인
   - 인증번호 입력 (자동 검증)
   - ✓ 인증완료 표시 확인
   - 나머지 정보 입력 → 회원가입

4. **에러 케이스**
   - 잘못된 이메일 형식 (422 에러)
   - 틀린 인증번호 (400 에러)
   - 시간 만료된 인증번호 (400 에러)

### 에러 응답 확인

F12 → Console 탭:
```
[인증 에러 응답] { error: "..." }
```

F12 → Network 탭:
- `/api/users/email/verify` 응답 확인
- Status: 400 또는 422
- Response body 확인

---

## 📝 주요 코드 스니펫

### 인증번호 자동 검증

```typescript
const handleVerificationCodeChange = async (code: string) => {
  const numericCode = code.replace(/\D/g, '').slice(0, 6);
  setVerificationCode(numericCode);

  // 6자리가 되면 자동으로 검증
  if (numericCode.length === 6) {
    setError('');
    setVerifyingEmail(true);

    try {
      const response = await fetch('/api/users/email/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: numericCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setVerificationToken(data.verification_token);
        setIsEmailVerified(true);
        setError('');
      } else {
        console.log('[인증 에러 응답]', data);
        setError(data.error || '인증번호가 올바르지 않습니다.');
        // 인증번호만 초기화
        setVerificationCode('');
        setIsEmailVerified(false);
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.');
      setVerificationCode('');
      setIsEmailVerified(false);
    } finally {
      setVerifyingEmail(false);
    }
  }
};
```

### 회원가입 제출

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

  // 이메일 인증 확인
  if (!isEmailVerified) {
    setError('이메일 인증을 완료해주세요.');
    return;
  }

  // 비밀번호 일치 확인
  if (password !== passwordConfirm) {
    setError('비밀번호가 일치하지 않습니다.');
    return;
  }

  setLoading(true);

  try {
    const response = await fetch('/api/users/register/verified', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        name,
        contact_info: contactInfo || null,
        verification_token: verificationToken,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      router.push('/login?message=회원가입이 완료되었습니다. 로그인해주세요.');
    } else {
      setError(data.error || '회원가입에 실패했습니다.');
    }
  } catch (err) {
    setError('네트워크 오류가 발생했습니다.');
  } finally {
    setLoading(false);
  }
};
```

---

## ✅ 완료 체크리스트

- [x] API 프록시 3개 생성
- [x] 타입 정의 추가
- [x] 회원가입 UI 수정
- [x] 6자리 숫자 입력 처리
- [x] 자동 검증 구현
- [x] 에러 처리 (400, 422)
- [x] React 렌더링 에러 방지
- [x] 백엔드 응답 형식 처리
- [x] 인증 실패 시 인증번호만 초기화
- [x] 빌드 테스트 통과
- [x] 커밋 & 푸시 완료

---

## 🔗 관련 링크

- **PR:** https://github.com/Elfld/JongSul/pull/new/claude/email-verification-013XWjudsHGt33Yg9sXFRWLn
- **브랜치:** `claude/email-verification-013XWjudsHGt33Yg9sXFRWLn`
- **OpenAPI 명세:** `/openapi2.json`

---

## 💡 알게 된 것

1. **OpenAPI 명세와 실제 응답 불일치**
   - 명세에 없는 필드가 올 수 있음
   - 실제 테스트로 확인 필수

2. **FastAPI 에러 응답 구조**
   - 422: `{ error: [{ msg, type, loc, ... }] }` 배열
   - 400: `{ error: "문자열" }` 직접 문자열

3. **React 렌더링 제약**
   - 객체/배열을 직접 렌더링 불가
   - typeof 체크로 방어적 프로그래밍 필요

4. **방어적 에러 처리**
   - API 프록시에서 정리하면 프론트엔드 부담 감소
   - 일관된 응답 형식 유지 중요
