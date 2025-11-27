# 기능 명세서

JongSul 분실물 관리 시스템 기능 명세서

작성일: 2025-11-27
버전: 1.0.0

---

## 1. 시스템 개요

### 1.1 프로젝트 정보
- 프로젝트명: JongSul (분실물 관리 시스템)
- 목적: 분실물을 효율적으로 등록, 검색, 예약, 수령할 수 있는 웹 기반 플랫폼
- 대상 사용자: 분실물 습득자, 분실물 찾는 사용자, 관리자
- 플랫폼: 웹 애플리케이션 (반응형)

### 1.2 기술 스택
- Frontend Framework: Next.js 15.5.4 (App Router)
- Language: TypeScript 5
- UI Library: React 19.1.0
- Styling: Tailwind CSS 4
- Icons: Lucide React
- Build Tool: Turbopack

### 1.3 외부 의존성
- 백엔드 API: AWS Lambda (API Gateway)
- 인증: Bearer Token (JWT)
- 이미지 저장: S3 (추정)

---

## 2. 페이지별 기능 명세

### 2.1 메인 페이지 (/)

**파일 경로**: `src/app/page.tsx`

**기능 개요**
분실물 검색 및 조회 메인 화면

**주요 기능**

1. 분실물 목록 표시
   - 그리드 레이아웃 (반응형)
     - 모바일: 1열
     - 태블릿: 2열
     - 데스크톱: 3-4열
   - 각 아이템 카드 표시 항목:
     - 사진 (없을 경우 기본 아이콘)
     - 태그 (여러 개 가능)
     - 위치 정보
     - 등록 날짜
     - 상태 배지 (예약중, 수령완료)

2. 실시간 검색
   - 검색어 입력 시 분실물 필터링
   - Debounce 적용 (300ms)
   - 검색 대상: 태그 이름, 위치 등
   - API 엔드포인트: `GET /api/items/search?q={query}`

3. 태그 필터링
   - 동적 태그 목록 로드 (API: `GET /api/tags`)
   - 다중 선택 가능 (OR 조건)
   - 선택된 태그는 하늘색으로 하이라이트
   - "전체 해제" 버튼으로 필터 초기화
   - 드래그 스크롤 지원 (좌우 이동)

4. 아이템 상세 모달
   - 카드 클릭 시 모달 오픈
   - 모달 내용:
     - 큰 이미지
     - 태그 목록
     - 위치 정보
     - 등록 날짜
     - 상태 정보
   - 액션 버튼:
     - "수령 예약하기" (상태가 "보관"일 때만 활성화)
     - 예약중/수령완료 시 버튼 비활성화

**UI 상태**
- 로딩 상태: 스피너 표시
- 빈 상태: "검색 결과가 없습니다" 메시지
- 에러 상태: 콘솔 로깅 (UI 표시 없음)

**인증 요구사항**
- 페이지 접근: 로그인 불필요
- 분실물 조회: 로그인 불필요
- 예약 버튼 클릭: 로그인 필요 (로그인 페이지로 리다이렉트)

---

### 2.2 분실물 소유권 주장 페이지 (/claim/[id])

**파일 경로**: `src/app/claim/[id]/page.tsx`

**기능 개요**
분실물 수령을 위한 소유권 주장 및 픽업 코드 발급

**URL 파라미터**
- `id`: 분실물 아이템 ID (숫자)

**페이지 플로우**

1. 분실물 정보 표시
   - API: `GET /api/items/{id}`
   - 표시 항목:
     - 분실물 이미지
     - 태그
     - 위치
     - 등록 날짜

2. 서약서 동의 단계
   - 컴포넌트: `ClaimAgreement`
   - 서약 내용:
     1. 해당 분실물이 본인 소유물임을 확인
     2. 허위 주장 시 민형사상 책임 인지
     3. 신분증 확인 동의
     4. 7일 내 미수령 시 소유권 자동 취소 인지
     5. 모든 책임을 본인이 부담
   - 동의 체크박스 필수
   - 액션:
     - "취소" 버튼: 메인 페이지로 이동
     - "동의" 버튼: 체크박스 선택 시 활성화

3. 픽업 코드 발급
   - API: `POST /api/items/{id}/claim`
   - 요청 헤더: `Authorization: Bearer {token}`
   - 응답:
     - `pickup_code.code`: 6자리 코드
     - `pickup_code.expires_at`: 만료 날짜 (7일 후)
   - 컴포넌트: `ClaimCodeDisplay`
   - 표시 내용:
     - 6자리 픽업 코드 (큰 폰트)
     - 유효기간
     - 안내 메시지: "이 코드를 키오스크에 입력하세요"

**인증 처리**
- 서약서 단계: 로그인 불필요 (정보 조회만)
- 동의 버튼 클릭 시: 로그인 체크
  - 미로그인 시: `/login?redirect=/claim/{id}` 로 이동
- API 호출 시: Authorization 헤더 필수

**에러 처리**
- 분실물 없음 (404): "분실물을 찾을 수 없습니다" + 돌아가기 버튼
- 이미 예약됨 (400): 에러 메시지 표시
- 토큰 만료 (401): 로그인 페이지로 리다이렉트
- 서버 에러 (500): "서버 오류가 발생했습니다" 메시지

---

### 2.3 마이페이지 (/mypage)

**파일 경로**: `src/app/mypage/page.tsx`

**기능 개요**
사용자의 예약 내역 조회 및 관리

**접근 제어**
- 로그인 필수
- 미로그인 시: `/login?redirect=/mypage` 로 리다이렉트
- 로딩 중: 스피너 표시

**주요 기능**

1. 예약 목록 조회
   - API: `GET /api/items/me`
   - 요청 헤더: `Authorization: Bearer {token}`
   - 응답: ItemResponse 배열
   - 표시 형태: 카드 그리드 (ClaimedItemCard 컴포넌트)

2. 예약 상세 정보 모달
   - 컴포넌트: `MyPageItemDetailModal`
   - 트리거: 카드 클릭
   - 표시 내용:
     - 분실물 이미지
     - 태그
     - 위치
     - 등록 날짜
     - 픽업 코드 (상태가 "수령 대기"일 때)
     - 상태 정보
   - 상태별 액션:
     - "수령 대기": 픽업 코드 표시 + "예약 취소" 버튼
     - "수령 완료": 액션 버튼 없음

3. 예약 취소 기능
   - 컴포넌트: `CancelReservationModal`
   - 취소 사유 선택 (필수):
     - 찾았어요
     - 내 물건이 아니에요
     - 찾으러 갈 수 없어요
     - 기타 (직접 입력, 100자 제한)
   - API: `POST /api/items/me/{id}/cancel`
   - 요청 본문: `{ "cancel_reason": string }`
   - 취소 후: 모달 닫기 + 목록 새로고침

4. 알림 설정
   - 컴포넌트: `NotificationSettings`
   - 기능: 태그별 알림 수신 설정
   - 저장 위치: localStorage (백엔드 연동 없음)
   - 제한사항: 브라우저/기기별 독립적

**UI 상태**
- 로딩: 전체 페이지 스피너
- 예약 없음: "예약한 분실물이 없습니다" 메시지 + 메인으로 가기 버튼
- 에러: 에러 메시지 표시

**에러 처리**
- 401 Unauthorized: 로그인 페이지로 리다이렉트 + localStorage 정리
- 500 Server Error: "서버 오류가 발생했습니다" 메시지

---

### 2.4 로그인 페이지 (/login)

**파일 경로**: `src/app/login/page.tsx`

**기능 개요**
사용자 로그인 및 인증

**쿼리 파라미터**
- `redirect`: 로그인 후 이동할 페이지 (optional)
- `message`: 표시할 안내 메시지 (optional)

**주요 기능**

1. 로그인 폼
   - 입력 필드:
     - 이메일 (type="email", required)
     - 비밀번호 (type="password", required)
   - 검증:
     - HTML5 기본 검증 (required, email format)
     - 빈 값 제출 방지
   - 제출 버튼: "로그인"

2. 로그인 처리
   - API: `POST /api/users/login`
   - 요청 본문: `{ "email": string, "password": string }`
   - 응답: `{ "access_token": string, "token_type": "bearer" }`
   - 성공 시:
     - token을 localStorage에 저장
     - AuthContext 업데이트
     - redirect 파라미터로 이동 또는 메인 페이지로 이동

3. 회원가입 링크
   - "계정이 없으신가요? 회원가입" 링크
   - 경로: `/register`

4. 홈으로 돌아가기
   - 상단 "Home" 버튼
   - 경로: `/`

**에러 처리**
- 401 Unauthorized: "이메일 또는 비밀번호가 올바르지 않습니다"
- 404 Not Found: "존재하지 않는 사용자입니다"
- 422 Validation Error: "이메일 형식이 올바르지 않습니다"
- 500 Server Error: "서버 오류가 발생했습니다"

**UI 상태**
- 로딩: 버튼 비활성화 + "로그인 중..." 텍스트
- 에러: 빨간색 에러 메시지 박스

---

### 2.5 회원가입 페이지 (/register)

**파일 경로**: `src/app/register/page.tsx`

**기능 개요**
신규 사용자 계정 생성

**주요 기능**

1. 회원가입 폼
   - 입력 필드:
     - 이메일 (type="email", required)
     - 비밀번호 (type="password", required)
     - 비밀번호 확인 (type="password", required)
     - 이름 (type="text", required)
     - 연락처 (type="tel", optional)
   - 검증:
     - 비밀번호 일치 확인
     - HTML5 기본 검증
   - 제출 버튼: "회원가입"

2. 회원가입 처리
   - API: `POST /api/users/register`
   - 요청 본문:
     ```json
     {
       "email": string,
       "password": string,
       "name": string,
       "contact_info": string | null
     }
     ```
   - 응답: `{ "id": number, "email": string, "name": string }`
   - 성공 시: 로그인 페이지로 이동 + 성공 메시지

3. 로그인 링크
   - "이미 계정이 있으신가요? 로그인" 링크
   - 경로: `/login`

4. 홈으로 돌아가기
   - 상단 "Home" 버튼
   - 경로: `/`

**에러 처리**
- 409 Conflict: "이미 사용 중인 이메일입니다"
- 400 Bad Request: "입력 정보가 올바르지 않습니다"
- 422 Validation Error: "입력 형식이 올바르지 않습니다" + detail 표시
- 500 Server Error: "서버 오류가 발생했습니다"

**UI 상태**
- 로딩: 버튼 비활성화 + "가입 중..." 텍스트
- 에러: 빨간색 에러 메시지 박스
- 비밀번호 불일치: "비밀번호가 일치하지 않습니다" 메시지

---

## 3. API 명세

### 3.1 API 프록시 구조

모든 API는 Next.js API Routes를 통해 프록시됨
- 클라이언트 → Next.js API Route → 외부 백엔드 API
- 목적: CORS 우회, 인증 헤더 관리, 에러 처리 통합

**환경 변수**
- `API_BASE_URL`: 외부 API 서버 주소 (예: `https://xxx.amazonaws.com/main`)

### 3.2 분실물 관련 API

#### 3.2.1 분실물 목록 조회
```
GET /api/items
```
- 인증: 불필요
- 응답: ItemResponse[]

#### 3.2.2 분실물 검색
```
GET /api/items/search?q={query}&tags={tagIds}
```
- 인증: 불필요
- 쿼리 파라미터:
  - `q`: 검색어 (1-50자, optional)
  - `tags`: 태그 ID 배열 (쉼표 구분, optional)
- 응답: ItemResponse[]

#### 3.2.3 분실물 상세 조회
```
GET /api/items/{id}
```
- 인증: 불필요
- 응답: ItemResponse

#### 3.2.4 분실물 소유권 주장 (Claim)
```
POST /api/items/{id}/claim
```
- 인증: 필수 (Bearer Token)
- 응답:
  ```json
  {
    "item": ItemResponse,
    "pickup_code": {
      "code": "123456",
      "expires_at": "2025-11-28T12:00:00Z"
    }
  }
  ```

### 3.3 사용자 예약 관련 API

#### 3.3.1 내 예약 목록 조회
```
GET /api/items/me
```
- 인증: 필수 (Bearer Token)
- 응답: ItemResponse[]

#### 3.3.2 내 예약 상세 조회
```
GET /api/items/me/{id}
```
- 인증: 필수 (Bearer Token)
- 응답:
  ```json
  {
    "item": ItemResponse,
    "pickup_code": {
      "code": "123456",
      "expires_at": "2025-11-28T12:00:00Z"
    }
  }
  ```

#### 3.3.3 예약 취소
```
POST /api/items/me/{id}/cancel
```
- 인증: 필수 (Bearer Token)
- 요청 본문:
  ```json
  {
    "cancel_reason": "찾았어요"
  }
  ```
- 응답: ItemResponse (상태가 "보관"으로 변경됨)

### 3.4 태그 API

#### 3.4.1 태그 목록 조회
```
GET /api/tags
```
- 인증: 불필요
- 응답:
  ```json
  [
    { "id": 1, "name": "지갑" },
    { "id": 2, "name": "카드" }
  ]
  ```

### 3.5 사용자 인증 API

#### 3.5.1 로그인
```
POST /api/users/login
```
- 요청 본문:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- 응답:
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "token_type": "bearer"
  }
  ```

#### 3.5.2 회원가입
```
POST /api/users/register
```
- 요청 본문:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "홍길동",
    "contact_info": "010-1234-5678"
  }
  ```
- 응답:
  ```json
  {
    "id": 1,
    "email": "user@example.com",
    "name": "홍길동"
  }
  ```

### 3.6 Health Check API

#### 3.6.1 서버 상태 확인
```
GET /api/health
```
- 인증: 불필요
- 응답:
  ```json
  {
    "status": "ok",
    "message": "API server is healthy"
  }
  ```

---

## 4. 데이터 모델

### 4.1 ItemResponse
```typescript
interface ItemResponse {
  id: number;
  photo_url: string | null;
  location: string | null;
  status: string;  // "보관" | "예약" | "찾음"
  registered_at: string;  // ISO 8601 datetime
  tags: TagResponse[];
}
```

### 4.2 TagResponse
```typescript
interface TagResponse {
  id: number;
  name: string;
}
```

### 4.3 PickupCodeResponse
```typescript
interface PickupCodeResponse {
  code: string;  // 6자리 숫자
  expires_at: string;  // ISO 8601 datetime
}
```

### 4.4 ClaimResponse
```typescript
interface ClaimResponse {
  item: ItemResponse;
  pickup_code: PickupCodeResponse;
}
```

---

## 5. 상태 매핑

### 5.1 분실물 상태
서버에서 한글 상태를 받아 UI에서 매핑

| 서버 상태 | UI 표시 | 색상 | 설명 |
|-----------|---------|------|------|
| "보관" | "예약가능" | 하늘색 | 배지 표시 안함 |
| "예약" | "예약중" | 분홍색 | 배지 표시 |
| "찾음" | "수령완료" | 회색 | 배지 표시 |

### 5.2 상태별 가능 액션

| 상태 | 메인 페이지 | Claim 페이지 | 마이페이지 |
|------|-------------|--------------|------------|
| 보관 | 예약 버튼 활성화 | 소유권 주장 가능 | - |
| 예약 | 예약 버튼 비활성화 | 소유권 주장 불가 | 예약 취소 가능 |
| 찾음 | 예약 버튼 비활성화 | 소유권 주장 불가 | 취소 불가 |

---

## 6. 인증 및 권한

### 6.1 인증 방식
- 방식: JWT Bearer Token
- 저장: localStorage (`access_token`)
- 전송: Authorization 헤더 (`Bearer {token}`)

### 6.2 인증 컨텍스트
- 파일: `src/lib/contexts/AuthContext.tsx`
- 제공 기능:
  - `user`: 현재 로그인 사용자 정보
  - `token`: 액세스 토큰
  - `isAuthenticated`: 로그인 여부
  - `login(email, password)`: 로그인 함수
  - `register(email, password, name, phone)`: 회원가입 함수
  - `logout()`: 로그아웃 함수
  - `isLoading`: 인증 상태 로딩 여부

### 6.3 페이지별 인증 요구사항

| 페이지 | 인증 필요 | 미인증 시 동작 |
|--------|-----------|----------------|
| / (메인) | X | - |
| /claim/[id] | O (동의 버튼) | 로그인 페이지로 리다이렉트 |
| /mypage | O | 로그인 페이지로 리다이렉트 |
| /login | X | - |
| /register | X | - |

---

## 7. UI/UX 요구사항

### 7.1 반응형 디자인
- 모바일: < 640px
- 태블릿: 640px ~ 1024px
- 데스크톱: > 1024px

### 7.2 색상 시스템
- Primary: Sky Blue (`#0ea5e9`)
- Success: Green
- Warning: Pink
- Neutral: Gray
- Error: Red

### 7.3 로딩 상태
- 전체 페이지 로딩: 중앙 스피너
- 버튼 로딩: 버튼 내 스피너 + "처리 중..." 텍스트
- 목록 로딩: 하단 스피너

### 7.4 모달 동작
- 오픈: 페이드 인 애니메이션
- 닫기:
  - 배경 클릭
  - X 버튼 클릭
  - ESC 키 (미구현)
- 스크롤: body 스크롤 잠금

### 7.5 에러 표시
- API 에러: 빨간색 박스 + 메시지
- 폼 검증 에러: 입력 필드 아래 메시지
- 네트워크 에러: "네트워크 오류가 발생했습니다" 메시지

---

## 8. 성능 최적화

### 8.1 Debounce
- 검색 입력: 300ms
- 태그 필터: 300ms

### 8.2 이미지 최적화
- Next.js Image 컴포넌트 사용
- lazy loading 자동 적용
- 에러 시 기본 아이콘 표시

### 8.3 API 호출 최적화
- 불필요한 재요청 방지
- 로딩 중 중복 요청 차단

---

## 9. 보안 요구사항

### 9.1 클라이언트 측 검증
- 폼 입력 검증 (HTML5 + JavaScript)
- 토큰 존재 여부 체크
- 비밀번호 일치 확인

### 9.2 서버 측 검증 (프록시)
- Authorization 헤더 확인
- 요청 본문 검증
- 에러 응답 표준화

### 9.3 민감 정보 처리
- 비밀번호: 콘솔 로그 제외
- 토큰: HTTPS 전송 (프로덕션)
- 에러 상세: 클라이언트에 노출 최소화

---

## 10. 제외 사항

### 10.1 키오스크 페이지
- 본 명세서에서 제외
- 별도 명세서 필요

### 10.2 관리자 기능
- 현재 미구현
- 향후 추가 예정

### 10.3 실시간 알림
- NotificationSettings는 UI만 존재
- 실제 알림 기능 미구현
- localStorage만 사용 (백엔드 연동 없음)

---

## 11. 알려진 제한사항

### 11.1 무한 스크롤 미지원
- 서버 페이지네이션 미지원
- 전체 목록 한 번에 로드

### 11.2 이미지 업로드 불가
- 사용자가 직접 분실물 등록 불가
- 관리자만 등록 가능 (별도 시스템)

### 11.3 검색 정확도
- 단순 문자열 매칭
- 형태소 분석 미지원
- 오타 교정 미지원

### 11.4 토큰 갱신 미지원
- Refresh Token 없음
- 만료 시 재로그인 필요

### 11.5 알림 설정 동기화 불가
- localStorage 사용
- 브라우저/기기별 독립적
- 백엔드 저장 미지원

---

작성자: Claude & Elfld
최종 수정일: 2025-11-27
