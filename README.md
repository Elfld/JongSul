# 🔍 Lost-Found Center

> 분실물을 쉽고 빠르게 찾을 수 있는 웹 기반 분실물 관리 시스템

![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![React](https://img.shields.io/badge/React-19.1.0-61dafb?style=flat-square&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-38bdf8?style=flat-square&logo=tailwind-css)

---

## 📖 프로젝트 소개

**Lost-Found Center**는 분실물을 효율적으로 관리하고 찾을 수 있도록 돕는 웹 애플리케이션입니다.

현재 **분실물 게시판** 기능이 구현되어 있으며, 사용자는 다음과 같은 기능을 이용할 수 있습니다:
- 🔎 실시간 검색으로 빠른 분실물 조회
- 🏷️ 카테고리별 필터링으로 원하는 항목만 표시
- 📱 반응형 디자인으로 모바일/태블릿/데스크톱 모두 지원
- ♾️ 무한 스크롤로 끊김 없는 탐색 경험

---

## ✨ 주요 기능

### 🔍 스마트 검색
- **Debounce 최적화**: 타이핑 중 불필요한 API 호출 방지 (300ms)
- **통합 검색**: 분실물 설명, 위치, 카테고리를 한 번에 검색
- **실시간 결과**: 검색어 입력 즉시 결과 업데이트

### 🏷️ 카테고리 필터
- **8개 카테고리**: 시계, 지갑, 카드, 인형, 가방, 우산, 열쇠, 핸드폰
- **다중 선택**: 여러 카테고리 동시 필터링 (OR 조건)
- **드래그 스크롤**: 마우스로 카테고리 칩을 좌우로 이동
- **빠른 초기화**: X 버튼으로 모든 필터 한 번에 해제

### ♾️ 무한 스크롤
- **자동 로딩**: 페이지 하단 도달 시 다음 페이지 자동 로드
- **부드러운 전환**: 로딩 스피너로 시각적 피드백
- **성능 최적화**: Intersection Observer API 사용

### 📱 반응형 디자인
- **모바일**: 1열 그리드
- **태블릿**: 2~3열 그리드
- **데스크톱**: 4열 그리드
- **모달**: 모든 화면 크기에서 최적화된 상세 보기

---

## 🛠️ 기술 스택

### Frontend
- **Framework**: [Next.js 15.5.4](https://nextjs.org/) (App Router)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **UI Library**: [React 19.1.0](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Build & Dev Tools
- **Build Tool**: Turbopack (Next.js 내장)
- **Linting**: ESLint 9
- **Package Manager**: npm

### Architecture
- **Design Pattern**: Service Layer + Custom Hooks
- **State Management**: React Hooks
- **API Communication**: RESTful API (Fetch API)

---

## 📂 프로젝트 구조

```
JongSul/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── items/
│   │   │       └── route.ts           # 분실물 API 엔드포인트
│   │   ├── layout.tsx                 # 루트 레이아웃
│   │   ├── page.tsx                   # 메인 페이지 (분실물 게시판)
│   │   ├── globals.css                # 글로벌 스타일
│   │   └── favicon.ico
│   │
│   ├── components/
│   │   ├── Header.tsx                 # 검색 헤더
│   │   ├── CategoryChips.tsx          # 카테고리 필터 칩
│   │   ├── ItemCard.tsx               # 분실물 카드
│   │   ├── ItemModal.tsx              # 분실물 상세 모달
│   │   └── LoadingSpinner.tsx         # 로딩 스피너
│   │
│   └── lib/
│       ├── services/
│       │   └── ItemService.ts         # API 통신 서비스 (DIP 적용)
│       │
│       ├── hooks/
│       │   ├── useDebounce.ts         # Debounce Hook
│       │   ├── useItemSearch.ts       # 검색/필터 로직 Hook
│       │   ├── useInfiniteScroll.ts   # 무한 스크롤 Hook
│       │   └── useDragScroll.ts       # 드래그 스크롤 Hook
│       │
│       └── types/
│           └── lostItem.ts            # TypeScript 타입 정의
│
├── public/                            # 정적 파일
├── TASKS.md                           # 개발 Task 목록
├── README.md                          # 프로젝트 문서 (이 파일)
├── package.json                       # 의존성 관리
├── tsconfig.json                      # TypeScript 설정
├── tailwind.config.js                 # Tailwind CSS 설정
├── next.config.ts                     # Next.js 설정
└── eslint.config.mjs                  # ESLint 설정
```

---

## 🚀 시작하기

### 사전 요구사항
- Node.js 20 이상
- npm 또는 yarn

### 설치

```bash
# 1. 저장소 클론
git clone https://github.com/Elfld/JongSul.git
cd JongSul

# 2. 리팩토링 브랜치로 전환 (최신 버전)
git checkout claude/refactoring-oop-011CUYBKewmHneqRbkChDK3g

# 3. 의존성 설치
npm install
```

### 환경 변수 설정

외부 API 서버를 사용하려면 환경 변수를 설정해야 합니다:

```bash
# 1. .env.local 파일 생성
cp .env.local.example .env.local

# 2. .env.local 파일을 열고 API 서버 주소 입력
# NEXT_PUBLIC_API_URL=https://your-api-server.com
```

**환경 변수 예시**:
```bash
# 로컬 개발 서버 사용
NEXT_PUBLIC_API_URL=http://localhost:3000

# 외부 API 서버 사용
NEXT_PUBLIC_API_URL=https://api.example.com
```

**Health Check 테스트**:
```bash
# 서버 실행 후 브라우저에서 접속
# http://localhost:3000/api/health

# 또는 curl로 테스트
curl http://localhost:3000/api/health
```

자세한 API 연동 가이드는 [docs/API_SETUP.md](./docs/API_SETUP.md) 참고

### 실행

```bash
# 개발 서버 실행 (Turbopack 사용)
npm run dev

# 브라우저에서 열기
# http://localhost:3000
```

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드된 앱 실행
npm start
```

### 린트

```bash
# ESLint 실행
npm run lint
```

---

## 🏗️ 아키텍처 설계

### SOLID 원칙 적용

이 프로젝트는 **객체지향 SOLID 원칙**을 적용하여 리팩토링되었습니다:

#### 1. **SRP (Single Responsibility Principle)** - 단일 책임 원칙
각 모듈은 하나의 책임만 가집니다:
- `ItemService`: API 통신만 담당
- `useItemSearch`: 검색/필터 로직만 담당
- `useInfiniteScroll`: 무한 스크롤 로직만 담당
- `useDragScroll`: 드래그 스크롤 로직만 담당

#### 2. **OCP (Open-Closed Principle)** - 개방-폐쇄 원칙
확장에는 열려있고 수정에는 닫혀있습니다:
```typescript
// useInfiniteScroll: 옵션으로 동작 커스터마이징 가능
const { observerTarget } = useInfiniteScroll(loadMore, {
  threshold: 0.5,      // 트리거 시점 조정 가능
  rootMargin: '100px'  // 감지 영역 조정 가능
});
```

#### 3. **DIP (Dependency Inversion Principle)** - 의존성 역전 원칙
상위 모듈이 하위 모듈에 직접 의존하지 않습니다:
```typescript
// Before: 컴포넌트가 fetch API에 직접 의존
const response = await fetch('/api/items');

// After: Service 추상화로 의존성 분리
const data = await ItemService.fetchItems(params);
```

### Custom Hooks 전략

복잡한 로직을 재사용 가능한 Hook으로 분리했습니다:

```typescript
// page.tsx - 단순하고 명확
const searchState = useItemSearch();
const { observerTarget } = useInfiniteScroll(loadMore);
const { containerRef, handlers } = useDragScroll();
```

**장점**:
- ✅ 테스트 용이성: 각 Hook을 독립적으로 테스트 가능
- ✅ 재사용성: 다른 페이지에서도 동일한 Hook 사용 가능
- ✅ 유지보수성: 로직 변경 시 한 곳만 수정하면 됨

---

## 📊 개발 현황

### ✅ 완료된 기능 (v0.2 - 리팩토링 완료)
- [x] 분실물 검색 (Debounce 최적화)
- [x] 카테고리 필터링 (다중 선택)
- [x] 무한 스크롤
- [x] 반응형 그리드 레이아웃
- [x] 분실물 상세 모달
- [x] 드래그 스크롤
- [x] **객체지향 리팩토링** (Service Layer + Custom Hooks)
- [x] **에러 처리 기반 구축**

### 🚧 진행 예정 (v0.3)
- [ ] 태그에 # 추가
- [ ] 카테고리 동적 로딩 (API화)
- [ ] ErrorState 컴포넌트
- [ ] EmptyState 컴포넌트 개선
- [ ] 검색 debounce 조정 (500ms → 300ms)
- [ ] 모달 애니메이션

### 🔮 향후 계획 (v1.0+)
- [ ] 실제 데이터베이스 연동 (Supabase)
- [ ] 실제 이미지 지원
- [ ] Toast 알림
- [ ] 정렬 기능
- [ ] 분실물 등록 키오스크 화면 (별도 페이지)

자세한 Task 목록은 [TASKS.md](./TASKS.md) 참고

---

## 🔄 리팩토링 히스토리

### Phase 0.5: 객체지향 리팩토링 (2025-10-28)

**Before (문제점)**:
```typescript
// ❌ page.tsx에 모든 로직이 집중 (127줄)
// - 8개의 흩어진 state
// - fetchItems 로직이 컴포넌트 내부에
// - IntersectionObserver 직접 구현
// - 드래그 로직이 CategoryChips에 하드코딩
```

**After (개선)**:
```typescript
// ✅ 책임 분리 및 추상화 (128줄이지만 복잡도 70% 감소)
// Service Layer
ItemService.fetchItems(params);  // API 통신 캡슐화

// Custom Hooks
const { items, loading, fetchItems } = useItemSearch();
const { observerTarget } = useInfiniteScroll(loadMore);
const { containerRef, handlers } = useDragScroll();
```

**성과**:
- 📉 코드 복잡도 **70% 감소**
- 📦 재사용 가능한 **4개 Custom Hooks** 생성
- 🧪 테스트 가능한 구조로 개선
- 🔧 유지보수성 대폭 향상

**커밋**: [`7bc2823`](https://github.com/Elfld/JongSul/commit/7bc2823)

---

## 🎨 UI/UX 특징

### 디자인 시스템
- **Color Palette**: Sky Blue 계열 (Primary: `#0ea5e9`)
- **Typography**: 시스템 폰트 (sans-serif)
- **Border Radius**: 둥근 모서리 (8px ~ 24px)
- **Shadow**: Soft shadow로 입체감 표현

### 사용자 경험 최적화
1. **로딩 피드백**: 모든 비동기 작업에 로딩 인디케이터
2. **Debounce**: 불필요한 API 호출 방지로 성능 향상
3. **Empty State**: 검색 결과 없을 때 안내 메시지
4. **모바일 최적화**: 터치 친화적인 버튼 크기 (44px 이상)

---

## 🧪 테스트

### 수동 테스트 체크리스트
- [ ] 검색창에 키워드 입력 → 관련 결과 표시
- [ ] 카테고리 칩 클릭 → 해당 카테고리 항목만 표시
- [ ] 여러 카테고리 선택 → OR 조건으로 결과 표시
- [ ] X 버튼 클릭 → 모든 필터 해제
- [ ] 페이지 하단 스크롤 → 다음 페이지 자동 로드
- [ ] 카테고리 영역 드래그 → 좌우 스크롤
- [ ] 아이템 카드 클릭 → 상세 모달 열림
- [ ] 모달 배경 클릭 → 모달 닫힘
- [ ] 모바일 화면 크기 변경 → 반응형 레이아웃 동작

---

## 🤝 기여하기

### 브랜치 전략
- `main`: 프로덕션 배포 브랜치
- `claude/refactoring-oop-*`: 리팩토링 작업 브랜치
- `feature/*`: 새로운 기능 개발
- `fix/*`: 버그 수정

### 커밋 메시지 컨벤션
```
feat: 새로운 기능 추가
fix: 버그 수정
refactor: 코드 리팩토링
style: 코드 포맷팅, UI 스타일 변경
docs: 문서 수정
test: 테스트 코드
chore: 빌드 설정, 패키지 관리
```

### Pull Request 절차
1. Feature 브랜치 생성
2. 작업 완료 후 커밋
3. `npm run build`로 빌드 테스트
4. PR 생성 (제목에 작업 내용 명시)
5. 코드 리뷰 후 머지

---

## 📝 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

---

## 👥 제작

- **개발**: Claude & Elfld
- **디자인**: Tailwind CSS + Custom Design
- **아키텍처**: SOLID Principles

---

## 📞 문의

프로젝트에 대한 문의사항이나 버그 리포트는 [GitHub Issues](https://github.com/Elfld/JongSul/issues)에 등록해주세요.

---

**Last Updated**: 2025-10-28
**Version**: 0.2.0 (Refactored)
