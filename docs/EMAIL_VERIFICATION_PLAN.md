# 이메일 인증 회원가입 구현 계획

작성일: 2025-11-27
작성자: Claude & Elfld

---

## 📋 개요

OpenAPI 2.0에서 새로 추가된 이메일 인증 기반 회원가입 플로우를 구현합니다.
기존의 간단한 회원가입(`/users/register`)은 개발용으로 유지하고, 운영용 이메일 인증 플로우를 추가합니다.

---

## 🔍 API 분석

### 새로 추가된 엔드포인트

#### 1. 이메일 인증번호 발송
```
POST /users/email/request-verification
```

**요청:**
```json
{
  "email": "user@example.com"
}
```

**응답:**
- `200 OK`: 인증번호 발송 성공
- `400 Bad Request`: 이미 가입된 이메일
- `500 Internal Server Error`: 이메일 발송 실패

**스키마:**
```typescript
interface EmailRequest {
  email: string; // format: email
}
```

**동작:**
- 사용자 이메일로 6자리 인증번호 발송
- 인증번호 유효기간: **5분**
- 중복 이메일 체크 포함

---

#### 2. 인증번호 검증 및 토큰 발급
```
POST /users/email/verify
```

**요청:**
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**응답:**
```json
{
  "message": "인증 성공",
  "verification_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**에러:**
- `400 Bad Request`: 인증번호 불일치 또는 시간 만료

**스키마:**
```typescript
interface VerificationRequest {
  email: string; // format: email
  code: string;  // 6자리 인증번호
}

interface VerificationResponse {
  message: string;
  verification_token: string; // 10분 유효
}
```

**동작:**
- 입력된 인증번호 검증
- 성공 시 `verification_token` 발급 (10분 유효)
- 이 토큰은 회원가입 시 필수로 제출

---

#### 3. 인증된 회원가입
```
POST /users/register/verified
```

**요청:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "홍길동",
  "contact_info": "010-1234-5678",
  "verification_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**응답:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "홍길동"
}
```

**에러:**
- `400 Bad Request`: 이메일 불일치 또는 중복 가입
- `401 Unauthorized`: 유효하지 않거나 만료된 토큰

**스키마:**
```typescript
interface UserCreateVerified {
  email: string;           // format: email
  password: string;
  name: string;
  contact_info?: string | null;
  verification_token: string; // 필수!
}

interface UserResponse {
  id: number;
  email: string;
  name: string;
}
```

---

## 🎯 구현 계획

### Phase 1: API 프록시 레이어 추가

**생성할 파일:**

1. **`src/app/api/users/email/request-verification/route.ts`**
   ```typescript
   export async function POST(request: Request) {
     const { email } = await request.json();

     const response = await fetch(
       `${process.env.API_BASE_URL}/users/email/request-verification`,
       {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ email }),
       }
     );

     // 200: 성공, 400: 중복 이메일, 500: 이메일 발송 실패
     return Response.json(await response.json(), { status: response.status });
   }
   ```

2. **`src/app/api/users/email/verify/route.ts`**
   ```typescript
   export async function POST(request: Request) {
     const { email, code } = await request.json();

     const response = await fetch(
       `${process.env.API_BASE_URL}/users/email/verify`,
       {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ email, code }),
       }
     );

     // 200: 성공 + verification_token, 400: 인증 실패
     return Response.json(await response.json(), { status: response.status });
   }
   ```

3. **`src/app/api/users/register/verified/route.ts`**
   ```typescript
   export async function POST(request: Request) {
     const body = await request.json();

     const response = await fetch(
       `${process.env.API_BASE_URL}/users/register/verified`,
       {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(body),
       }
     );

     // 200: 성공, 400: 이메일 불일치/중복, 401: 토큰 만료/위조
     return Response.json(await response.json(), { status: response.status });
   }
   ```

**기존 유지:**
- `POST /api/users/register` (개발용) - 그대로 유지

---

### Phase 2: 타입 정의 추가

**파일:** `src/lib/types/auth.ts` (새로 생성)

```typescript
// 이메일 인증번호 요청
export interface EmailRequest {
  email: string;
}

// 인증번호 검증 요청
export interface VerificationRequest {
  email: string;
  code: string;
}

// 인증번호 검증 응답
export interface VerificationResponse {
  message: string;
  verification_token: string;
}

// 인증된 회원가입 요청
export interface UserCreateVerified {
  email: string;
  password: string;
  name: string;
  contact_info?: string | null;
  verification_token: string;
}

// 회원가입 응답 (기존)
export interface UserResponse {
  id: number;
  email: string;
  name: string;
}
```

---

### Phase 3: 회원가입 페이지 리팩토링

**파일:** `src/app/register/page.tsx`

#### 3.1 UI 플로우

```
┌─────────────────────────────────────┐
│  [1] → [2] → [3]                    │ ← 진행 상태 표시
└─────────────────────────────────────┘

[1단계: 이메일 입력]
┌───────────────────────────────────┐
│ 이메일                              │
│ ┌───────────────────────────────┐ │
│ │ user@example.com              │ │
│ └───────────────────────────────┘ │
│                                   │
│          [인증번호 발송]            │
└───────────────────────────────────┘

[2단계: 인증번호 입력]
┌───────────────────────────────────┐
│ 인증번호 (6자리)                    │
│ ┌─┬─┬─┬─┬─┬─┐                   │
│ │1│2│3│4│5│6│                   │
│ └─┴─┴─┴─┴─┴─┘                   │
│                                   │
│ ⏱️ 남은 시간: 04:32                │
│                                   │
│     [확인]      [재발송]           │
└───────────────────────────────────┘

[3단계: 회원정보 입력]
┌───────────────────────────────────┐
│ ✓ 이메일 인증 완료                  │
│ user@example.com                  │
│                                   │
│ 비밀번호                            │
│ ┌───────────────────────────────┐ │
│ │ ●●●●●●●●                      │ │
│ └───────────────────────────────┘ │
│                                   │
│ 비밀번호 확인                       │
│ ┌───────────────────────────────┐ │
│ │ ●●●●●●●●                      │ │
│ └───────────────────────────────┘ │
│                                   │
│ 이름                               │
│ ┌───────────────────────────────┐ │
│ │ 홍길동                          │ │
│ └───────────────────────────────┘ │
│                                   │
│ 연락처 (선택)                       │
│ ┌───────────────────────────────┐ │
│ │ 010-1234-5678                 │ │
│ └───────────────────────────────┘ │
│                                   │
│          [회원가입]                │
└───────────────────────────────────┘
```

#### 3.2 상태 관리

```typescript
'use client';

import { useState, useEffect } from 'react';

type Step = 1 | 2 | 3;

export default function RegisterPage() {
  // 단계 관리
  const [step, setStep] = useState<Step>(1);

  // 1단계: 이메일
  const [email, setEmail] = useState('');

  // 2단계: 인증번호
  const [verificationCode, setVerificationCode] = useState('');
  const [remainingTime, setRemainingTime] = useState(300); // 5분 = 300초
  const [canResend, setCanResend] = useState(false);

  // 3단계: 회원정보
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [verificationToken, setVerificationToken] = useState('');

  // 로딩 & 에러
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ... (구현 코드)
}
```

#### 3.3 타이머 로직

```typescript
// 2단계 진입 시 타이머 시작
useEffect(() => {
  if (step === 2 && remainingTime > 0) {
    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }
}, [step, remainingTime]);

// 시간 포맷팅 (MM:SS)
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
```

#### 3.4 API 호출 함수

```typescript
// 1단계: 인증번호 발송
const handleRequestVerification = async () => {
  setLoading(true);
  setError('');

  try {
    const response = await fetch('/api/users/email/request-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      setStep(2);
      setRemainingTime(300);
      setCanResend(false);
    } else {
      const data = await response.json();
      setError(data.detail || '이메일 발송에 실패했습니다.');
    }
  } catch (err) {
    setError('네트워크 오류가 발생했습니다.');
  } finally {
    setLoading(false);
  }
};

// 2단계: 인증번호 검증
const handleVerifyCode = async () => {
  setLoading(true);
  setError('');

  try {
    const response = await fetch('/api/users/email/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code: verificationCode }),
    });

    if (response.ok) {
      const data = await response.json();
      setVerificationToken(data.verification_token);
      setStep(3);
    } else {
      const data = await response.json();
      setError(data.detail || '인증번호가 올바르지 않습니다.');
    }
  } catch (err) {
    setError('네트워크 오류가 발생했습니다.');
  } finally {
    setLoading(false);
  }
};

// 3단계: 회원가입
const handleRegister = async () => {
  // 비밀번호 일치 검증
  if (password !== passwordConfirm) {
    setError('비밀번호가 일치하지 않습니다.');
    return;
  }

  setLoading(true);
  setError('');

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

    if (response.ok) {
      // 회원가입 성공 → 로그인 페이지로 이동
      router.push('/login?message=회원가입이 완료되었습니다');
    } else {
      const data = await response.json();
      setError(data.detail || '회원가입에 실패했습니다.');
    }
  } catch (err) {
    setError('네트워크 오류가 발생했습니다.');
  } finally {
    setLoading(false);
  }
};
```

---

### Phase 4: 인증번호 입력 컴포넌트

**파일:** `src/components/VerificationCodeInput.tsx` (새로 생성)

```typescript
'use client';

import { useRef, KeyboardEvent, ClipboardEvent } from 'react';

interface VerificationCodeInputProps {
  length: number; // 6
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function VerificationCodeInput({
  length,
  value,
  onChange,
  disabled = false,
}: VerificationCodeInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, digit: string) => {
    if (!/^\d*$/.test(digit)) return; // 숫자만 허용

    const newValue = value.split('');
    newValue[index] = digit;
    onChange(newValue.join(''));

    // 자동 포커스 이동
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length);
    if (/^\d+$/.test(pastedData)) {
      onChange(pastedData.padEnd(length, ' ').slice(0, length));
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-sky-500 focus:outline-none"
        />
      ))}
    </div>
  );
}
```

---

### Phase 5: 환경 변수 설정 (선택)

개발/운영 모드를 분기하려면:

**`.env.local`:**
```bash
# 개발 모드 (기존 간단 회원가입)
NEXT_PUBLIC_USE_EMAIL_VERIFICATION=false

# 운영 모드 (이메일 인증 회원가입)
NEXT_PUBLIC_USE_EMAIL_VERIFICATION=true
```

**회원가입 페이지에서 분기:**
```typescript
const useEmailVerification =
  process.env.NEXT_PUBLIC_USE_EMAIL_VERIFICATION === 'true';

if (useEmailVerification) {
  // 이메일 인증 플로우 (3단계)
  return <EmailVerificationRegister />;
} else {
  // 기존 간단 회원가입 (1단계)
  return <SimpleRegister />;
}
```

---

## 🎨 UI/UX 개선 사항

### 1. 진행 상태 인디케이터
```tsx
<div className="flex justify-center items-center gap-4 mb-8">
  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
    step >= 1 ? 'bg-sky-500 text-white' : 'bg-gray-200'
  }`}>
    {step > 1 ? '✓' : '1'}
  </div>
  <div className="w-16 h-1 bg-gray-200">
    <div className={`h-full transition-all ${
      step >= 2 ? 'w-full bg-sky-500' : 'w-0'
    }`} />
  </div>
  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
    step >= 2 ? 'bg-sky-500 text-white' : 'bg-gray-200'
  }`}>
    {step > 2 ? '✓' : '2'}
  </div>
  <div className="w-16 h-1 bg-gray-200">
    <div className={`h-full transition-all ${
      step >= 3 ? 'w-full bg-sky-500' : 'w-0'
    }`} />
  </div>
  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
    step >= 3 ? 'bg-sky-500 text-white' : 'bg-gray-200'
  }`}>
    3
  </div>
</div>
```

### 2. 타이머 UI
```tsx
<div className={`text-center text-lg font-semibold ${
  remainingTime <= 10 ? 'text-red-500' : 'text-gray-600'
}`}>
  ⏱️ 남은 시간: {formatTime(remainingTime)}
</div>

{remainingTime === 0 && (
  <p className="text-red-500 text-sm mt-2">
    인증번호가 만료되었습니다. 재발송해주세요.
  </p>
)}
```

### 3. 에러 메시지
```tsx
{error && (
  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
    {error}
  </div>
)}
```

### 4. 로딩 상태
```tsx
<button
  onClick={handleRequestVerification}
  disabled={loading || !email}
  className="w-full bg-sky-500 text-white py-3 rounded-lg font-semibold
             hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed
             transition-colors"
>
  {loading ? '발송 중...' : '인증번호 발송'}
</button>
```

---

## 📊 작업 예상 시간

| 작업 | 예상 시간 |
|------|-----------|
| API 프록시 레이어 (3개) | 30분 |
| 타입 정의 추가 | 15분 |
| 인증번호 입력 컴포넌트 | 45분 |
| 회원가입 페이지 리팩토링 | 2시간 |
| 타이머 & 상태 관리 | 1시간 |
| 에러 처리 & UX 개선 | 1시간 |
| 테스트 & 디버깅 | 1시간 |
| **총 예상 시간** | **6.5시간** |

---

## 🔧 추가 고려사항

### 1. 보안
- ✅ 인증번호는 서버에서 검증
- ✅ `verification_token`은 10분 후 자동 만료
- ⚠️ Rate limiting (1분에 3회 이하) - 서버 측 구현 필요
- ⚠️ 인증번호 5회 실패 시 일시적 차단 (선택사항)

### 2. UX
- ✅ 인증번호 자동 완성 (SMS OTP)
- ✅ 붙여넣기 지원
- ✅ 이메일 수정 가능 (1단계로 돌아가기)
- ✅ 뒤로가기 방지 또는 경고

### 3. 접근성
- ✅ 키보드 내비게이션 지원
- ✅ 포커스 관리
- ⚠️ 스크린 리더 지원 (ARIA 레이블 추가)

### 4. 에러 처리
- ✅ 네트워크 오류
- ✅ 인증번호 불일치
- ✅ 시간 만료
- ✅ 이메일 중복
- ✅ 토큰 만료/위조

---

## 🚀 구현 순서

1. **API 프록시 레이어** 3개 생성
2. **타입 정의** 추가 (`src/lib/types/auth.ts`)
3. **인증번호 입력 컴포넌트** 생성
4. **회원가입 페이지** 리팩토링
5. **테스트** 및 디버깅
6. **문서 업데이트**

---

## 📝 참고사항

- 기존 회원가입 API (`/users/register`)는 개발용으로 유지
- 운영 배포 시 환경 변수로 모드 전환 가능
- 이메일 발송은 백엔드에서 처리 (프론트엔드는 API 호출만)
- 인증번호는 6자리 숫자 (서버에서 생성)

---

작성자: Claude & Elfld
최종 수정일: 2025-11-27
