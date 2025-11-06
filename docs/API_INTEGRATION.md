# API 연동 가이드

> 📅 작성일: 2025-11-01
> 🔗 백엔드 API를 프론트엔드 웹서비스에 연동하는 가이드

---

## 📋 목차

1. [API 명세 요약](#api-명세-요약)
2. [현재 구조 vs 실제 API 차이점](#현재-구조-vs-실제-api-차이점)
3. [연동 작업 체크리스트](#연동-작업-체크리스트)
4. [Step-by-Step 연동 가이드](#step-by-step-연동-가이드)
5. [테스트 가이드](#테스트-가이드)
6. [트러블슈팅](#트러블슈팅)

---

## API 명세 요약

### 🔓 인증 불필요 (Public API)

| 메서드 | 경로 | 설명 | 사용처 |
|--------|------|------|--------|
| GET | `/health_check` | 서버 상태 확인 | 앱 시작 시 |
| GET | `/items` | 전체 분실물 조회 | 메인 페이지 |
| GET | `/items/search` | 조건 검색 | 검색/필터 |
| GET | `/items/{item_id}` | 상세 조회 | 모달 |
| GET | `/tags` | 태그 목록 | 카테고리 칩 |

### 🔒 인증 필요 (Protected API)

| 메서드 | 경로 | 설명 | 인증 |
|--------|------|------|------|
| POST | `/items/{item_id}/claim` | 습득 신청 | Bearer Token |
| GET | `/items/me` | 내 신청 목록 | Bearer Token |
| GET | `/items/me/{item_id}` | 내 신청 상세 | Bearer Token |

---

## 현재 구조 vs 실제 API 차이점

### 1. API 응답 구조 차이

#### ❌ 현재 Mock 데이터
```typescript
interface LostItem {
  id: number;
  image: string;
  date: string;
  tag: string;           // 단일 문자열
  location: string;
  description: string;
}
```

#### ✅ 실제 API 응답
```json
{
  "id": 1,
  "location": "도서관",
  "status": "등록됨",
  "tags": [              // 배열로 변경!
    { "id": 1, "name": "전자기기" }
  ],
  "photo_url": "https://example.com/image.jpg",
  "registered_at": "2025-11-01T12:00:00"
}
```

**주요 차이점**:
- ❌ `image` → ✅ `photo_url`
- ❌ `date` → ✅ `registered_at`
- ❌ `tag` (string) → ✅ `tags` (Tag[])
- ❌ `description` → ✅ 필드 없음 (제거 필요)
- ✅ `status` 추가 (등록됨/신청됨/수령됨)

---

### 2. API 엔드포인트 차이

#### ❌ 현재 Mock API
```typescript
// /api/items?search=...&tags=...&page=1&limit=12
// 페이지네이션 포함
```

#### ✅ 실제 API
```
GET /items                    // 전체 조회
GET /items/search?location=...&tags=...  // 검색
```

**주요 차이점**:
- 검색이 별도 엔드포인트 (`/items/search`)
- 페이지네이션 정보 없음 (전체 데이터 반환)
- `search` 대신 `location` 파라미터 사용

---

## 연동 작업 체크리스트

### Phase 1: 기본 연동 (필수)
- [ ] 환경변수 설정 (API Base URL)
- [ ] 타입 정의 수정 (LostItem → Item)
- [ ] ItemService 실제 API로 전환
- [ ] 태그 API 연동
- [ ] 에러 처리 개선

### Phase 2: 인증 연동 (선택)
- [ ] 인증 상태 관리
- [ ] Bearer Token 처리
- [ ] 습득 신청 기능 구현
- [ ] 내 신청 목록 페이지 추가

### Phase 3: 최적화 (선택)
- [ ] React Query 도입
- [ ] 캐싱 전략
- [ ] Optimistic Update
- [ ] 에러 리트라이

---

## Step-by-Step 연동 가이드

### Step 1: 환경변수 설정 (5분)

**새 파일**: `.env.local`

```bash
# API Base URL (백엔드 서버 주소로 변경)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# 또는 배포된 서버
# NEXT_PUBLIC_API_BASE_URL=https://api.yourserver.com
```

**주의사항**:
- `NEXT_PUBLIC_` 접두사 필수 (클라이언트에서 접근)
- `.env.local`은 `.gitignore`에 포함되어 있음 (커밋 안 됨)
- 팀원과 공유 시 `.env.example` 파일 생성 권장

**.env.example** (선택):
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

---

### Step 2: 타입 정의 수정 (15분)

**파일**: `src/lib/types/lostItem.ts`

```typescript
// ===== 이전 타입 정의 (삭제) =====
// export interface LostItem { ... }

// ===== 새 타입 정의 =====

/**
 * 태그 정보
 */
export interface Tag {
  id: number;
  name: string;
}

/**
 * 분실물 상태
 */
export type ItemStatus = '등록됨' | '신청됨' | '수령됨';

/**
 * 분실물 아이템 (API 응답 구조)
 */
export interface Item {
  id: number;
  location: string;
  status: ItemStatus;
  tags: Tag[];
  photo_url: string | null;
  registered_at: string;  // ISO 8601 형식
}

/**
 * 습득 신청 응답
 */
export interface ClaimResponse {
  code: string;          // 수령 코드
  expires_at: string;    // 만료 시간
}

/**
 * 내 신청 아이템
 */
export interface MyClaimedItem extends Item {
  pickup_code: string;
  expires_at: string;
}

/**
 * API 응답 래퍼 (페이지네이션용 - 추후 사용)
 */
export interface ApiResponse<T> {
  items: T[];
  total: number;
  hasMore: boolean;
}

/**
 * 검색 파라미터
 */
export interface SearchParams {
  location?: string;
  tags?: string | string[];
}
```

**마이그레이션 노트**:
- `LostItem` → `Item` 으로 이름 변경
- `image` → `photo_url`
- `date` → `registered_at`
- `tag` → `tags` (배열)
- `description` 필드 제거

---

### Step 3: ItemService 수정 (30분)

**파일**: `src/lib/services/ItemService.ts` 전체 교체

```typescript
import { Item, Tag, ClaimResponse, MyClaimedItem, SearchParams } from '@/lib/types/lostItem';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

/**
 * API 에러 클래스
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * 분실물 관련 API 호출 서비스
 */
export class ItemService {
  /**
   * 서버 상태 확인
   */
  static async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health_check`);
      const text = await response.text();
      return text === 'OK';
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  /**
   * 전체 분실물 조회
   */
  static async fetchAllItems(): Promise<Item[]> {
    const response = await fetch(`${API_BASE_URL}/items`);

    if (!response.ok) {
      throw new ApiError(
        'Failed to fetch items',
        response.status,
        await response.json().catch(() => null)
      );
    }

    return response.json();
  }

  /**
   * 분실물 검색 (위치 + 태그)
   */
  static async searchItems(params: SearchParams): Promise<Item[]> {
    const queryParams = new URLSearchParams();

    if (params.location) {
      queryParams.append('location', params.location);
    }

    if (params.tags) {
      const tagsArray = Array.isArray(params.tags) ? params.tags : [params.tags];
      tagsArray.forEach(tag => queryParams.append('tags', tag));
    }

    const url = `${API_BASE_URL}/items/search?${queryParams}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new ApiError(
        'Failed to search items',
        response.status,
        await response.json().catch(() => null)
      );
    }

    return response.json();
  }

  /**
   * 특정 분실물 상세 조회
   */
  static async fetchItemById(itemId: number): Promise<Item> {
    const response = await fetch(`${API_BASE_URL}/items/${itemId}`);

    if (!response.ok) {
      throw new ApiError(
        'Failed to fetch item',
        response.status,
        await response.json().catch(() => null)
      );
    }

    return response.json();
  }

  /**
   * 태그 목록 조회
   */
  static async fetchTags(): Promise<Tag[]> {
    const response = await fetch(`${API_BASE_URL}/tags`);

    if (!response.ok) {
      throw new ApiError(
        'Failed to fetch tags',
        response.status,
        await response.json().catch(() => null)
      );
    }

    return response.json();
  }

  // ===== 인증 필요 API =====

  /**
   * 분실물 습득 신청
   * @param itemId 분실물 ID
   * @param token Bearer 토큰
   */
  static async claimItem(itemId: number, token: string): Promise<ClaimResponse> {
    const response = await fetch(`${API_BASE_URL}/items/${itemId}/claim`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new ApiError(
        'Failed to claim item',
        response.status,
        await response.json().catch(() => null)
      );
    }

    return response.json();
  }

  /**
   * 내가 신청한 분실물 목록
   */
  static async fetchMyItems(token: string): Promise<MyClaimedItem[]> {
    const response = await fetch(`${API_BASE_URL}/items/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new ApiError(
        'Failed to fetch my items',
        response.status,
        await response.json().catch(() => null)
      );
    }

    return response.json();
  }

  /**
   * 내가 신청한 분실물 상세
   */
  static async fetchMyItemById(itemId: number, token: string): Promise<MyClaimedItem> {
    const response = await fetch(`${API_BASE_URL}/items/me/${itemId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new ApiError(
        'Failed to fetch my item',
        response.status,
        await response.json().catch(() => null)
      );
    }

    return response.json();
  }
}
```

**주요 변경사항**:
- ✅ 실제 API 엔드포인트 사용
- ✅ `ApiError` 클래스로 에러 처리 개선
- ✅ Bearer Token 인증 지원
- ✅ `/items/search` 엔드포인트 사용
- ✅ 태그 API 추가

---

### Step 4: useItemSearch Hook 수정 (20분)

**파일**: `src/lib/hooks/useItemSearch.ts`

```typescript
import { useState, useCallback } from 'react';
import { Item } from '@/lib/types/lostItem';
import { ItemService, ApiError } from '@/lib/services/ItemService';
import { useDebounce } from './useDebounce';

/**
 * 검색어와 필터링 상태를 관리하는 Custom Hook
 */
export function useItemSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 300);
  const debouncedTags = useDebounce(selectedTags, 300);

  /**
   * 아이템을 검색합니다
   */
  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let data: Item[];

      // 검색어나 태그가 있으면 search API, 없으면 전체 조회
      if (debouncedSearch || debouncedTags.length > 0) {
        data = await ItemService.searchItems({
          location: debouncedSearch || undefined,
          tags: debouncedTags.length > 0 ? debouncedTags : undefined,
        });
      } else {
        data = await ItemService.fetchAllItems();
      }

      setItems(data);
      return { items: data, total: data.length, hasMore: false };
    } catch (err) {
      let errorMessage = 'Failed to fetch items';

      if (err instanceof ApiError) {
        errorMessage = `${err.message} (Status: ${err.status})`;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      console.error('Fetch error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, debouncedTags]);

  /**
   * 태그를 토글합니다
   */
  const toggleTag = useCallback((tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  }, []);

  /**
   * 모든 태그 선택을 해제합니다
   */
  const clearAllTags = useCallback(() => {
    setSelectedTags([]);
  }, []);

  /**
   * 검색 결과를 초기화합니다
   */
  const resetItems = useCallback(() => {
    setItems([]);
    setError(null);
  }, []);

  return {
    // 상태
    searchQuery,
    selectedTags,
    items,
    loading,
    error,
    debouncedSearch,
    debouncedTags,

    // 액션
    setSearchQuery,
    setItems,
    toggleTag,
    clearAllTags,
    fetchItems,
    resetItems,
  };
}
```

**주요 변경사항**:
- ✅ 페이지네이션 제거 (API가 전체 데이터 반환)
- ✅ 검색어/태그 유무에 따라 API 자동 선택
- ✅ ApiError 처리 추가

---

### Step 5: 카테고리 동적 로딩 (15분)

**파일**: `src/app/page.tsx` 수정

```typescript
// 기존 categories 상수 삭제
// const categories = ['시계', '지갑', ...];

// state로 변경
const [categories, setCategories] = useState<string[]>([]);
const [categoriesLoading, setCategoriesLoading] = useState(true);

// useEffect 추가 (컴포넌트 상단)
useEffect(() => {
  const loadCategories = async () => {
    try {
      const tags = await ItemService.fetchTags();
      setCategories(tags.map(tag => tag.name));
    } catch (err) {
      console.error('Failed to load categories:', err);
      // 실패 시 기본값 사용
      setCategories(['시계', '지갑', '카드', '인형', '가방', '우산', '열쇠', '핸드폰']);
    } finally {
      setCategoriesLoading(false);
    }
  };

  loadCategories();
}, []);
```

---

### Step 6: 컴포넌트 타입 수정 (10분)

타입이 `LostItem`에서 `Item`으로 변경되었으므로 모든 컴포넌트 수정 필요:

**파일들**:
- `src/components/ItemCard.tsx`
- `src/components/ItemModal.tsx`
- `src/app/page.tsx`

```typescript
// Before
import { LostItem } from '@/lib/types/lostItem';

// After
import { Item } from '@/lib/types/lostItem';

// Before
interface ItemCardProps {
  item: LostItem;
  onClick: () => void;
}

// After
interface ItemCardProps {
  item: Item;
  onClick: () => void;
}
```

**ItemCard.tsx 필드 매핑**:
```typescript
// Before
<p>{item.date}</p>
<p>{item.tag}</p>
<img src={item.image} />

// After
<p>{new Date(item.registered_at).toLocaleDateString()}</p>
<p>{item.tags.map(t => t.name).join(', ')}</p>
<img src={item.photo_url || ''} />
```

---

### Step 7: Mock API 제거 (5분)

**파일**: `src/app/api/items/route.ts` 삭제

```bash
rm src/app/api/items/route.ts
```

**설명**: 이제 실제 백엔드 API를 사용하므로 Mock API 불필요

---

### Step 8: 무한 스크롤 비활성화 (선택, 10분)

**이유**: 실제 API는 페이지네이션을 제공하지 않고 전체 데이터를 반환

**파일**: `src/app/page.tsx`

```typescript
// Before
const { observerTarget } = useInfiniteScroll(loadMore, { threshold: 0.5 });

// After
// 무한 스크롤 Hook 제거 또는 비활성화
// const { observerTarget } = useInfiniteScroll(() => {}, { threshold: 0.5 });
// 또는 완전히 제거하고 observerTarget div 제거
```

**참고**: 추후 백엔드에서 페이지네이션 API 제공 시 다시 활성화

---

## 테스트 가이드

### 1. 개발 서버 준비

**백엔드 서버 실행 확인**:
```bash
# 백엔드 서버가 http://localhost:8000에서 실행 중인지 확인
curl http://localhost:8000/health_check
# 응답: "OK"
```

**프론트엔드 환경변수 확인**:
```bash
# .env.local 파일 존재 확인
cat .env.local
# NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

---

### 2. 기본 연동 테스트

#### Test 1: 서버 상태 확인
```typescript
// 브라우저 콘솔에서 실행
import { ItemService } from '@/lib/services/ItemService';

const isHealthy = await ItemService.healthCheck();
console.log('Server healthy:', isHealthy);  // true 예상
```

#### Test 2: 전체 분실물 조회
```typescript
const items = await ItemService.fetchAllItems();
console.log('Total items:', items.length);
console.log('First item:', items[0]);
```

**예상 응답**:
```json
{
  "id": 1,
  "location": "도서관",
  "status": "등록됨",
  "tags": [{ "id": 1, "name": "전자기기" }],
  "photo_url": "https://example.com/image.jpg",
  "registered_at": "2025-11-01T12:00:00"
}
```

#### Test 3: 검색 기능
```typescript
const results = await ItemService.searchItems({
  location: '도서관',
  tags: ['전자기기']
});
console.log('Search results:', results);
```

#### Test 4: 태그 목록
```typescript
const tags = await ItemService.fetchTags();
console.log('Available tags:', tags);
```

---

### 3. UI 동작 테스트

#### ✅ 체크리스트

**기본 기능**:
- [ ] 페이지 로드 시 전체 분실물 표시
- [ ] 검색창에 위치 입력 → 관련 결과 표시
- [ ] 카테고리 칩 클릭 → 해당 태그 아이템만 표시
- [ ] 여러 카테고리 선택 → OR 조건으로 결과 표시
- [ ] X 버튼 → 필터 초기화
- [ ] 아이템 카드 클릭 → 상세 모달 (registered_at, tags 표시)

**에러 처리**:
- [ ] 백엔드 서버 중지 → 에러 메시지 표시
- [ ] 잘못된 검색 → 빈 결과 안내
- [ ] 네트워크 오류 → ErrorState 표시

**데이터 표시**:
- [ ] `registered_at` → 날짜 형식으로 변환 (예: 2025-11-01)
- [ ] `tags` → 쉼표로 구분된 문자열 (예: 전자기기, 서류)
- [ ] `photo_url` → 이미지 표시 (null이면 📦 아이콘)
- [ ] `status` → 뱃지로 표시 (등록됨/신청됨/수령됨)

---

### 4. 네트워크 디버깅

**Chrome DevTools**:
1. F12 → Network 탭
2. Fetch/XHR 필터 적용
3. 확인 항목:
   - Request URL: `http://localhost:8000/items`
   - Status: `200 OK`
   - Response: JSON 데이터

**일반적인 에러**:
- `ERR_CONNECTION_REFUSED`: 백엔드 서버 미실행
- `CORS Error`: 백엔드 CORS 설정 필요
- `404 Not Found`: 엔드포인트 경로 오류
- `500 Internal Server Error`: 백엔드 오류

---

## 트러블슈팅

### 1. CORS 에러

**증상**:
```
Access to fetch at 'http://localhost:8000/items' from origin 'http://localhost:3000'
has been blocked by CORS policy
```

**해결**:
백엔드에서 CORS 설정 필요 (FastAPI 예시):
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # 또는 ["*"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

### 2. 환경변수가 인식되지 않음

**증상**:
```
API_BASE_URL is undefined
```

**해결**:
1. `.env.local` 파일 확인
2. `NEXT_PUBLIC_` 접두사 확인
3. 개발 서버 재시작:
   ```bash
   # Ctrl+C로 중지 후
   npm run dev
   ```

---

### 3. 타입 에러

**증상**:
```
Property 'tag' does not exist on type 'Item'
```

**해결**:
1. 모든 `LostItem` → `Item` 변경 확인
2. `item.tag` → `item.tags[0].name` 수정
3. `item.image` → `item.photo_url` 수정
4. `item.date` → `item.registered_at` 수정

---

### 4. 빈 배열 반환

**증상**:
API 호출은 성공하지만 `items: []` 반환

**원인**:
- 백엔드 DB에 데이터 없음
- 검색 조건이 너무 엄격

**해결**:
1. 백엔드 DB에 테스트 데이터 추가
2. 검색 없이 전체 조회 테스트:
   ```typescript
   ItemService.fetchAllItems()
   ```

---

### 5. 이미지가 표시되지 않음

**증상**:
이미지 URL은 있지만 이미지 안 보임

**원인**:
- Next.js Image 컴포넌트의 `remotePatterns` 설정 누락
- 잘못된 이미지 URL

**해결**:
**파일**: `next.config.ts`
```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',  // 실제 이미지 호스트로 변경
      },
    ],
  },
};
```

---

## 추가 개선 사항 (선택)

### 1. React Query 도입

**장점**:
- 자동 캐싱
- 백그라운드 리페치
- Optimistic Update
- 로딩/에러 상태 자동 관리

**설치**:
```bash
npm install @tanstack/react-query
```

**예시**:
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['items'],
  queryFn: ItemService.fetchAllItems,
  staleTime: 5 * 60 * 1000, // 5분
});
```

---

### 2. 인증 Context 추가

**목적**: Bearer Token 전역 관리

**새 파일**: `src/contexts/AuthContext.tsx`
```typescript
import { createContext, useContext, useState } from 'react';

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('auth_token', newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('auth_token');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

---

### 3. 습득 신청 모달 추가

**기능**:
- 로그인 확인
- 습득 신청 API 호출
- 수령 코드 표시

**새 파일**: `src/components/ClaimModal.tsx`
```typescript
import { useState } from 'react';
import { ItemService } from '@/lib/services/ItemService';
import { useAuth } from '@/contexts/AuthContext';

interface ClaimModalProps {
  itemId: number;
  onClose: () => void;
}

export default function ClaimModal({ itemId, onClose }: ClaimModalProps) {
  const { token } = useAuth();
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleClaim = async () => {
    if (!token) {
      alert('로그인이 필요합니다');
      return;
    }

    setLoading(true);
    try {
      const response = await ItemService.claimItem(itemId, token);
      setCode(response.code);
    } catch (err) {
      alert('신청 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      {!code ? (
        <button onClick={handleClaim} disabled={loading}>
          {loading ? '처리 중...' : '습득 신청'}
        </button>
      ) : (
        <div>
          <h2>수령 코드</h2>
          <p className="text-4xl font-bold">{code}</p>
        </div>
      )}
    </div>
  );
}
```

---

## 체크리스트 요약

### 연동 전 준비
- [ ] 백엔드 서버 실행 확인
- [ ] API 명세 확인
- [ ] 환경변수 설정 (.env.local)

### 필수 작업
- [ ] 타입 정의 수정 (LostItem → Item)
- [ ] ItemService 실제 API로 전환
- [ ] useItemSearch Hook 수정
- [ ] 컴포넌트 타입 수정
- [ ] 카테고리 동적 로딩
- [ ] Mock API 제거

### 테스트
- [ ] Health Check 테스트
- [ ] 전체 조회 테스트
- [ ] 검색 기능 테스트
- [ ] 태그 목록 테스트
- [ ] UI 동작 확인

### 선택 작업
- [ ] React Query 도입
- [ ] 인증 Context 추가
- [ ] 습득 신청 기능 구현
- [ ] 내 신청 목록 페이지

---

**준비 완료! 🚀**

문제 발생 시 [트러블슈팅](#트러블슈팅) 섹션을 참고하세요.
