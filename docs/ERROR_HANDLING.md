# 🚨 에러 처리 가이드

> **작성일**: 2025-11-11
> **목적**: 전체 시스템의 에러 처리를 중앙 관리하여 일관된 UX 제공
> **작성자**: Claude (Phase 7.1)

---

## 📋 목차

1. [에러 처리 원칙](#에러-처리-원칙)
2. [HTTP 상태 코드별 처리](#http-상태-코드별-처리)
3. [API 엔드포인트별 에러](#api-엔드포인트별-에러)
4. [클라이언트 사이드 에러](#클라이언트-사이드-에러)
5. [UX 개선 TODO](#ux-개선-todo)

---

## 🎯 에러 처리 원칙

### 1. 사용자 친화적 메시지
- ❌ "Error 422: Validation failed"
- ✅ "입력 형식이 올바르지 않습니다."

### 2. 액션 가능한 피드백
- ❌ "서버 오류"
- ✅ "네트워크 연결을 확인해주세요. [재시도]"

### 3. 일관된 UI
- 모든 에러는 동일한 스타일로 표시
- 위치: 폼 상단 또는 Toast 알림
- 색상: 빨간색 계열 (`text-red-500`, `bg-red-50`)

### 4. 로깅
- 개발 환경: `console.error`로 상세 정보 출력
- 프로덕션: 에러 모니터링 도구로 전송 (추후)

---

## 📊 HTTP 상태 코드별 처리

### 2xx - 성공
| Code | 의미 | 처리 |
|------|------|------|
| 200 OK | 성공 | 정상 응답 처리 |
| 201 Created | 생성 성공 | 정상 응답 처리 |

### 4xx - 클라이언트 에러
| Code | 의미 | 사용자 메시지 | 액션 |
|------|------|---------------|------|
| 400 Bad Request | 잘못된 요청 | "입력 정보가 올바르지 않습니다." | 입력값 재확인 요청 |
| 401 Unauthorized | 인증 실패 | "이메일 또는 비밀번호가 올바르지 않습니다." | 로그인 재시도 |
| 403 Forbidden | 권한 없음 | "접근 권한이 없습니다." | 로그인 페이지로 이동 |
| 404 Not Found | 리소스 없음 | "요청하신 정보를 찾을 수 없습니다." | 이전 페이지로 이동 |
| 409 Conflict | 중복 데이터 | "이미 사용 중인 이메일입니다." | 다른 값 입력 요청 |
| 422 Validation Error | 유효성 검증 실패 | "입력 형식이 올바르지 않습니다." | 구체적인 필드 오류 표시 |

### 5xx - 서버 에러
| Code | 의미 | 사용자 메시지 | 액션 |
|------|------|---------------|------|
| 500 Internal Server Error | 서버 오류 | "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." | 재시도 버튼 |
| 502 Bad Gateway | 게이트웨이 오류 | "서버 연결에 실패했습니다." | 재시도 버튼 |
| 503 Service Unavailable | 서비스 이용 불가 | "서비스가 일시적으로 중단되었습니다." | 재시도 버튼 |

---

## 🔗 API 엔드포인트별 에러

### 1. 회원가입 API (`POST /api/users/register`)

#### 에러 케이스

**409 Conflict - 이메일 중복**
```typescript
{
  error: "이미 사용 중인 이메일입니다.",
  status: 409
}
```
- **표시**: 이메일 입력 필드 아래 빨간색 텍스트
- **액션**: 다른 이메일 입력 요청

**400 Bad Request - 유효성 검증 실패**
```typescript
{
  error: "입력 정보가 올바르지 않습니다.",
  status: 400
}
```
- **표시**: 폼 상단 에러 메시지
- **액션**: 모든 필드 재확인 요청

**422 Validation Error - 필드 형식 오류**
```typescript
{
  error: "입력 형식이 올바르지 않습니다.",
  detail: [...],
  status: 422
}
```
- **표시**: 해당 필드 아래 구체적 오류 메시지
- **예시**: "이메일 형식이 올바르지 않습니다."

**500 Internal Server Error**
```typescript
{
  error: "서버 오류가 발생했습니다.",
  status: 500
}
```
- **표시**: 폼 상단 에러 메시지
- **액션**: "잠시 후 다시 시도해주세요" + 재시도 버튼

---

### 2. 로그인 API (`POST /api/users/login`)

#### 에러 케이스

**401 Unauthorized - 비밀번호 불일치**
```typescript
{
  error: "이메일 또는 비밀번호가 올바르지 않습니다.",
  status: 401
}
```
- **표시**: 폼 상단 에러 메시지
- **보안**: 이메일/비밀번호 중 어느 것이 틀렸는지 명시 안 함
- **액션**: 재입력 요청

**404 Not Found - 사용자 없음**
```typescript
{
  error: "존재하지 않는 사용자입니다.",
  status: 404
}
```
- **표시**: 폼 상단 에러 메시지
- **액션**: 회원가입 링크 제공

**422 Validation Error - 이메일 형식 오류**
```typescript
{
  error: "이메일 형식이 올바르지 않습니다.",
  status: 422
}
```
- **표시**: 이메일 필드 아래 에러 메시지
- **액션**: 올바른 이메일 형식 예시 제공

---

### 3. 분실물 조회 API (`GET /api/items/search`)

#### 에러 케이스

**500 Internal Server Error**
```typescript
{
  error: "Failed to fetch items",
  status: 500
}
```
- **표시**: 메인 페이지 중앙에 에러 메시지
- **액션**: "새로고침" 버튼

**네트워크 에러 (fetch 실패)**
```typescript
{
  error: "네트워크 오류가 발생했습니다.",
}
```
- **표시**: Toast 알림 (우측 상단)
- **액션**: 자동 재시도 (3회)

---

### 4. 개별 분실물 조회 API (`GET /api/items/[id]`)

#### 에러 케이스

**404 Not Found - 분실물 없음**
```typescript
{
  error: "Item not found",
  status: 404
}
```
- **현재 메시지**: "분실물을 찾을 수 없습니다."
- **표시**: 페이지 중앙
- **액션**: "돌아가기" 버튼 (router.back())

**500 Internal Server Error**
```typescript
{
  error: "Failed to fetch item",
  status: 500
}
```
- **현재 메시지**: "분실물 정보를 불러오는데 실패했습니다."
- **표시**: 페이지 중앙
- **액션**: "재시도" 버튼

---

### 5. 소유권 주장 API (`POST /api/items/[id]/claim`) - 미구현

#### 예상 에러 케이스

**401 Unauthorized - 인증 토큰 없음/만료**
```typescript
{
  error: "로그인이 필요합니다.",
  status: 401
}
```
- **표시**: Toast 알림
- **액션**: 로그인 페이지로 자동 이동 (3초 후)

**409 Conflict - 이미 주장된 분실물**
```typescript
{
  error: "이미 소유권이 주장된 분실물입니다.",
  status: 409
}
```
- **표시**: 모달 팝업
- **액션**: "확인" 버튼 → 메인 페이지 이동

**400 Bad Request - 본인 분실물 주장 불가 (있을 경우)**
```typescript
{
  error: "본인의 분실물입니다.",
  status: 400
}
```
- **표시**: 모달 팝업
- **액션**: "확인" 버튼 → 이전 페이지

---

### 6. 내 예약 목록 API (`GET /api/items/me`) - 미구현

#### 예상 에러 케이스

**401 Unauthorized**
```typescript
{
  error: "로그인이 필요합니다.",
  status: 401
}
```
- **표시**: 마이페이지 중앙
- **액션**: "로그인" 버튼 → 로그인 페이지

**500 Internal Server Error**
```typescript
{
  error: "내 예약 목록을 불러오는데 실패했습니다.",
  status: 500
}
```
- **표시**: 마이페이지 중앙
- **액션**: "재시도" 버튼

---

## 💻 클라이언트 사이드 에러

### 1. 네트워크 에러

**fetch 실패 (서버 연결 불가)**
```typescript
try {
  const response = await fetch('/api/...');
} catch (error) {
  // NetworkError, TypeError 등
  return "네트워크 연결을 확인해주세요.";
}
```
- **표시**: Toast 알림
- **액션**: 자동 재시도 (최대 3회, exponential backoff)

### 2. 유효성 검증 에러 (클라이언트)

**이메일 형식 검증**
```typescript
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  return "올바른 이메일 형식이 아닙니다.";
}
```
- **표시**: 필드 아래 빨간색 텍스트
- **타이밍**: onChange 또는 onBlur

**비밀번호 길이 검증**
```typescript
if (password.length < 6) {
  return "비밀번호는 최소 6자 이상이어야 합니다.";
}
```
- **표시**: 필드 아래 빨간색 텍스트

**필수 필드 검증**
```typescript
if (!name.trim()) {
  return "이름을 입력해주세요.";
}
```
- **표시**: 필드 아래 빨간색 텍스트

### 3. 인증 토큰 만료

**401 응답 시 자동 로그아웃**
```typescript
if (response.status === 401) {
  localStorage.removeItem('access_token');
  router.push('/login?redirect=' + encodeURIComponent(currentPath));
}
```
- **표시**: Toast 알림 "세션이 만료되었습니다. 다시 로그인해주세요."
- **액션**: 로그인 페이지로 이동 (현재 경로 저장)

---

## 🎨 UX 개선 TODO

### Phase 7.5: 에러 처리 개선 (계획)

#### 1. Toast 알림 시스템 도입

**라이브러리 후보**:
- `react-hot-toast` (추천)
- `sonner`
- `react-toastify`

**사용 케이스**:
- 로그인 성공: "환영합니다, {name}님!" (초록색)
- 로그아웃: "로그아웃 되었습니다." (회색)
- 네트워크 에러: "네트워크 연결을 확인해주세요." (빨간색)
- API 에러: "작업에 실패했습니다. 다시 시도해주세요." (빨간색)

**장점**:
- 사용자가 폼을 벗어나도 알림 확인 가능
- 자동으로 사라짐 (3초)
- 여러 알림 동시 표시 가능

#### 2. 재시도 로직 구현

**Exponential Backoff**:
```typescript
async function fetchWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      if (response.status < 500) throw new Error('Client error');
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 2 ** i * 1000));
    }
  }
}
```

**적용 대상**:
- 5xx 서버 에러
- 네트워크 에러

#### 3. 에러 바운더리 (Error Boundary)

**React Error Boundary 도입**:
```typescript
// components/ErrorBoundary.tsx
class ErrorBoundary extends React.Component {
  componentDidCatch(error, info) {
    // 에러 로깅
    console.error('Uncaught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

**Fallback UI**:
- "문제가 발생했습니다" 메시지
- "새로고침" 버튼
- "메인 페이지로 이동" 버튼

#### 4. 필드별 에러 메시지

**현재**:
```typescript
{error && <p className="text-red-500">{error}</p>}
```

**개선안**:
```typescript
{errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
{errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
{errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
```

**장점**:
- 어떤 필드에 문제가 있는지 명확
- 여러 필드의 에러를 동시에 표시 가능

#### 5. 로딩 상태 개선

**Skeleton UI**:
- 로딩 중에 빈 화면 대신 회색 박스 표시
- 사용자가 콘텐츠가 로딩 중임을 인지

**Spinner 위치**:
- 버튼 내부: "로그인 중..."
- 페이지 전체: 중앙 스피너

#### 6. 친절한 에러 메시지

**현재**:
```
"이메일 형식이 올바르지 않습니다."
```

**개선안**:
```
"이메일 형식이 올바르지 않습니다. (예: user@example.com)"
```

**현재**:
```
"서버 오류가 발생했습니다."
```

**개선안**:
```
"일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
문제가 계속되면 관리자에게 문의해주세요."
```

#### 7. 에러 추적 및 모니터링

**도구**:
- Sentry (추천)
- LogRocket
- Datadog

**수집 정보**:
- 에러 메시지
- 스택 트레이스
- 사용자 정보 (익명화)
- 브라우저/OS 정보
- 재현 경로

---

## 📝 에러 메시지 스타일 가이드

### 컴포넌트 예시

**폼 상단 에러**:
```tsx
{error && (
  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
    <p className="text-red-700 text-sm">{error}</p>
  </div>
)}
```

**필드별 에러**:
```tsx
<input
  className={`border ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
/>
{errors.email && (
  <p className="mt-1 text-red-500 text-sm">{errors.email}</p>
)}
```

**Toast 알림** (react-hot-toast):
```tsx
import toast from 'react-hot-toast';

// 성공
toast.success('로그인 성공!');

// 에러
toast.error('로그인에 실패했습니다.');

// 로딩
const loadingToast = toast.loading('처리 중...');
// ...
toast.dismiss(loadingToast);
```

---

## 🔍 테스트 시나리오

### 회원가입
- [ ] 이메일 형식 오류 → 클라이언트 검증 메시지
- [ ] 중복 이메일 → 409 에러 메시지
- [ ] 비밀번호 6자 미만 → 클라이언트 검증 메시지
- [ ] 네트워크 오류 → 재시도 또는 에러 메시지
- [ ] 서버 오류 → 500 에러 메시지

### 로그인
- [ ] 잘못된 비밀번호 → 401 에러 메시지
- [ ] 존재하지 않는 이메일 → 404 에러 메시지
- [ ] 빈 필드 → 클라이언트 검증 메시지

### 분실물 조회
- [ ] 존재하지 않는 ID → 404 에러 메시지
- [ ] 서버 오류 → 500 에러 메시지
- [ ] 네트워크 오류 → 네트워크 에러 메시지

### 소유권 주장
- [ ] 로그인 안 함 → 401 에러 → 로그인 페이지 이동
- [ ] 이미 주장된 분실물 → 409 에러 메시지
- [ ] 서버 오류 → 500 에러 메시지

---

## 📌 참고 자료

- [HTTP 상태 코드 MDN 문서](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [사용자 친화적 에러 메시지 작성법](https://uxdesign.cc/how-to-write-good-error-messages-858e4551cd4)
- [React Error Boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)

---

**마지막 업데이트**: 2025-11-11
**다음 리뷰**: Phase 7.5 구현 시
