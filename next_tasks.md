# 🚀 Next Tasks - 로그인/회원가입 구현

> **현재 작업**: Phase 7.1 - 인증 시스템 구현
> **목표**: 로그인/회원가입 기능 완성 후 Protected API 연동 준비

---

## 📋 작업 순서

### Step 1: 인증 API 엔드포인트 구현

#### 1.1 회원가입 API 프록시 (`/api/users/register`)
**파일**: `src/app/api/users/register/route.ts` (새 파일)

**구현 내용**:
```typescript
POST /api/users/register
Body: { email, password, name, phone }
Response: { access_token, user: { id, email, name, phone } }
```

**작업**:
- [ ] `src/app/api/users/register/route.ts` 생성
- [ ] POST 핸들러 구현
- [ ] API_BASE_URL + `/users/register`로 프록시
- [ ] 에러 처리 (409 중복 이메일, 400 유효성 검증 실패)
- [ ] 성공 시 access_token + user 정보 반환

#### 1.2 로그인 API 프록시 (`/api/users/login`)
**파일**: `src/app/api/users/login/route.ts` (새 파일)

**구현 내용**:
```typescript
POST /api/users/login
Body: { email, password }
Response: { access_token, user: { id, email, name, phone } }
```

**작업**:
- [ ] `src/app/api/users/login/route.ts` 생성
- [ ] POST 핸들러 구현
- [ ] API_BASE_URL + `/users/login`으로 프록시
- [ ] 에러 처리 (401 인증 실패, 404 사용자 없음)
- [ ] 성공 시 access_token + user 정보 반환

---

### Step 2: 인증 상태 관리 구현

#### 2.1 AuthContext 생성
**파일**: `src/lib/contexts/AuthContext.tsx` (새 파일)

**구현 내용**:
- [ ] User 타입 정의 (id, email, name, phone)
- [ ] AuthContextType 인터페이스 정의
  - user: User | null
  - token: string | null
  - isAuthenticated: boolean
  - login(email, password): Promise<void>
  - register(email, password, name, phone): Promise<void>
  - logout(): void
  - isLoading: boolean
- [ ] AuthProvider 컴포넌트 구현
  - useState로 user, token, isLoading 관리
  - useEffect로 localStorage에서 토큰 로드
  - login 함수: /api/users/login 호출 → token/user 저장
  - register 함수: /api/users/register 호출 → token/user 저장
  - logout 함수: state 초기화 + localStorage 삭제
- [ ] useAuth 커스텀 훅 export

#### 2.2 RootLayout에 AuthProvider 추가
**파일**: `src/app/layout.tsx`

**작업**:
- [ ] AuthProvider import
- [ ] children을 AuthProvider로 감싸기
- [ ] suppressHydrationWarning 유지

---

### Step 3: 로그인 페이지 UI 구현

**파일**: `src/app/login/page.tsx` (새 파일)

**구현 내용**:
- [ ] 'use client' 선언
- [ ] useAuth() 훅 사용
- [ ] 이메일/비밀번호 입력 폼
- [ ] 로그인 버튼 (handleLogin 함수 연결)
- [ ] 에러 메시지 표시 (useState로 관리)
- [ ] 로딩 상태 표시
- [ ] 회원가입 링크 (→ /register)
- [ ] 로그인 성공 시 router.push('/') 또는 이전 페이지
- [ ] 이미 로그인된 상태면 자동으로 메인 페이지 이동

**디자인**:
- 중앙 정렬 레이아웃
- Tailwind CSS 사용 (기존 스타일 통일)
- 간결한 폼 (이메일, 비밀번호, 버튼)

---

### Step 4: 회원가입 페이지 UI 구현

**파일**: `src/app/register/page.tsx` (새 파일)

**구현 내용**:
- [ ] 'use client' 선언
- [ ] useAuth() 훅 사용
- [ ] 이메일/비밀번호/이름/연락처 입력 폼
- [ ] 회원가입 버튼 (handleRegister 함수 연결)
- [ ] 에러 메시지 표시
- [ ] 로딩 상태 표시
- [ ] 로그인 링크 (→ /login)
- [ ] 유효성 검증 (클라이언트 사이드)
  - 이메일 형식 확인
  - 비밀번호 길이 확인 (최소 6자 이상)
  - 연락처 형식 확인
- [ ] 회원가입 성공 시 자동 로그인 → 메인 페이지 이동

**디자인**:
- 로그인 페이지와 통일된 디자인
- 중앙 정렬 레이아웃
- 입력 필드 4개 (이메일, 비밀번호, 이름, 연락처)

---

### Step 5: Header 컴포넌트에 로그인/로그아웃 버튼 추가

**파일**: `src/components/Header.tsx`

**작업**:
- [ ] useAuth() 훅 사용
- [ ] isAuthenticated 상태에 따라 버튼 표시
  - 로그인 전: "로그인" 버튼 (→ /login)
  - 로그인 후: "로그아웃" 버튼 (logout 함수 호출)
- [ ] 마이페이지 버튼 옆에 배치
- [ ] lucide-react 아이콘 사용 (LogIn, LogOut)

---

### Step 6: Protected Route 처리 (추후 고려)

**현재는 Skip 가능**:
- 마이페이지는 로그인 없이도 접근 가능 (빈 목록 표시)
- 서약서 페이지에서 claim API 호출 시 401 에러 처리로 충분
- 추후 필요 시 middleware.ts 또는 HOC 구현

---

## 🎯 완료 조건

### 기능 테스트
- [ ] 회원가입 → 자동 로그인 → 메인 페이지 이동
- [ ] 로그아웃 → 로그인 → 메인 페이지 복귀
- [ ] localStorage에 access_token 저장 확인
- [ ] 페이지 새로고침 후에도 로그인 상태 유지
- [ ] 에러 케이스 테스트 (잘못된 비밀번호, 중복 이메일 등)

### 빌드 및 품질
- [ ] `npm run build` 성공
- [ ] 타입 에러 0개
- [ ] ESLint 경고 0개
- [ ] 브라우저에서 동작 확인

---

## 📝 커밋 전략

각 Step 완료 시마다 개별 커밋:

1. `feat: Phase 7.1.1 - 인증 API 프록시 구현 (register, login)`
2. `feat: Phase 7.1.2 - AuthContext 및 전역 상태 관리 구현`
3. `feat: Phase 7.1.3 - 로그인 페이지 UI 구현`
4. `feat: Phase 7.1.4 - 회원가입 페이지 UI 구현`
5. `feat: Phase 7.1.5 - Header에 로그인/로그아웃 버튼 추가`

---

## 🔗 참고 사항

### OpenAPI 명세
- POST /users/register
  - Request: `{ email, password, name, phone }`
  - Response: `{ access_token, user }`
- POST /users/login
  - Request: `{ email, password }`
  - Response: `{ access_token, user }`

### 기술 스택
- Context API (전역 상태 관리)
- localStorage (토큰 저장)
- Next.js App Router
- Tailwind CSS

### 다음 Phase
Phase 7.1 완료 후:
- Phase 7.2: Claim API 연동 (POST /items/{id}/claim)
- Phase 7.3: MyPage API 연동 (GET /items/me)
