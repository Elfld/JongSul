# Lost-Found Center 개발 Tasks

> 📅 최종 업데이트: 2025-10-28
> 🔄 현재 브랜치: `claude/refactoring-oop-011CUYBKewmHneqRbkChDK3g`

---

## ✅ 완료된 작업

### Phase 0: 초기 구현 (완료)
- [x] Next.js 15 + TypeScript 프로젝트 셋업
- [x] 기본 UI 컴포넌트 구현 (Header, CategoryChips, ItemCard, ItemModal, LoadingSpinner)
- [x] 검색 기능 (debounce 500ms)
- [x] 태그 필터링 (debounce 300ms, OR 조건)
- [x] 무한 스크롤 기능
- [x] 반응형 그리드 레이아웃
- [x] Mock API (50개 데이터)
- [x] 드래그 스크롤 기능

### Phase 0.5: 객체지향 리팩토링 (완료)
- [x] Service Layer 분리 (`ItemService.ts`)
- [x] Custom Hooks 분리
  - [x] `useItemSearch.ts` - 검색/필터 로직
  - [x] `useInfiniteScroll.ts` - 무한 스크롤 로직
  - [x] `useDragScroll.ts` - 드래그 스크롤 로직
- [x] SOLID 원칙 적용
  - [x] SRP (단일 책임 원칙)
  - [x] OCP (개방-폐쇄 원칙)
  - [x] DIP (의존성 역전 원칙)
- [x] 코드 복잡도 70% 감소
- [x] 에러 처리 기반 구축

---

## 📋 진행 예정 작업

### Phase 1: 빠른 개선 (총 1시간 15분) ⚡

#### 1.1 태그에 # 추가
**우선순위**: 🔥 높음
**소요 시간**: 5분
**난이도**: ⭐ 쉬움

**파일**: `src/components/CategoryChips.tsx`

```typescript
// Line 65 수정
// Before:
<button>{tag}</button>

// After:
<button>#{tag}</button>
```

**검증 방법**:
- 브라우저에서 카테고리 칩이 "#시계", "#지갑" 형태로 표시되는지 확인

---

#### 1.2 검색 딜레이 조정
**우선순위**: 🔥 높음
**소요 시간**: 5분
**난이도**: ⭐ 쉬움

**파일**: `src/lib/hooks/useItemSearch.ts`

```typescript
// Line 18 수정
// Before:
const debouncedSearch = useDebounce(searchQuery, 500);

// After:
const debouncedSearch = useDebounce(searchQuery, 300);
```

**효과**: 검색 반응 속도 40% 개선 (500ms → 300ms)

**검증 방법**:
- 검색창에 입력 후 300ms 후에 API 호출되는지 Network 탭으로 확인

---

#### 1.3 EmptyState 컴포넌트 생성
**우선순위**: 🔥 높음
**소요 시간**: 15분
**난이도**: ⭐ 쉬움

**새 파일**: `src/components/EmptyState.tsx`

```typescript
interface EmptyStateProps {
  message?: string;
  icon?: string;
}

export default function EmptyState({
  message = '검색 결과가 없습니다',
  icon = '🔍'
}: EmptyStateProps) {
  return (
    <div className="text-center py-20">
      <div className="text-6xl mb-4">{icon}</div>
      <p className="text-gray-400 text-xl">{message}</p>
      <p className="text-gray-300 text-sm mt-2">다른 검색어로 시도해보세요</p>
    </div>
  );
}
```

**적용**: `src/app/page.tsx` Line 105-109 교체

```typescript
// Before:
{items.length === 0 && !loading && !initialLoading && (
  <div className="text-center py-20">
    <p className="text-gray-400 text-xl">검색 결과가 없습니다</p>
  </div>
)}

// After:
{items.length === 0 && !loading && !initialLoading && (
  <EmptyState />
)}
```

**검증 방법**:
- 존재하지 않는 키워드 검색 시 개선된 빈 상태 화면 확인

---

#### 1.4 ErrorState 컴포넌트 생성
**우선순위**: 🔥 높음
**소요 시간**: 20분
**난이도**: ⭐⭐ 중간

**새 파일**: `src/components/ErrorState.tsx`

```typescript
interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="text-center py-20">
      <div className="text-6xl mb-4">⚠️</div>
      <p className="text-red-500 text-xl mb-2">오류가 발생했습니다</p>
      <p className="text-gray-500 mb-6">{message}</p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors"
      >
        다시 시도
      </button>
    </div>
  );
}
```

**적용**: `src/app/page.tsx`에 에러 처리 추가

```typescript
// Line 28-40 수정 (useItemSearch에서 error 꺼내기)
const {
  searchQuery,
  selectedTags,
  items,
  loading,
  error,  // ← 추가
  debouncedSearch,
  debouncedTags,
  setSearchQuery,
  toggleTag,
  clearAllTags,
  fetchItems,
  resetItems,
} = useItemSearch();

// Line 97 아래 (main 태그 안)에 추가
{error && (
  <ErrorState
    message={error}
    onRetry={() => fetchItems(1, true)}
  />
)}
```

**검증 방법**:
- API를 강제로 실패시켜서 (네트워크 끊기) 에러 화면 확인
- "다시 시도" 버튼 클릭 시 재시도 동작 확인

---

#### 1.5 카테고리 동적 로딩
**우선순위**: 🟡 중간
**소요 시간**: 30분
**난이도**: ⭐⭐ 중간

**Step 1**: 카테고리 API 생성

**새 파일**: `src/app/api/categories/route.ts`

```typescript
import { NextResponse } from 'next/server';

// 추후 DB에서 가져올 수 있도록 분리
const CATEGORIES = [
  '시계', '지갑', '카드', '인형',
  '가방', '우산', '열쇠', '핸드폰'
];

export async function GET() {
  // Mock 딜레이 (실제 서비스에서는 제거)
  await new Promise(resolve => setTimeout(resolve, 100));

  return NextResponse.json({
    categories: CATEGORIES,
    success: true
  });
}
```

**Step 2**: Service 레이어에 추가

**파일**: `src/lib/services/ItemService.ts` 하단에 추가

```typescript
/**
 * 카테고리 목록을 조회합니다
 * @returns 카테고리 목록
 */
static async fetchCategories(): Promise<string[]> {
  const response = await fetch('/api/categories');

  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`);
  }

  const data = await response.json();
  return data.categories;
}
```

**Step 3**: page.tsx 수정

**파일**: `src/app/page.tsx`

```typescript
// Line 14 수정
// Before:
const categories = ['시계', '지갑', '카드', '인형', '가방', '우산', '열쇠', '핸드폰'];

// After:
const [categories, setCategories] = useState<string[]>([]);

// Line 50 아래에 추가 (첫 번째 useEffect 전에)
useEffect(() => {
  ItemService.fetchCategories()
    .then(setCategories)
    .catch(err => console.error('Failed to load categories:', err));
}, []);
```

**검증 방법**:
- 페이지 로드 시 카테고리가 정상적으로 표시되는지 확인
- Network 탭에서 `/api/categories` 호출 확인

---

### Phase 2: 품질 개선 (총 2시간 15분) 💎

#### 2.1 모달 애니메이션 추가
**우선순위**: 🟡 중간
**소요 시간**: 30분
**난이도**: ⭐⭐ 중간

**파일**: `src/components/ItemModal.tsx`

```typescript
// 상단에 import 추가
import { useState, useEffect } from 'react';

// 컴포넌트 시작 부분에 추가
const [isClosing, setIsClosing] = useState(false);
const [isVisible, setIsVisible] = useState(false);

useEffect(() => {
  // 마운트 시 애니메이션 시작
  setIsVisible(true);
}, []);

const handleClose = () => {
  setIsClosing(true);
  setTimeout(() => {
    onClose();
  }, 200); // 애니메이션 시간과 동일
};

// 기존 onClick={onClose}를 onClick={handleClose}로 변경

// className 수정
<div
  className={`fixed inset-0 bg-black transition-opacity duration-200 ${
    isClosing ? 'bg-opacity-0' : 'bg-opacity-50'
  }`}
  onClick={handleClose}
>
  <div
    className={`bg-white rounded-2xl w-full max-w-2xl transition-all duration-200 ${
      isClosing
        ? 'opacity-0 scale-95'
        : 'opacity-100 scale-100'
    }`}
    onClick={(e) => e.stopPropagation()}
  >
    {/* 기존 내용 */}
  </div>
</div>
```

**검증 방법**:
- 모달 열기/닫기 시 부드러운 fade in/out 애니메이션 확인

---

#### 2.2 타입 강화 (ItemTag enum)
**우선순위**: 🟢 낮음
**소요 시간**: 45분
**난이도**: ⭐⭐⭐ 어려움

**파일**: `src/lib/types/lostItem.ts`

```typescript
// 카테고리를 상수로 정의
export const ITEM_TAGS = [
  '시계', '지갑', '카드', '인형',
  '가방', '우산', '열쇠', '핸드폰'
] as const;

// 타입 추출
export type ItemTag = typeof ITEM_TAGS[number];

// LostItem 인터페이스 수정
export interface LostItem {
  id: number;
  image: string;
  date: string;
  tag: ItemTag;  // string → ItemTag
  location: string;
  description: string;
}
```

**파일**: `src/app/api/items/route.ts` Line 9 수정

```typescript
// Before:
tag: ['시계', '지갑', ...][i % 8],

// After:
import { ITEM_TAGS } from '@/lib/types/lostItem';
tag: ITEM_TAGS[i % 8],
```

**파일**: `src/app/api/categories/route.ts` 수정

```typescript
import { ITEM_TAGS } from '@/lib/types/lostItem';

export async function GET() {
  return NextResponse.json({
    categories: ITEM_TAGS,
    success: true
  });
}
```

**효과**:
- 잘못된 태그 입력 방지 (컴파일 타임 체크)
- IDE 자동완성 지원

**검증 방법**:
- 빌드 시 타입 에러 없는지 확인 (`npm run build`)

---

#### 2.3 실제 이미지 지원
**우선순위**: 🟡 중간
**소요 시간**: 1시간
**난이도**: ⭐⭐⭐ 어려움

**Step 1**: Next.js Image 컴포넌트 적용

**파일**: `src/components/ItemCard.tsx`

```typescript
// import 추가
import Image from 'next/image';

// Line 19-25 수정
// Before:
<div className="aspect-square bg-gradient-to-br from-sky-100 to-blue-100 rounded-xl flex items-center justify-center text-6xl">
  {item.image || '📦'}
</div>

// After:
<div className="aspect-square bg-gradient-to-br from-sky-100 to-blue-100 rounded-xl overflow-hidden relative">
  {item.image ? (
    <Image
      src={item.image}
      alt={item.description}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  ) : (
    <div className="flex items-center justify-center w-full h-full text-6xl">
      📦
    </div>
  )}
</div>
```

**파일**: `src/components/ItemModal.tsx` 동일하게 수정

**Step 2**: Mock 데이터에 이미지 URL 추가

**파일**: `src/app/api/items/route.ts`

```typescript
// 샘플 이미지 URL (Unsplash 또는 placeholder)
const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30', // 시계
  'https://images.unsplash.com/photo-1627123424574-724758594e93', // 지갑
  // ... 더 추가
  '',  // 이미지 없는 케이스도 테스트
];

// Line 5-12 수정
const allMockData: LostItem[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  image: SAMPLE_IMAGES[i % SAMPLE_IMAGES.length],  // 이미지 추가
  date: `2025-10-${String(10 - Math.floor(i / 5)).padStart(2, '0')}`,
  tag: ITEM_TAGS[i % 8],
  location: ['홍대 스타벅스', '홍대입구역', '신촌 백화점', '강남역', '홍대 CU'][i % 5],
  description: `${i + 1}번 분실물 설명`,
}));
```

**Step 3**: next.config.ts에 이미지 도메인 추가

**파일**: `next.config.ts`

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
```

**검증 방법**:
- 이미지가 있는 아이템: 실제 이미지 표시
- 이미지가 없는 아이템: 📦 아이콘 표시
- ESLint 경고 해결 확인 (no-img-element)

---

### Phase 3: 고급 기능 (선택 사항) 🚀

#### 3.1 DB 연동 (Supabase)
**우선순위**: 🔴 결정 필요
**소요 시간**: 3~5시간
**난이도**: ⭐⭐⭐⭐ 매우 어려움

**사전 준비**:
- [ ] Supabase 계정 생성
- [ ] 프로젝트 생성
- [ ] 환경변수 설정 (`.env.local`)

**Step 1**: Supabase 설치

```bash
npm install @supabase/supabase-js
```

**Step 2**: Supabase 클라이언트 설정

**새 파일**: `src/lib/supabase/client.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**Step 3**: 테이블 스키마 생성

Supabase SQL Editor에서 실행:

```sql
CREATE TABLE lost_items (
  id BIGSERIAL PRIMARY KEY,
  image TEXT,
  date DATE NOT NULL,
  tag TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_lost_items_tag ON lost_items(tag);
CREATE INDEX idx_lost_items_date ON lost_items(date DESC);
CREATE INDEX idx_lost_items_location ON lost_items(location);

-- 전체 텍스트 검색 인덱스
CREATE INDEX idx_lost_items_search ON lost_items
USING gin(to_tsvector('korean', description || ' ' || location || ' ' || tag));
```

**Step 4**: API 수정

**파일**: `src/app/api/items/route.ts` 전체 교체

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get('search') || '';
  const tags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');

  try {
    let query = supabase
      .from('lost_items')
      .select('*', { count: 'exact' });

    // 태그 필터링
    if (tags.length > 0) {
      query = query.in('tag', tags);
    }

    // 검색
    if (search) {
      query = query.or(`description.ilike.%${search}%,location.ilike.%${search}%,tag.ilike.%${search}%`);
    }

    // 페이지네이션
    const startIndex = (page - 1) * limit;
    query = query
      .order('date', { ascending: false })
      .range(startIndex, startIndex + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      items: data || [],
      total: count || 0,
      hasMore: (count || 0) > page * limit,
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    );
  }
}
```

**검증 방법**:
- Supabase 대시보드에서 데이터 확인
- API 호출 시 실제 DB 데이터 반환 확인

---

#### 3.2 Toast 알림 (Sonner)
**우선순위**: 🟢 낮음
**소요 시간**: 1시간
**난이도**: ⭐⭐ 중간

```bash
npm install sonner
```

**적용 예시**:
- 검색 실패 시 알림
- 네트워크 에러 알림
- 데이터 로드 완료 알림

---

#### 3.3 정렬 기능
**우선순위**: 🟢 낮음
**소요 시간**: 1.5시간
**난이도**: ⭐⭐ 중간

**추가할 정렬 옵션**:
- 최신순 (기본)
- 오래된순
- 위치순

---

## 📌 작업 진행 가이드

### 작업 전 체크리스트
- [ ] 현재 브랜치 확인 (`git branch`)
- [ ] 최신 코드 pull (`git pull origin <branch>`)
- [ ] 의존성 설치 확인 (`npm install`)
- [ ] 개발 서버 실행 테스트 (`npm run dev`)

### 작업 중
- [ ] 작업 시작 전 해당 task를 `[x]`로 체크
- [ ] 코드 변경 후 즉시 테스트
- [ ] 타입 에러 확인 (IDE에서)

### 작업 완료 후
- [ ] 빌드 테스트 (`npm run build`)
- [ ] 브라우저에서 기능 동작 확인
- [ ] 커밋 (`git commit -m "feat: <작업 내용>"`)
- [ ] 푸시 (`git push origin <branch>`)

---

## 🎯 진행 상황 추적

### Week 1 (현재)
- [x] Phase 0: 초기 구현
- [x] Phase 0.5: 객체지향 리팩토링
- [ ] Phase 1: 빠른 개선 (5개 작업)

### Week 2 (예정)
- [ ] Phase 2: 품질 개선 (3개 작업)

### Week 3+ (선택)
- [ ] Phase 3: 고급 기능

---

## 💡 참고 사항

### 커밋 메시지 컨벤션
```
feat: 새로운 기능 추가
fix: 버그 수정
refactor: 코드 리팩토링
style: 코드 포맷팅, 세미콜론 등
docs: 문서 수정
test: 테스트 코드
chore: 빌드 업무, 패키지 매니저 설정
```

### 브랜치 전략
- `main`: 프로덕션 코드
- `claude/refactoring-oop-*`: 리팩토링 브랜치 (현재)
- `feature/*`: 새 기능 브랜치
- `fix/*`: 버그 수정 브랜치

### 도움이 필요할 때
- TypeScript 에러: 타입 정의 확인
- 빌드 에러: `node_modules` 삭제 후 재설치
- 런타임 에러: 브라우저 콘솔 확인

---

**Good Luck! 🚀**
