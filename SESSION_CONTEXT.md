# 🔄 JongSul 프로젝트 컨텍스트

> **새 세션 시작 시 이 문서를 먼저 읽으세요.**
>
> **최종 업데이트**: 2025-11-22
> **현재 버전**: v1.0.0

---

## 📌 프로젝트 한 줄 요약

**분실물 자동 분류 등록기 키오스크 장치**의 **웹 프론트엔드** 부분

---

## 🎯 현재 상태

| 항목 | 상태 |
|------|------|
| 핵심 기능 | ✅ 100% 완료 |
| API 연동 | ✅ 11개 엔드포인트 완료 |
| 테스트 커버리지 | ❌ 0% |
| 배포 | ❌ 미정 |

### 완료된 기능
- 메인 페이지 (검색, 태그 필터, 드래그 스크롤, 상세 모달)
- 소유권 주장 페이지 (서약서, 픽업 코드 발급)
- 마이페이지 (예약 목록, 상세 조회, 예약 취소)
- 로그인/회원가입
- JWT 인증 시스템
- 반응형 디자인

### 다음 작업
`next_tasks.md` 참조 - 보안 강화, 테스트 작성, UX 개선 등

---

## 🛠️ 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | Next.js 15.5.4 (App Router) |
| Language | TypeScript 5 |
| UI | React 19.1.0 |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |
| Build | Turbopack |

### 아키텍처
- **패턴**: Service Layer + Custom Hooks
- **상태 관리**: React Context (AuthContext)
- **API**: RESTful (Fetch API) + 프록시 레이어
- **인증**: JWT Bearer Token (localStorage)

---

## 📁 핵심 파일 구조

```
JongSul/
├── src/
│   ├── app/
│   │   ├── api/                    # API 프록시 (11개)
│   │   │   ├── items/              # 분실물 CRUD
│   │   │   ├── tags/               # 태그 목록
│   │   │   └── users/              # 인증
│   │   ├── page.tsx                # 메인 (분실물 목록)
│   │   ├── claim/[id]/page.tsx     # 소유권 주장
│   │   ├── mypage/page.tsx         # 마이페이지
│   │   ├── login/page.tsx          # 로그인
│   │   └── register/page.tsx       # 회원가입
│   │
│   ├── components/
│   │   ├── Header.tsx              # 검색 헤더
│   │   ├── CategoryChips.tsx       # 태그 필터
│   │   ├── ItemCard.tsx            # 분실물 카드
│   │   ├── ItemModal.tsx           # 상세 모달
│   │   ├── claim/                  # 서약서 관련
│   │   └── mypage/                 # 마이페이지 관련
│   │
│   └── lib/
│       ├── api/tags.ts             # TagService
│       ├── contexts/AuthContext.tsx # 인증 상태
│       ├── hooks/                  # Custom Hooks
│       └── types/lostItem.ts       # TypeScript 타입
│
├── docs/                           # 상세 문서
│   ├── FEATURE_SPECIFICATION.md    # 기능 명세서
│   └── BUILD_STATUS.md             # 구축 상태
│
├── README.md                       # 프로젝트 소개
├── next_tasks.md                   # 🔥 다음 작업 목록
├── SESSION_CONTEXT.md              # 이 문서
└── DEVELOPMENT_PRINCIPLES.md       # 개발 원칙
```

---

## 👥 팀 구성

| 역할 | 담당 |
|------|------|
| 프론트엔드 | 나 (이 프로젝트) |
| 백엔드 - AI Recognition | 팀원 1 |
| 백엔드 - API 서버 | 팀원 2 |
| 백엔드 - 등록기 관련 | 팀원 3 |

---

## 🚀 빠른 시작

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드 테스트 (커밋 전 필수)
npm run build

# 린트
npm run lint
```

### 환경 변수
`.env.local` 파일 필요:
```bash
API_BASE_URL=https://your-api-server.com/main
```

---

## ⚠️ 개발 원칙 (CRITICAL)

> 자세한 내용: `DEVELOPMENT_PRINCIPLES.md`

### 1. 페이즈별 커밋
- **한 커밋 = 한 Phase**
- 여러 Phase를 한 커밋에 절대 금지

### 2. 커밋 전 필수
```bash
npm run build  # 빌드 에러 0개 확인
npm run lint   # ESLint 경고 0개 확인
```

### 3. 문서 최신화
- 작업 완료 후 `next_tasks.md` 업데이트
- 큰 변경 시 `SESSION_CONTEXT.md` 업데이트

---

## 📚 문서 가이드

| 목적 | 문서 |
|------|------|
| 다음 할 일 확인 | `next_tasks.md` |
| 전체 기능 이해 | `docs/FEATURE_SPECIFICATION.md` |
| 구축 현황 파악 | `docs/BUILD_STATUS.md` |
| 프로젝트 소개 | `README.md` |
| 개발 원칙 | `DEVELOPMENT_PRINCIPLES.md` |

---

## 🔧 자주 묻는 질문

### API 서버 연결이 안 돼요
1. `.env.local`에 `API_BASE_URL` 설정 확인
2. `/api/health`로 헬스체크 테스트

### 빌드 에러가 나요
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 타입 에러가 나요
- `src/lib/types/lostItem.ts` 타입 정의 확인
- IDE TypeScript 서버 재시작

---

## ✅ 새 세션 체크리스트

```
[ ] 이 문서 읽기 완료
[ ] next_tasks.md 확인하여 다음 작업 파악
[ ] npm install (의존성 확인)
[ ] npm run dev (개발 서버 테스트)
[ ] 작업 시작!
```

---

**Last Updated**: 2025-11-22
