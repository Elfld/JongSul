# 🔄 JongSul 세션 컨텍스트

> 새 세션 시작 시 이 문서를 먼저 읽고 작업을 시작하세요.
>
> **마지막 업데이트**: 2025-11-09 17:15
> **현재 브랜치**: `claude/ui2-improvements-011CUwzEYYyCCeRTQzUvFkcC`

---

## 📌 빠른 개요

**프로젝트**: 분실물 관리 시스템 (웹 + 키오스크)
**현재 단계**: Phase 5 완료 (UI 통일성 개선)
**다음 작업**: Phase 4 (API 연동) - 나중 예정

---

## 🎯 현재 세션 상태

### 브랜치 정보
```bash
브랜치: claude/ui2-improvements-011CUwzEYYyCCeRTQzUvFkcC
상태: Clean, up to date
푸시: ✅ 완료 (7개 커밋)
```

### 최근 완료 작업 (Phase 5)
**2025-11-09 완료** - UI 통일성 개선 4단계

1. **Phase 5.1**: ItemCard 아이콘 통일
   - 이모티콘(📍📅) → lucide-react 아이콘 (MapPin, Calendar)

2. **Phase 5.2**: ItemModal 아이콘 추가
   - 카테고리/상태/날짜/위치에 lucide-react 아이콘 추가

3. **Phase 5.3**: 마이페이지 카드 외곽선 개선
   - `border border-gray-100` + `shadow-md` 적용

4. **Phase 5.4**: 서약서 페이지 상단 정보 개선
   - claim/[id] 페이지 레이아웃 대폭 개선
   - 좌측: 큰 이미지, 우측: ClaimedItemCard 스타일 정보

**빌드**: ✅ 성공 | **타입 에러**: 0개 | **ESLint**: 0개

---

## 📋 다음 할 일

### 우선순위

**🔵 나중** - Phase 4: API 연동
- Backend API 엔드포인트 확인
- ItemService 실제 API 연동
- 마이페이지 API 연동

**🔵 나중** - Phase 3.1: 메인 모달 개선
- 내가 예약한 분실물 표시 기능

> 새 작업이 주어지면 TASKS.md를 먼저 업데이트하고 시작하세요.

---

## 🛠️ 기술 스택

### Core
- **Next.js** 15.5.4 (App Router, Turbopack)
- **React** 19.1.0
- **TypeScript** 5
- **Tailwind CSS** 4
- **lucide-react** (아이콘)

### Architecture
- Service Layer + Custom Hooks
- SOLID 원칙 적용
- OpenAPI 명세 기반 타입 정의

---

## 📁 주요 파일 구조

```
src/
├── app/
│   ├── api/              # API Routes
│   │   ├── health/       # Health check
│   │   ├── items/        # 분실물 API (목업)
│   │   │   └── search/   # 검색 프록시
│   │   └── tags/         # 태그 API
│   ├── claim/[id]/       # 서약서 페이지
│   ├── mypage/           # 마이페이지
│   └── page.tsx          # 메인 (분실물 게시판)
│
├── components/
│   ├── ItemCard.tsx      # 분실물 카드
│   ├── ItemModal.tsx     # 상세 모달
│   ├── Header.tsx        # 검색 헤더
│   ├── CategoryChips.tsx # 카테고리 필터
│   ├── claim/            # 서약서 관련
│   └── mypage/           # 마이페이지 관련
│       ├── ClaimedItemCard.tsx
│       ├── MyPageItemDetailModal.tsx
│       └── CancelReservationModal.tsx
│
└── lib/
    ├── api/              # API 클라이언트 레이어
    ├── hooks/            # Custom Hooks
    │   ├── useItemSearch.ts
    │   ├── useInfiniteScroll.ts
    │   └── useDragScroll.ts
    └── types/            # TypeScript 타입
```

---

## ⚠️ 핵심 개발 원칙

> **자세한 내용**: `DEVELOPMENT_PRINCIPLES.md` 참조

### 1. 페이즈별 커밋 원칙 (CRITICAL)
- **한 커밋 = 한 Phase**
- 여러 Phase를 한 커밋에 절대 금지
- Phase 5.1 완료 → 커밋 → Phase 5.2 시작

### 2. TASKS.md 관리 원칙 (CRITICAL)
- **매 커밋마다 TASKS.md 최신화**
- 완료된 작업 `[x]` 체크
- 커밋 메시지에 이미 내용이 있으므로 중복 기록 불필요

### 3. 작업 지시 처리 원칙 (CRITICAL)
- 새 작업 받으면 **즉시 TASKS.md에 Phase별 체크리스트 작성**
- 한 단계씩 해결하면서 최신화
- Phase 번호 붙여서 구조화

### 4. 코드 품질
- ESLint 경고 0개 유지
- 빌드 에러 0개 유지
- 커밋 전 `npm run build` 필수

---

## 🚀 빠른 시작 명령어

```bash
# 개발 서버 실행
npm run dev

# 빌드 테스트 (커밋 전 필수)
npm run build

# 브랜치 확인
git branch

# 현재 상태 확인
git status

# 커밋 히스토리
git log --oneline -10

# 최신 코드 받기 (필요시)
git pull origin claude/ui2-improvements-011CUwzEYYyCCeRTQzUvFkcC
```

### Git 푸시 규칙
```bash
# 항상 -u 옵션 사용
git push -u origin claude/ui2-improvements-011CUwzEYYyCCeRTQzUvFkcC

# ⚠️ CRITICAL: 브랜치명이 'claude/'로 시작하고 세션 ID로 끝나야 푸시 가능
# 403 에러 발생 시: 새 브랜치 생성 필요 (세션 ID 불일치)
```

---

## 💡 중요한 의사결정 기록

### UI/UX 디자인
- **아이콘 통일**: lucide-react 사용 (이모티콘 제거)
- **마이페이지 카드 외곽선**: Option 4 (border + shadow 조합)
- **서약서 페이지 레이아웃**: ClaimedItemCard 스타일 적용

### 기술 아키텍처
- **API 연동**: OpenAPI 명세 준수, 프록시 레이어 사용
- **상태 관리**: Service Layer + Custom Hooks
- **이미지 처리**: Next.js Image 컴포넌트 + fallback UI

### 개발 방식
- **Phase별 독립 커밋**: 한 Phase 완료 → 즉시 커밋
- **문서 최신화**: TASKS.md, DEVELOPMENT_PRINCIPLES.md 항상 최신 유지
- **빌드 우선**: 모든 커밋 전 빌드 테스트 필수

---

## 📚 추가 문서

### 필수 읽기
- `TASKS.md` - 전체 작업 계획 및 진행 상황
- `DEVELOPMENT_PRINCIPLES.md` - 개발 원칙 상세 설명

### 참고 문서
- `README.md` - 프로젝트 전체 개요
- `docs/ui-design-spec.txt` - UI 설계 명세
- `docs/API_INTEGRATION.md` - API 연동 가이드
- `UI_IMPLEMENTATION_PLAN.md` - UI 구현 계획 (구버전)

---

## 🔧 문제 해결

### 브랜치 권한 문제 (403 에러)
```bash
# 새 세션에서 이전 브랜치 푸시 불가 → 새 브랜치 생성
git checkout -b claude/new-task-name-[세션ID]
git push -u origin claude/new-task-name-[세션ID]
```

### 빌드 에러
```bash
# node_modules 재설치
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 타입 에러
- IDE에서 타입 정의 확인
- `src/lib/types/lostItem.ts` 참조

---

## ✅ 세션 시작 체크리스트

새 세션 시작 시 다음을 확인하세요:

- [ ] 이 문서(`SESSION_CONTEXT.md`) 읽기 완료
- [ ] `TASKS.md` 확인하여 현재 진행 상황 파악
- [ ] `DEVELOPMENT_PRINCIPLES.md` 개발 원칙 숙지
- [ ] 현재 브랜치 확인 (`git branch`)
- [ ] 의존성 설치 확인 (`npm install`)
- [ ] 개발 서버 테스트 (`npm run dev`)

**준비 완료!** 🚀

---

**Last Updated**: 2025-11-09 17:15
**Session**: claude/ui2-improvements-011CUwzEYYyCCeRTQzUvFkcC
