# API 명세서

인하대 분실물 센터 REST API 명세

**Version**: 1.1.0
**Last Updated**: 2025-12-10

---

## 목차

1. [개요](#개요)
2. [인증](#인증)
3. [API 엔드포인트](#api-엔드포인트)
4. [데이터 모델](#데이터-모델)
5. [에러 처리](#에러-처리)

---

## 개요

### API 구조

모든 API 요청은 Next.js API Routes를 통해 외부 백엔드 API로 프록시됩니다:

```
클라이언트 → Next.js API Route → 외부 백엔드 API (AWS Lambda)
```

**프록시 레이어의 역할**:
- CORS 우회
- 인증 헤더 관리
- 에러 처리 통합
- 요청/응답 로깅

### Base URL

- **Development**: `http://localhost:3000`
- **Production**: 배포된 도메인

### 환경 변수

```bash
API_BASE_URL=https://your-api-server.com/main
```

---

## 인증

### JWT Bearer Token

보호된 엔드포인트는 JWT Bearer Token 인증이 필요합니다.

**헤더 형식**:
```
Authorization: Bearer {access_token}
```

**토큰 획득**:
- 로그인 API (`POST /api/users/login`)를 통해 획득
- 회원가입 후 로그인 필요

**토큰 저장**:
- localStorage에 저장: `localStorage.setItem('token', access_token)`

**토큰 만료**:
- 401 Unauthorized 응답 시 재로그인 필요
- 자동으로 로그인 페이지로 리다이렉트

---

## API 엔드포인트

### 1. 분실물 관리

#### 1.1 분실물 목록 조회

모든 보관 중인 분실물을 조회합니다.

```http
GET /api/items
```

**인증**: 불필요

**응답** (200 OK):
```json
[
  {
    "id": 1,
    "photo_url": "https://example.com/image.jpg",
    "location": "도서관 1층",
    "status": "보관",
    "registered_at": "2025-12-10T10:00:00Z",
    "tags": [
      { "id": 1, "name": "지갑" },
      { "id": 2, "name": "카드" }
    ]
  }
]
```

---

#### 1.2 분실물 검색

검색어와 태그로 분실물을 필터링합니다.

```http
GET /api/items/search?q={query}&tags={tagIds}
```

**인증**: 불필요

**쿼리 파라미터**:
| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `q` | string | No | 검색어 (1-50자) |
| `tags` | string | No | 태그 ID 배열 (쉼표 구분, 예: "1,2,3") |

**예시**:
```
GET /api/items/search?q=지갑&tags=1,2
```

**응답** (200 OK):
```json
[
  {
    "id": 1,
    "photo_url": "https://example.com/image.jpg",
    "location": "도서관 1층",
    "status": "보관",
    "registered_at": "2025-12-10T10:00:00Z",
    "tags": [
      { "id": 1, "name": "지갑" }
    ]
  }
]
```

---

#### 1.3 분실물 상세 조회

특정 분실물의 상세 정보를 조회합니다.

```http
GET /api/items/{id}
```

**인증**: 불필요

**경로 파라미터**:
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `id` | number | 분실물 ID |

**응답** (200 OK):
```json
{
  "id": 1,
  "photo_url": "https://example.com/image.jpg",
  "location": "도서관 1층",
  "status": "보관",
  "registered_at": "2025-12-10T10:00:00Z",
  "tags": [
    { "id": 1, "name": "지갑" }
  ]
}
```

**에러 응답**:
- `404 Not Found`: 분실물을 찾을 수 없음

---

#### 1.4 분실물 소유권 주장 (Claim)

분실물에 대한 소유권을 주장하고 픽업 코드를 발급받습니다.

```http
POST /api/items/{id}/claim
```

**인증**: 필수

**경로 파라미터**:
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `id` | number | 분실물 ID |

**응답** (200 OK):
```json
{
  "item": {
    "id": 1,
    "photo_url": "https://example.com/image.jpg",
    "location": "도서관 1층",
    "status": "예약",
    "registered_at": "2025-12-10T10:00:00Z",
    "tags": [
      { "id": 1, "name": "지갑" }
    ]
  },
  "pickup_code": {
    "code": "123456",
    "expires_at": "2025-12-17T10:00:00Z"
  }
}
```

**에러 응답**:
- `400 Bad Request`: 이미 예약된 분실물
- `401 Unauthorized`: 인증 필요
- `404 Not Found`: 분실물을 찾을 수 없음

---

### 2. 사용자 예약 관리

#### 2.1 내 예약 목록 조회

현재 로그인한 사용자가 예약한 분실물 목록을 조회합니다.

```http
GET /api/items/me
```

**인증**: 필수

**응답** (200 OK):
```json
[
  {
    "id": 1,
    "photo_url": "https://example.com/image.jpg",
    "location": "도서관 1층",
    "status": "예약",
    "registered_at": "2025-12-10T10:00:00Z",
    "tags": [
      { "id": 1, "name": "지갑" }
    ]
  }
]
```

**에러 응답**:
- `401 Unauthorized`: 인증 필요

---

#### 2.2 내 예약 상세 조회

예약한 특정 분실물의 상세 정보와 픽업 코드를 조회합니다.

```http
GET /api/items/me/{id}
```

**인증**: 필수

**경로 파라미터**:
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `id` | number | 분실물 ID |

**응답** (200 OK):
```json
{
  "item": {
    "id": 1,
    "photo_url": "https://example.com/image.jpg",
    "location": "도서관 1층",
    "status": "예약",
    "registered_at": "2025-12-10T10:00:00Z",
    "tags": [
      { "id": 1, "name": "지갑" }
    ]
  },
  "pickup_code": {
    "code": "123456",
    "expires_at": "2025-12-17T10:00:00Z"
  }
}
```

**에러 응답**:
- `401 Unauthorized`: 인증 필요
- `403 Forbidden`: 다른 사용자의 예약
- `404 Not Found`: 예약을 찾을 수 없음

---

#### 2.3 예약 취소

예약한 분실물을 취소합니다.

```http
POST /api/items/me/{id}/cancel
```

**인증**: 필수

**경로 파라미터**:
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `id` | number | 분실물 ID |

**요청 본문**:
```json
{
  "cancel_reason": "찾았어요"
}
```

**취소 사유 예시**:
- "찾았어요"
- "내 물건이 아니에요"
- "찾으러 갈 수 없어요"
- 기타 사유 (100자 이내 자유 입력)

**응답** (200 OK):
```json
{
  "id": 1,
  "photo_url": "https://example.com/image.jpg",
  "location": "도서관 1층",
  "status": "보관",
  "registered_at": "2025-12-10T10:00:00Z",
  "tags": [
    { "id": 1, "name": "지갑" }
  ]
}
```

**에러 응답**:
- `400 Bad Request`: 취소할 수 없는 상태 (이미 수령 완료 등)
- `401 Unauthorized`: 인증 필요
- `403 Forbidden`: 다른 사용자의 예약
- `404 Not Found`: 예약을 찾을 수 없음

---

### 3. 태그 관리

#### 3.1 태그 목록 조회

시스템에 등록된 모든 태그를 조회합니다.

```http
GET /api/tags
```

**인증**: 불필요

**응답** (200 OK):
```json
[
  { "id": 1, "name": "지갑" },
  { "id": 2, "name": "카드" },
  { "id": 3, "name": "핸드폰" },
  { "id": 4, "name": "가방" },
  { "id": 5, "name": "우산" }
]
```

---

### 4. 사용자 인증

#### 4.1 로그인

사용자 로그인 후 JWT 액세스 토큰을 발급받습니다.

```http
POST /api/users/login
```

**인증**: 불필요

**요청 본문**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**응답** (200 OK):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**에러 응답**:
- `400 Bad Request`: 요청 본문이 잘못됨
- `401 Unauthorized`: 이메일 또는 비밀번호가 올바르지 않음
- `404 Not Found`: 존재하지 않는 사용자
- `422 Unprocessable Entity`: 입력 검증 실패

---

#### 4.2 회원가입

새로운 사용자 계정을 생성합니다.

```http
POST /api/users/register
```

**인증**: 불필요

**요청 본문**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "홍길동",
  "contact_info": "010-1234-5678"
}
```

**필드 설명**:
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `email` | string | Yes | 이메일 주소 (유효한 이메일 형식) |
| `password` | string | Yes | 비밀번호 |
| `name` | string | Yes | 사용자 이름 |
| `contact_info` | string | No | 연락처 (선택 사항) |

**응답** (201 Created):
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "홍길동"
}
```

**에러 응답**:
- `400 Bad Request`: 요청 본문이 잘못됨
- `409 Conflict`: 이미 사용 중인 이메일
- `422 Unprocessable Entity`: 입력 검증 실패

---

### 5. 기타

#### 5.1 Health Check

API 서버의 상태를 확인합니다.

```http
GET /api/health
```

**인증**: 불필요

**응답** (200 OK):
```json
{
  "status": "ok",
  "message": "API server is healthy",
  "timestamp": "2025-12-10T10:00:00Z"
}
```

---

## 데이터 모델

### ItemResponse

분실물 정보를 나타내는 응답 객체

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

**필드 설명**:
| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | number | 분실물 고유 ID |
| `photo_url` | string \| null | 분실물 사진 URL (없을 경우 null) |
| `location` | string \| null | 발견 위치 |
| `status` | string | 상태 ("보관", "예약", "찾음") |
| `registered_at` | string | 등록 일시 (ISO 8601 형식) |
| `tags` | TagResponse[] | 태그 목록 |

---

### TagResponse

태그 정보를 나타내는 응답 객체

```typescript
interface TagResponse {
  id: number;
  name: string;
}
```

**필드 설명**:
| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | number | 태그 고유 ID |
| `name` | string | 태그 이름 |

---

### PickupCodeResponse

픽업 코드 정보를 나타내는 응답 객체

```typescript
interface PickupCodeResponse {
  code: string;
  expires_at: string;  // ISO 8601 datetime
}
```

**필드 설명**:
| 필드 | 타입 | 설명 |
|------|------|------|
| `code` | string | 6자리 픽업 코드 |
| `expires_at` | string | 만료 일시 (등록 후 7일) |

---

### ClaimResponse

소유권 주장 응답 객체

```typescript
interface ClaimResponse {
  item: ItemResponse;
  pickup_code: PickupCodeResponse;
}
```

---

### AuthResponse

인증 응답 객체

```typescript
interface AuthResponse {
  access_token: string;
  token_type: string;  // "bearer"
}
```

---

### UserResponse

사용자 정보 응답 객체

```typescript
interface UserResponse {
  id: number;
  email: string;
  name: string;
}
```

---

## 에러 처리

### 공통 에러 응답 형식

```json
{
  "error": "에러 메시지",
  "detail": "상세 설명 (선택 사항)",
  "raw": {}
}
```

### HTTP 상태 코드

| 코드 | 상태 | 설명 |
|------|------|------|
| 200 | OK | 요청 성공 |
| 201 | Created | 리소스 생성 성공 |
| 400 | Bad Request | 잘못된 요청 |
| 401 | Unauthorized | 인증 필요 또는 토큰 만료 |
| 403 | Forbidden | 권한 없음 |
| 404 | Not Found | 리소스를 찾을 수 없음 |
| 409 | Conflict | 리소스 충돌 (중복 이메일 등) |
| 422 | Unprocessable Entity | 입력 검증 실패 |
| 500 | Internal Server Error | 서버 오류 |

### 상태별 상세 설명

#### 400 Bad Request
- 요청 본문이 잘못된 형식
- 필수 필드 누락
- 유효하지 않은 데이터 형식

**예시**:
```json
{
  "error": "잘못된 요청입니다.",
  "detail": "요청 데이터를 확인해주세요."
}
```

#### 401 Unauthorized
- Authorization 헤더 누락
- 유효하지 않은 토큰
- 토큰 만료

**처리**: 자동으로 로그인 페이지로 리다이렉트

```json
{
  "error": "로그인이 필요합니다. 다시 로그인해주세요."
}
```

#### 403 Forbidden
- 다른 사용자의 리소스 접근 시도
- 권한 없는 작업 시도

```json
{
  "error": "이 리소스에 접근할 권한이 없습니다."
}
```

#### 404 Not Found
- 존재하지 않는 리소스
- 잘못된 ID

```json
{
  "error": "리소스를 찾을 수 없습니다."
}
```

#### 409 Conflict
- 이메일 중복
- 리소스 충돌

```json
{
  "error": "이미 사용 중인 이메일입니다."
}
```

#### 422 Unprocessable Entity
- 입력 검증 실패
- 유효하지 않은 이메일 형식
- 비밀번호 강도 부족

```json
{
  "error": "입력 형식이 올바르지 않습니다.",
  "detail": "이메일 형식을 확인해주세요."
}
```

#### 500 Internal Server Error
- 서버 내부 오류
- 외부 API 오류

```json
{
  "error": "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
}
```

---

## 상태 및 권한

### 분실물 상태

| 서버 상태 | UI 표시 | 설명 |
|-----------|---------|------|
| "보관" | "예약가능" | 예약 가능한 상태 |
| "예약" | "예약중" | 사용자가 예약한 상태 |
| "찾음" | "수령완료" | 수령 완료된 상태 |

### 상태별 가능한 작업

| 상태 | 예약하기 | 소유권 주장 | 예약 취소 |
|------|----------|-------------|-----------|
| 보관 | ✅ | ✅ | ❌ |
| 예약 | ❌ | ❌ | ✅ (본인만) |
| 찾음 | ❌ | ❌ | ❌ |

---

**API 명세서 끝**
