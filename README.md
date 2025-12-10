# 인하대 분실물 센터

> 분실물을 쉽고 빠르게 찾을 수 있는 웹 기반 분실물 관리 시스템

![Next.js](https://img.shields.io/badge/Next.js-15.5.7-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![React](https://img.shields.io/badge/React-19.2.1-61dafb?style=flat-square&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-38bdf8?style=flat-square&logo=tailwind-css)

---

## 프로젝트 소개

**인하대 분실물 센터 (JongSul)**는 인하대학교 분실물을 효율적으로 관리하고 찾을 수 있도록 돕는 웹 애플리케이션입니다.

**주요 특징**:
- 실시간 검색 및 동적 태그 필터링
- 분실물 소유권 주장 및 픽업 코드 발급
- 예약 내역 조회 및 취소
- JWT 기반 인증 시스템
- 완전한 반응형 디자인 (모바일/태블릿/데스크톱)

---

## 주요 기능

### 1. 분실물 검색 및 조회
- **실시간 검색**: Debounce 최적화 (300ms)로 타이핑 중 불필요한 API 호출 방지
- **동적 태그 필터**: API에서 태그 목록을 동적으로 로드하여 다중 선택 필터링
- **드래그 스크롤**: 태그 영역을 마우스로 좌우 드래그
- **상태 표시**: 보관/예약중/수령완료 상태를 배지로 표시

### 2. 소유권 주장 (Claim)
- **서약서 동의**: 분실물 소유권 주장 전 법적 서약 확인
- **픽업 코드 발급**: 6자리 픽업 코드 생성 (7일 유효)
- **로그인 보호**: 소유권 주장 시 자동 로그인 체크

### 3. 마이페이지
- **예약 목록**: 내가 예약한 분실물 조회
- **픽업 코드 확인**: 수령 대기 중인 아이템의 픽업 코드 표시
- **예약 취소**: 다양한 사유로 예약 취소 가능 (기타 사유 직접 입력 지원)

### 4. 인증 시스템
- **회원가입**: 이메일, 비밀번호, 이름, 연락처(선택) 입력
- **로그인**: JWT 토큰 기반 인증
- **인증 가드**: 보호된 페이지 자동 리다이렉트

### 5. 반응형 디자인
- **모바일**: 1열 그리드
- **태블릿**: 2-3열 그리드
- **데스크톱**: 4열 그리드
- **최적화된 모달**: 모든 화면 크기에서 최적화된 상세 보기

---

## 기술 스택

### Frontend
- **Framework**: Next.js 15.5.7 (App Router)
- **Language**: TypeScript 5
- **UI Library**: React 19.2.1
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React

### Architecture
- **Design Pattern**: Service Layer + Custom Hooks
- **State Management**: React Context + Hooks
- **API Communication**: RESTful API (Fetch API)
- **Authentication**: JWT Bearer Token (localStorage)

### Build & Dev Tools
- **Build Tool**: Turbopack (Next.js 내장)
- **Linting**: ESLint 9
- **Package Manager**: npm

---

## 프로젝트 구조

```
JongSul/
├── src/
│   ├── app/
│   │   ├── api/                        # API 프록시 레이어 (11개 엔드포인트)
│   │   │   ├── health/                # Health check
│   │   │   ├── items/                 # 분실물 API
│   │   │   ├── tags/                  # 태그 API
│   │   │   └── users/                 # 사용자 API
│   │   │
│   │   ├── claim/[id]/page.tsx        # 소유권 주장 페이지
│   │   ├── mypage/page.tsx            # 마이페이지
│   │   ├── login/page.tsx             # 로그인
│   │   ├── register/page.tsx          # 회원가입
│   │   ├── page.tsx                   # 메인 페이지
│   │   ├── layout.tsx                 # 루트 레이아웃
│   │   ├── icon.png                   # Favicon
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── claim/                     # 소유권 주장 컴포넌트
│   │   ├── mypage/                    # 마이페이지 컴포넌트
│   │   ├── Header.tsx                 # 검색 헤더
│   │   ├── CategoryChips.tsx          # 태그 필터
│   │   ├── ItemCard.tsx               # 분실물 카드
│   │   ├── ItemModal.tsx              # 상세 모달
│   │   └── ...
│   │
│   └── lib/
│       ├── api/
│       │   └── tags.ts                # TagService (SOLID 원칙 적용)
│       ├── contexts/
│       │   └── AuthContext.tsx        # 인증 컨텍스트
│       ├── hooks/
│       │   ├── useDebounce.ts         # Debounce Hook
│       │   ├── useItemSearch.ts       # 검색/필터 Hook
│       │   ├── useDragScroll.ts       # 드래그 스크롤 Hook
│       │   └── ...
│       └── types/
│           └── lostItem.ts            # TypeScript 타입 정의
│
├── docs/
│   ├── FEATURE_SPECIFICATION.md       # 상세 기능 명세서
│   └── API_SPEC.md                    # API 명세서
│
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── eslint.config.mjs
```

---

## 아키텍처 설계

### SOLID 원칙 적용

#### 1. SRP (Single Responsibility Principle)
각 모듈은 하나의 책임만 가집니다:
- `TagService`: 태그 API 통신만 담당
- `AuthContext`: 인증 상태 관리만 담당
- `useItemSearch`: 검색/필터 로직만 담당
- `useDragScroll`: 드래그 스크롤 로직만 담당

#### 2. OCP (Open-Closed Principle)
확장에는 열려있고 수정에는 닫혀있습니다:
- Custom Hooks로 옵션 기반 동작 커스터마이징
- 컴포넌트 Props로 다양한 사용 사례 지원

#### 3. DIP (Dependency Inversion Principle)
상위 모듈이 하위 모듈에 직접 의존하지 않습니다:
```typescript
// Service 추상화로 의존성 분리
const tags = await TagService.fetchAllTags();
```

### Custom Hooks 전략

복잡한 로직을 재사용 가능한 Hook으로 분리:

```typescript
// 단순하고 명확한 페이지 구조
const searchState = useItemSearch();
const { containerRef, handlers } = useDragScroll();
```

**장점**:
- **테스트 용이성**: 각 Hook을 독립적으로 테스트 가능
- **재사용성**: 다른 페이지에서도 동일한 Hook 사용 가능
- **유지보수성**: 로직 변경 시 한 곳만 수정

---

## 시작하기

### 사전 요구사항
- Node.js 20 이상
- npm

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/Elfld/JongSul.git
cd JongSul

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정
# .env.local 파일 생성 후 API_BASE_URL 설정
echo "API_BASE_URL=https://your-api-server.com/main" > .env.local

# 4. 개발 서버 실행
npm run dev

# 브라우저에서 http://localhost:3000 접속
```

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드된 앱 실행
npm start

# 린트 검사
npm run lint
```

---

## 구현된 기능

- ✅ 분실물 검색 (Debounce 300ms)
- ✅ 동적 태그 필터링 (다중 선택, OR 조건)
- ✅ 드래그 스크롤
- ✅ 반응형 그리드 레이아웃
- ✅ 분실물 상세 모달
- ✅ 회원가입 및 로그인
- ✅ 소유권 주장 (Claim)
- ✅ 픽업 코드 발급 및 표시
- ✅ 마이페이지 (예약 목록 조회)
- ✅ 예약 취소 기능
- ✅ API 프록시 레이어 (11개 엔드포인트)
- ✅ JWT 기반 인증 시스템
- ✅ 에러 처리 및 사용자 피드백

---

## 디자인 시스템

### 색상 팔레트
- **Primary**: Sky Blue (#0ea5e9) - 인하대 브랜드 컬러
- **Success**: Green
- **Warning**: Pink
- **Neutral**: Gray
- **Error**: Red

### UX 최적화
1. **로딩 피드백**: 모든 비동기 작업에 로딩 인디케이터
2. **Debounce**: 검색 시 불필요한 API 호출 방지 (300ms)
3. **Empty State**: 검색 결과 없을 때 안내 메시지
4. **모바일 최적화**: 터치 친화적인 버튼 크기 (44px 이상)
5. **반응형 헤더**: 화면 크기에 따라 검색바 자동 축소/확장

---

## 문서

자세한 내용은 다음 문서를 참조하세요:

- [기능 명세서](./docs/FEATURE_SPECIFICATION.md): 전체 기능 및 API 상세 설명
- [API 명세서](./docs/API_SPEC.md): REST API 엔드포인트 명세

---

**Version**: 1.1.0
**Last Updated**: 2025-12-10
