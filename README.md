# Lost-Found Center

> 분실물을 쉽고 빠르게 찾을 수 있는 웹 기반 분실물 관리 시스템

![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![React](https://img.shields.io/badge/React-19.1.0-61dafb?style=flat-square&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-38bdf8?style=flat-square&logo=tailwind-css)

---

## 프로젝트 소개

**Lost-Found Center (JongSul)**는 분실물을 효율적으로 관리하고 찾을 수 있도록 돕는 웹 애플리케이션입니다.

사용자는 다음과 같은 기능을 이용할 수 있습니다:
- 실시간 검색으로 빠른 분실물 조회
- 동적 태그 필터링으로 원하는 항목만 표시
- 분실물 소유권 주장 및 픽업 코드 발급
- 예약 내역 조회 및 취소
- 반응형 디자인으로 모바일/태블릿/데스크톱 모두 지원

---

## 주요 기능

### 분실물 검색 및 조회
- **실시간 검색**: Debounce 최적화 (300ms)로 타이핑 중 불필요한 API 호출 방지
- **동적 태그 필터**: API에서 태그 목록을 동적으로 로드하여 다중 선택 필터링 (OR 조건)
- **드래그 스크롤**: 태그 영역을 마우스로 좌우 드래그
- **상태 표시**: 보관/예약중/수령완료 상태를 배지로 표시

### 소유권 주장 (Claim)
- **서약서 동의**: 분실물 소유권 주장 전 법적 서약 확인
- **픽업 코드 발급**: 6자리 픽업 코드 생성 (7일 유효)
- **로그인 보호**: 소유권 주장 시 자동 로그인 체크

### 마이페이지
- **예약 목록**: 내가 예약한 분실물 조회
- **픽업 코드 확인**: 수령 대기 중인 아이템의 픽업 코드 표시
- **예약 취소**: 다양한 사유로 예약 취소 가능 (기타 사유 직접 입력 지원)
- **알림 설정**: 태그별 알림 수신 설정 (UI만 구현, 실제 알림 기능 미구현)

### 인증 시스템
- **회원가입**: 이메일, 비밀번호, 이름, 연락처(선택) 입력
- **로그인**: JWT 토큰 기반 인증
- **인증 가드**: 보호된 페이지 자동 리다이렉트

### 반응형 디자인
- **모바일**: 1열 그리드
- **태블릿**: 2-3열 그리드
- **데스크톱**: 4열 그리드
- **모달**: 모든 화면 크기에서 최적화된 상세 보기

---

## 기술 스택

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
- **State Management**: React Context + Hooks
- **API Communication**: RESTful API (Fetch API)
- **Authentication**: JWT Bearer Token (localStorage)

---

## 프로젝트 구조

```
JongSul/
├── src/
│   ├── app/
│   │   ├── api/                        # API 프록시 레이어
│   │   │   ├── health/route.ts
│   │   │   ├── items/
│   │   │   │   ├── route.ts           # GET /api/items
│   │   │   │   ├── search/route.ts    # GET /api/items/search
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── route.ts       # GET /api/items/{id}
│   │   │   │   │   └── claim/route.ts # POST /api/items/{id}/claim
│   │   │   │   └── me/
│   │   │   │       ├── route.ts        # GET /api/items/me
│   │   │   │       └── [id]/
│   │   │   │           ├── route.ts    # GET /api/items/me/{id}
│   │   │   │           └── cancel/route.ts # POST /api/items/me/{id}/cancel
│   │   │   ├── tags/route.ts           # GET /api/tags
│   │   │   └── users/
│   │   │       ├── login/route.ts      # POST /api/users/login
│   │   │       └── register/route.ts   # POST /api/users/register
│   │   │
│   │   ├── claim/[id]/page.tsx         # 소유권 주장 페이지
│   │   ├── mypage/page.tsx             # 마이페이지
│   │   ├── login/page.tsx              # 로그인
│   │   ├── register/page.tsx           # 회원가입
│   │   ├── page.tsx                    # 메인 페이지
│   │   ├── layout.tsx                  # 루트 레이아웃
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── claim/
│   │   │   ├── ClaimAgreement.tsx      # 서약서
│   │   │   └── ClaimCodeDisplay.tsx    # 픽업 코드 표시
│   │   ├── mypage/
│   │   │   ├── ClaimedItemCard.tsx     # 예약 카드
│   │   │   ├── MyPageItemDetailModal.tsx # 예약 상세 모달
│   │   │   ├── CancelReservationModal.tsx # 취소 모달
│   │   │   └── NotificationSettings.tsx # 알림 설정
│   │   ├── Header.tsx                   # 검색 헤더
│   │   ├── CategoryChips.tsx            # 태그 필터 칩
│   │   ├── ItemCard.tsx                 # 분실물 카드
│   │   ├── ItemModal.tsx                # 분실물 상세 모달
│   │   ├── LoadingSpinner.tsx           # 로딩 스피너
│   │   └── ConfirmDialog.tsx            # 확인 대화상자
│   │
│   └── lib/
│       ├── api/
│       │   └── tags.ts                  # TagService
│       ├── contexts/
│       │   └── AuthContext.tsx          # 인증 컨텍스트
│       ├── hooks/
│       │   ├── useDebounce.ts           # Debounce Hook
│       │   ├── useItemSearch.ts         # 검색/필터 Hook
│       │   └── useDragScroll.ts         # 드래그 스크롤 Hook
│       └── types/
│           └── lostItem.ts              # TypeScript 타입 정의
│
├── docs/                                # 문서
│   ├── FEATURE_SPECIFICATION.md         # 기능 명세서
│   └── BUILD_STATUS.md                  # 구축 상태
├── public/                              # 정적 파일
├── README.md                            # 프로젝트 문서 (이 파일)
├── package.json                         # 의존성 관리
├── tsconfig.json                        # TypeScript 설정
├── tailwind.config.ts                   # Tailwind CSS 설정
├── next.config.ts                       # Next.js 설정
└── eslint.config.mjs                    # ESLint 설정
```

---

## 시작하기

### 사전 요구사항
- Node.js 20 이상
- npm 또는 yarn

### 설치

```bash
# 1. 저장소 클론
git clone https://github.com/Elfld/JongSul.git
cd JongSul

# 2. 의존성 설치
npm install
```

### 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 입력합니다:

```bash
# API 서버 주소
API_BASE_URL=https://your-api-server.com/main
```

**예시**:
```bash
API_BASE_URL=https://skubr5x2p0.execute-api.us-west-2.amazonaws.com/main
```

**Health Check 테스트**:
```bash
# 서버 실행 후 브라우저에서 접속
# http://localhost:3000/api/health

# 또는 curl로 테스트
curl http://localhost:3000/api/health
```

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

## 아키텍처 설계

### SOLID 원칙 적용

이 프로젝트는 **객체지향 SOLID 원칙**을 적용하여 설계되었습니다:

#### 1. SRP (Single Responsibility Principle) - 단일 책임 원칙
각 모듈은 하나의 책임만 가집니다:
- `TagService`: 태그 API 통신만 담당
- `AuthContext`: 인증 상태 관리만 담당
- `useItemSearch`: 검색/필터 로직만 담당
- `useDragScroll`: 드래그 스크롤 로직만 담당

#### 2. OCP (Open-Closed Principle) - 개방-폐쇄 원칙
확장에는 열려있고 수정에는 닫혀있습니다:
- Custom Hooks로 옵션 기반 동작 커스터마이징
- 컴포넌트 Props로 다양한 사용 사례 지원

#### 3. DIP (Dependency Inversion Principle) - 의존성 역전 원칙
상위 모듈이 하위 모듈에 직접 의존하지 않습니다:
```typescript
// Before: 컴포넌트가 fetch API에 직접 의존
const response = await fetch('/api/tags');

// After: Service 추상화로 의존성 분리
const tags = await TagService.fetchAllTags();
```

### Custom Hooks 전략

복잡한 로직을 재사용 가능한 Hook으로 분리했습니다:

```typescript
// page.tsx - 단순하고 명확
const searchState = useItemSearch();
const { containerRef, handlers } = useDragScroll();
```

**장점**:
- 테스트 용이성: 각 Hook을 독립적으로 테스트 가능
- 재사용성: 다른 페이지에서도 동일한 Hook 사용 가능
- 유지보수성: 로직 변경 시 한 곳만 수정하면 됨

---

## 개발 현황

### 완료된 기능 (v1.0.0)
- [x] 분실물 검색 (Debounce 300ms)
- [x] 동적 태그 필터링 (다중 선택, OR 조건)
- [x] 드래그 스크롤
- [x] 반응형 그리드 레이아웃
- [x] 분실물 상세 모달
- [x] 회원가입 및 로그인
- [x] 소유권 주장 (Claim)
- [x] 픽업 코드 발급 및 표시
- [x] 마이페이지
- [x] 예약 취소 기능
- [x] API 프록시 레이어 (11개 엔드포인트)
- [x] 인증 시스템 (JWT Token)
- [x] 상태 매핑 (보관/예약/찾음)
- [x] 에러 처리 및 로깅

### 진행 중 (v1.1.0)
- [ ] UI 보안 강화
  - 버튼 핸들러 검증
  - 마이페이지 스켈레톤 노출 방지
  - 폼 검증 강화

### 향후 계획 (v2.0+)
- [ ] Next.js Middleware (서버 레벨 라우트 보호)
- [ ] 토큰 검증 API
- [ ] Refresh Token 지원
- [ ] 실시간 알림 시스템
- [ ] 관리자 페이지
- [ ] 통계 대시보드
- [ ] 단위 테스트 작성
- [ ] CI/CD 파이프라인

자세한 내용은 [docs/BUILD_STATUS.md](./docs/BUILD_STATUS.md) 참고

---

## 디자인 시스템

### 색상
- **Primary**: Sky Blue (#0ea5e9)
- **Success**: Green
- **Warning**: Pink
- **Neutral**: Gray
- **Error**: Red

### 타이포그래피
- 시스템 폰트 (sans-serif)
- 둥근 모서리 (8px ~ 24px)
- Soft shadow로 입체감 표현

### UX 최적화
1. **로딩 피드백**: 모든 비동기 작업에 로딩 인디케이터
2. **Debounce**: 불필요한 API 호출 방지 (300ms)
3. **Empty State**: 검색 결과 없을 때 안내 메시지
4. **모바일 최적화**: 터치 친화적인 버튼 크기 (44px 이상)

---

## 테스트

### 수동 테스트 체크리스트
- [ ] 검색창에 키워드 입력 시 관련 결과 표시
- [ ] 태그 칩 클릭 시 해당 태그 항목만 표시
- [ ] 여러 태그 선택 시 OR 조건으로 결과 표시
- [ ] X 버튼 클릭 시 모든 필터 해제
- [ ] 태그 영역 드래그 시 좌우 스크롤
- [ ] 아이템 카드 클릭 시 상세 모달 열림
- [ ] 모달 배경 클릭 시 모달 닫힘
- [ ] 회원가입 및 로그인 정상 동작
- [ ] 소유권 주장 시 픽업 코드 발급
- [ ] 마이페이지에서 예약 목록 조회
- [ ] 예약 취소 정상 동작
- [ ] 모바일 화면 크기 변경 시 반응형 레이아웃 동작

---

## 기여하기

### 브랜치 전략
- `main`: 프로덕션 배포 브랜치
- `claude/*`: Claude AI 작업 브랜치
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

## 문서

- [기능 명세서](./docs/FEATURE_SPECIFICATION.md): 전체 기능 상세 설명
- [구축 상태](./docs/BUILD_STATUS.md): 현재 구축 현황 및 로드맵

---

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

---

## 제작

- **개발**: Claude & Elfld
- **디자인**: Tailwind CSS + Custom Design
- **아키텍처**: SOLID Principles

---

## 문의

프로젝트에 대한 문의사항이나 버그 리포트는 [GitHub Issues](https://github.com/Elfld/JongSul/issues)에 등록해주세요.

---

**Last Updated**: 2025-11-21
**Version**: 1.0.0
