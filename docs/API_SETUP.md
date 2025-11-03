# API 연동 가이드

이 문서는 Lost-Found Center 프로젝트에서 외부 API 서버와 연동하는 방법을 설명합니다.

---

## 📋 목차

1. [환경 변수 설정](#환경-변수-설정)
2. [API 엔드포인트](#api-엔드포인트)
3. [ItemService 사용법](#itemservice-사용법)
4. [Health Check 테스트](#health-check-테스트)
5. [트러블슈팅](#트러블슈팅)

---

## 🔧 환경 변수 설정

### 1. `.env.local` 파일 생성

프로젝트 루트 디렉토리에 `.env.local` 파일을 생성합니다:

```bash
# 프로젝트 루트에서 실행
cp .env.local.example .env.local
```

### 2. API 서버 주소 설정

`.env.local` 파일을 열고 실제 API 서버 주소를 입력합니다:

```bash
# .env.local

# 로컬 개발 서버 사용 시
NEXT_PUBLIC_API_URL=http://localhost:3000

# 외부 API 서버 사용 시
NEXT_PUBLIC_API_URL=https://api.example.com

# 네트워크 내 다른 서버 사용 시
NEXT_PUBLIC_API_URL=http://192.168.0.100:8000
```

### 3. 환경 변수 적용

개발 서버를 재시작하여 환경 변수를 적용합니다:

```bash
# 개발 서버 중지 (Ctrl+C)
# 개발 서버 재시작
npm run dev
```

**중요**: 환경 변수는 빌드 시점에 번들에 포함되므로, 변경 후 반드시 서버를 재시작해야 합니다.

---

## 🌐 API 엔드포인트

### 1. Health Check

**엔드포인트**: `GET /api/health`

서버가 정상적으로 작동하는지 확인합니다.

**응답 예시**:
```json
{
  "status": "ok",
  "timestamp": "2025-11-03T12:34:56.789Z",
  "message": "Server is running"
}
```

### 2. 분실물 목록 조회

**엔드포인트**: `GET /api/items`

**Query Parameters**:
| 파라미터 | 타입 | 설명 | 예시 |
|---------|------|------|------|
| `search` | string | 검색어 | `search=지갑` |
| `tags` | string | 카테고리 (쉼표 구분) | `tags=지갑,카드` |
| `page` | number | 페이지 번호 (1부터 시작) | `page=1` |
| `limit` | number | 페이지당 항목 수 | `limit=20` |

**요청 예시**:
```
GET /api/items?search=지갑&tags=지갑,카드&page=1&limit=20
```

**응답 예시**:
```json
{
  "items": [
    {
      "id": "1",
      "description": "검은색 가죽 지갑",
      "category": "지갑",
      "location": "도서관 3층",
      "foundDate": "2025-11-01",
      "imageUrl": "/placeholder-wallet.jpg",
      "tags": ["지갑", "가죽"]
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 100,
    "itemsPerPage": 20,
    "hasNextPage": true
  }
}
```

### 3. 분실물 상세 조회 (추후 확장)

**엔드포인트**: `GET /api/items/{id}`

**경로 파라미터**:
- `id`: 분실물 ID

**응답 예시**:
```json
{
  "id": "1",
  "description": "검은색 가죽 지갑",
  "category": "지갑",
  "location": "도서관 3층",
  "foundDate": "2025-11-01",
  "imageUrl": "/placeholder-wallet.jpg",
  "tags": ["지갑", "가죽"],
  "detailInfo": "신용카드 3장 포함"
}
```

---

## 💻 ItemService 사용법

### 개요

`ItemService`는 API 통신을 추상화한 서비스 클래스입니다. 환경 변수 `NEXT_PUBLIC_API_URL`을 자동으로 읽어 올바른 API 서버로 요청을 보냅니다.

### getBaseUrl() 메서드

**동작 방식**:
```typescript
private static getBaseUrl(): string {
  if (typeof window === 'undefined') {
    // 서버 사이드: 환경 변수 사용
    return process.env.NEXT_PUBLIC_API_URL || '';
  }
  // 클라이언트 사이드: 환경 변수 또는 현재 호스트 사용
  return process.env.NEXT_PUBLIC_API_URL || window.location.origin;
}
```

**설명**:
- **서버 사이드 렌더링(SSR)**: `process.env.NEXT_PUBLIC_API_URL` 사용
- **클라이언트 사이드**: 환경 변수가 있으면 사용, 없으면 현재 호스트(`window.location.origin`) 사용
- **Fallback**: 환경 변수가 없을 때는 자동으로 현재 도메인으로 요청

### fetchItems() 사용 예시

```typescript
import { ItemService } from '@/lib/services/ItemService';

// 컴포넌트 또는 Hook 내부에서 사용
const loadItems = async () => {
  try {
    const response = await ItemService.fetchItems({
      search: '지갑',
      tags: ['지갑', '카드'],
      page: 1,
      limit: 20
    });

    console.log('Items:', response.items);
    console.log('Total:', response.pagination.totalItems);
  } catch (error) {
    console.error('Failed to fetch items:', error);
  }
};
```

### fetchItemById() 사용 예시

```typescript
const loadItemDetail = async (itemId: string) => {
  try {
    const item = await ItemService.fetchItemById(itemId);
    console.log('Item detail:', item);
  } catch (error) {
    console.error('Failed to fetch item:', error);
  }
};
```

### healthCheck() 사용 예시

```typescript
const checkServerHealth = async () => {
  try {
    const health = await ItemService.healthCheck();
    console.log('Server status:', health.status); // "ok"
    console.log('Timestamp:', health.timestamp);
  } catch (error) {
    console.error('Server is down:', error);
  }
};
```

---

## 🧪 Health Check 테스트

### 1. 브라우저에서 테스트

개발 서버 실행 후 브라우저에서 접속:

```
http://localhost:3000/api/health
```

**정상 응답**:
```json
{
  "status": "ok",
  "timestamp": "2025-11-03T12:34:56.789Z",
  "message": "Server is running"
}
```

### 2. curl 명령어로 테스트

터미널에서 실행:

```bash
# 로컬 서버 테스트
curl http://localhost:3000/api/health

# 외부 API 서버 테스트
curl https://api.example.com/api/health
```

### 3. 코드로 테스트

개발자 도구 콘솔에서 실행:

```javascript
// Health check 테스트
fetch('/api/health')
  .then(res => res.json())
  .then(data => console.log('Health:', data));

// ItemService로 테스트
import { ItemService } from '@/lib/services/ItemService';
ItemService.healthCheck().then(console.log);
```

---

## 🔍 트러블슈팅

### 문제 1: 환경 변수가 적용되지 않음

**증상**:
- API 요청이 잘못된 URL로 전송됨
- `process.env.NEXT_PUBLIC_API_URL`이 `undefined`

**해결 방법**:
1. `.env.local` 파일이 프로젝트 루트에 있는지 확인
2. 환경 변수 이름이 `NEXT_PUBLIC_` 접두사로 시작하는지 확인
3. 개발 서버를 재시작 (`npm run dev`)
4. 빌드 후 다시 실행 (`npm run build && npm start`)

### 문제 2: CORS 에러

**증상**:
```
Access to fetch at 'https://api.example.com' from origin 'http://localhost:3000'
has been blocked by CORS policy
```

**해결 방법**:
1. API 서버에서 CORS 헤더 설정 필요:
   ```javascript
   // Express.js 예시
   app.use(cors({
     origin: ['http://localhost:3000', 'https://your-domain.com'],
     credentials: true
   }));
   ```

2. Next.js에서 프록시 사용 (개발 환경):
   ```typescript
   // next.config.ts
   const config = {
     async rewrites() {
       return [
         {
           source: '/api/:path*',
           destination: 'https://api.example.com/:path*',
         },
       ];
     },
   };
   ```

### 문제 3: Network Error

**증상**:
```
Failed to fetch items: Failed to fetch
```

**체크리스트**:
- [ ] API 서버가 실행 중인지 확인
- [ ] 네트워크 연결 확인
- [ ] 방화벽 설정 확인
- [ ] API URL이 올바른지 확인 (`https://` vs `http://`)
- [ ] Health Check 엔드포인트로 먼저 테스트

### 문제 4: 404 Not Found

**증상**:
```
GET /api/items 404 (Not Found)
```

**확인 사항**:
1. `NEXT_PUBLIC_API_URL`이 올바른 도메인을 가리키는지 확인
2. API 서버의 엔드포인트 경로가 `/api/items`인지 확인
3. 환경 변수에 trailing slash(`/`)가 없는지 확인:
   - ✅ `NEXT_PUBLIC_API_URL=https://api.example.com`
   - ❌ `NEXT_PUBLIC_API_URL=https://api.example.com/`

### 문제 5: 서버 사이드에서 환경 변수가 빈 문자열

**증상**:
- SSR 시 API 요청이 실패
- 클라이언트에서는 정상 작동

**해결 방법**:
1. `.env.local` 파일 확인
2. Vercel/Netlify 등 배포 환경에서는 환경 변수를 별도로 설정해야 함
3. 빌드 시점에 환경 변수가 존재하는지 확인

---

## 📚 추가 참고 자료

### Next.js 환경 변수 문서
- [Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

### ItemService 코드 위치
- `src/lib/services/ItemService.ts`

### 관련 Hook
- `src/lib/hooks/useItemSearch.ts` - ItemService를 사용하는 검색 Hook

---

## ✅ 체크리스트

API 연동을 완료하기 위한 체크리스트:

- [ ] `.env.local` 파일 생성
- [ ] `NEXT_PUBLIC_API_URL` 환경 변수 설정
- [ ] 개발 서버 재시작
- [ ] Health Check 엔드포인트 테스트 (`/api/health`)
- [ ] 분실물 목록 API 테스트 (`/api/items`)
- [ ] 에러 처리 확인 (네트워크 에러, 404 등)
- [ ] 프로덕션 빌드 테스트 (`npm run build`)

---

**Last Updated**: 2025-11-03
**Author**: Claude & Elfld
