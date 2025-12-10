# 📋 코드 정리 계획서 (발표/제출용)

> **브랜치**: `claude/code-cleanup-016T53WurVkfqSVXvW3p2GC4`
> **목적**: 발표 및 코드 제출을 위한 리포지토리 정리
> **기준일**: 2025-12-10

---

## 🎯 정리 목표

1. **불필요한 개발 파일 제거** - 임시 문서, 레거시 코드 삭제
2. **소스 코드 프로덕션화** - console.log, 개발용 주석 제거
3. **문서 전문화** - 발표/제출에 적합하게 재구성
4. **코드 가독성 향상** - 함수 설명 주석 정리

---

## 📌 Phase 1: 불필요한 파일 제거 (최우선)

### 1.1 루트 디렉토리 정리

**삭제 대상**:
```
✗ 4e208b35f1acfe3c314f2e6aa8bb061d.ico/     (폴더 전체, 이미 public/에 복사됨)
✗ MYPAGE_MODAL_MOBILE_IMPROVEMENT.md        (작업 보고서)
✗ PLAN_D_COMPLETE_REDESIGN.md               (개발 계획서)
✗ SESSION_SUMMARY.md                        (세션 요약)
✗ SESSION_CONTEXT.md                        (개발용 컨텍스트)
✗ next_tasks.md                             (작업 목록)
✗ whatsProblem.txt                          (디버그 임시 파일)
✗ DEVELOPMENT_PRINCIPLES.md                 (개발 원칙)
✗ openapi.json                              (→ docs/API_SPEC.md로 변환 후 삭제)
✗ openapi2.json                             (→ docs/API_SPEC.md로 변환 후 삭제)
```

**유지**:
```
✓ README.md                                 (→ 재작성)
✓ package.json, package-lock.json
✓ tsconfig.json
✓ next.config.ts
✓ tailwind.config.js
✓ eslint.config.mjs
✓ postcss.config.mjs
✓ .gitignore
```

---

### 1.2 public/ 디렉토리 정리

**삭제 대상** (Next.js 기본 SVG, 사용하지 않음):
```
✗ public/file.svg
✗ public/globe.svg
✗ public/next.svg
✗ public/vercel.svg
✗ public/window.svg
```

**유지** (프로젝트 아이콘):
```
✓ public/favicon.ico
✓ public/favicon-*.png
✓ public/apple-icon-*.png
✓ public/android-icon-*.png
✓ public/ms-icon-*.png
✓ public/manifest.json
✓ public/browserconfig.xml
```

---

### 1.3 소스 코드 내 미사용 파일 삭제

**삭제 대상**:
```
✗ src/lib/data/mockData.ts                 (사용하지 않음, 확인됨)
```

---

## 📌 Phase 2: 소스 코드 정리 (우선순위 높음)

### 2.1 console.log 전체 제거

**대상 파일** (총 약 25개):

| 파일 | 개수 | 위치 |
|------|------|------|
| `src/lib/types/lostItem.ts` | 5개 | 디버그 로그 |
| `src/app/api/users/register/route.ts` | 3개 | 프록시 로그 |
| `src/app/api/users/register/verified/route.ts` | 3개 | 프록시 로그 |
| `src/app/api/users/login/route.ts` | 3개 | 프록시 로그 |
| `src/app/api/users/email/verify/route.ts` | 3개 | 프록시 로그 |
| `src/app/api/users/email/request-verification/route.ts` | 2개 | 프록시 로그 |
| `src/app/register/page.tsx` | 1개 | 에러 로그 |
| 기타 API 라우트 파일들 | ~5개 | 프록시 로그 |

**처리 방침**:
- ✅ **전체 제거** (프로덕션 배포 준비)
- ✅ 에러 처리 로직은 유지, 로그만 삭제

---

### 2.2 주석 정리

**삭제 대상**:
```typescript
// ❌ 수정사항 기록
// 2025-11-20: XXX 수정
// FIXME: 나중에 수정
// 임시 코드
// 테스트용
```

**유지 및 개선**:
```typescript
// ✅ 함수/컴포넌트 설명
/**
 * 분실물 상태 정보를 반환합니다.
 * @param status - 분실물 상태 ("보관" | "예약" | "찾음")
 * @returns 상태 텍스트, 색상, 뱃지 표시 여부
 */

// ✅ 복잡한 로직 설명
// 검색바 크기 감지를 ref로 관리 (useEffect 재실행 방지)

// ✅ 중요한 주의사항
// IMPORTANT: 토큰 만료 시 localStorage 정리 필수
```

**정리 규칙**:
1. 함수 설명: JSDoc 스타일 우선 (`/** ... */`)
2. 인라인 주석: 복잡한 로직에만 간결하게
3. 개발 히스토리 주석: 전체 삭제
4. TODO/FIXME: 전체 삭제 (없으면 유지)

---

### 2.3 사용하지 않는 import 제거

**확인 방법**:
```bash
npx eslint --fix src/
```

**수동 확인 대상**:
- unused variables
- unused imports
- unused types

---

### 2.4 코드 포맷팅 통일

**기준**:
- ESLint 규칙 준수
- 일관된 들여쓰기
- 일관된 따옴표 사용
- 일관된 세미콜론 사용

---

## 📌 Phase 3: 문서 재구성 (우선순위 높음)

### 3.1 README.md 재작성

**현재 문제점**:
- "Lost-Found Center" → "인하대 분실물 센터" 미반영
- 버전 정보 구버전 (Next.js 15.5.4 → 15.5.7, React 19.1.0 → 19.2.1)
- 개발 히스토리 포함 (제출용으로 부적합)

**새 구성안**:
```markdown
# 인하대 분실물 센터

> 인하대학교 분실물을 효율적으로 관리하고 찾을 수 있는 웹 애플리케이션

## 프로젝트 소개
- 프로젝트 개요
- 주요 기능 (간결하게)
- 기술 스택

## 주요 기능
1. 분실물 검색 및 조회
2. 소유권 주장 및 픽업 코드 발급
3. 마이페이지 (예약 관리)
4. 인증 시스템

## 기술 스택
- Frontend: Next.js 15.5.7, React 19.2.1, TypeScript 5
- Styling: Tailwind CSS 4
- 아키텍처: Service Layer + Custom Hooks

## 프로젝트 구조
src/
├── app/              # 페이지 및 API 라우트
├── components/       # 재사용 컴포넌트
├── lib/              # 비즈니스 로직
│   ├── api/          # API 서비스
│   ├── hooks/        # Custom Hooks
│   ├── contexts/     # Context API
│   └── types/        # TypeScript 타입

## 실행 방법
npm install
npm run dev

## 빌드
npm run build
npm start

## 문서
- [기능 명세서](docs/FEATURE_SPECIFICATION.md)
- [API 명세서](docs/API_SPEC.md)
- [사용자 매뉴얼](docs/USER_MANUAL.md)
```

**제거 항목**:
- 환경 변수 설정 (백엔드 주소 노출 방지)
- 개발 히스토리
- 알려진 제한사항 (일부만 선택적 포함)
- 프로젝트 관리 관련 내용

---

### 3.2 docs/ 폴더 재구성

**현재 상태** (17개):
```
docs/
├── API_INTEGRATION.md
├── API_SETUP.md
├── AUTH_IMPLEMENTATION_ANALYSIS.md
├── BUILD_STATUS.md
├── EMAIL_VERIFICATION_IMPLEMENTATION.md
├── ERROR_HANDLING.md
├── FEATURE_SPECIFICATION.md              ⭐ 유지
├── PR_CHIPS_IMPROVEMENTS.md              ❌ 삭제
├── PR_DESCRIPTION.md                     ❌ 삭제
├── TEAM_GUIDE.md
├── USER_MANUAL.md                        ⭐ 유지
├── categorychips-detailed-explanation.md
├── drag-scroll-explanation.md
├── drag-scroll-improvements.md           ❌ 삭제
├── layout-detailed-explanation.md
└── ui-design-spec.txt
```

**새 구조** (4개):
```
docs/
├── README.md                             🆕 문서 인덱스
├── FEATURE_SPECIFICATION.md              ✅ 유지 (기능 명세서)
├── API_SPEC.md                           🆕 API 명세서 (openapi 기반)
└── USER_MANUAL.md                        ✅ 유지 (사용자 매뉴얼)
```

**삭제 대상**:
```
✗ API_INTEGRATION.md                     (개발 가이드, 제출 불필요)
✗ API_SETUP.md                           (개발 가이드, 제출 불필요)
✗ AUTH_IMPLEMENTATION_ANALYSIS.md        (분석 문서, 제출 불필요)
✗ BUILD_STATUS.md                        (구축 현황, 제출 불필요)
✗ EMAIL_VERIFICATION_IMPLEMENTATION.md   (개발 기록, 제출 불필요)
✗ ERROR_HANDLING.md                      (개발 가이드, 제출 불필요)
✗ PR_CHIPS_IMPROVEMENTS.md               (PR 설명, 제출 불필요)
✗ PR_DESCRIPTION.md                      (PR 설명, 제출 불필요)
✗ TEAM_GUIDE.md                          (개발 가이드, 제출 불필요)
✗ categorychips-detailed-explanation.md  (상세 설명, 제출 불필요)
✗ drag-scroll-explanation.md             (상세 설명, 제출 불필요)
✗ drag-scroll-improvements.md            (개선 기록, 제출 불필요)
✗ layout-detailed-explanation.md         (상세 설명, 제출 불필요)
✗ ui-design-spec.txt                     (디자인 스펙, 제출 불필요)
```

---

### 3.3 docs/README.md 생성

```markdown
# 📚 문서 인덱스

이 폴더에는 인하대 분실물 센터 프로젝트의 주요 문서가 포함되어 있습니다.

## 문서 목록

### 📋 [FEATURE_SPECIFICATION.md](FEATURE_SPECIFICATION.md)
- 전체 기능 명세서
- 페이지별 기능 설명
- API 엔드포인트 목록
- 데이터 모델 정의

### 🔌 [API_SPEC.md](API_SPEC.md)
- API 엔드포인트 상세 명세
- 요청/응답 형식
- 인증 방법
- 에러 코드

### 📖 [USER_MANUAL.md](USER_MANUAL.md)
- 사용자 가이드
- 주요 기능 사용법
- FAQ
```

---

### 3.4 docs/API_SPEC.md 생성

**기반 자료**: `openapi.json`, `openapi2.json`

**구성**:
```markdown
# API 명세서

## 개요
- Base URL: (프로덕션 환경)
- 인증 방식: JWT Bearer Token

## 인증 불필요 (Public API)

### GET /api/items
분실물 전체 목록 조회

### GET /api/items/search
분실물 검색

### GET /api/items/{id}
분실물 상세 조회

### GET /api/tags
태그 목록 조회

### GET /api/health
서버 상태 확인

## 인증 필요 (Protected API)

### POST /api/items/{id}/claim
분실물 소유권 주장

### GET /api/items/me
내 예약 목록 조회

### GET /api/items/me/{id}
내 예약 상세 조회

### POST /api/items/me/{id}/cancel
예약 취소

### POST /api/users/login
로그인

### POST /api/users/register
회원가입

## 데이터 모델

### ItemResponse
...

### TagResponse
...

### ClaimResponse
...

## 에러 코드
...
```

---

### 3.5 기존 문서 수정

**FEATURE_SPECIFICATION.md**:
- ✅ 그대로 유지
- 선택적 업데이트: 버전 정보 (Next.js 15.5.7, React 19.2.1)

**USER_MANUAL.md**:
- ✅ 그대로 유지
- 선택적 업데이트: "분실물 찾기" → "인하대 분실물 센터"

---

## 📌 Phase 4: 최종 검증 (필수)

### 4.1 린트 확인
```bash
npm run lint
```

**기대 결과**: 0 warnings, 0 errors

---

### 4.2 타입 체크
```bash
npx tsc --noEmit
```

**기대 결과**: 0 errors

---

### 4.3 빌드 테스트
```bash
npm run build
```

**기대 결과**: Build succeeded

---

### 4.4 파일 구조 최종 확인

**루트 디렉토리** (정리 후):
```
JongSul/
├── .git/
├── .gitignore
├── README.md                    ✅ 재작성됨
├── package.json
├── package-lock.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.js
├── eslint.config.mjs
├── postcss.config.mjs
├── docs/                        ✅ 4개 문서만
├── public/                      ✅ 아이콘만
└── src/                         ✅ console.log 제거, 주석 정리
```

---

## 📊 작업 체크리스트

### Phase 1: 파일 제거
- [ ] 루트 디렉토리 임시 파일 9개 삭제
- [ ] public/에서 Next.js SVG 5개 삭제
- [ ] src/lib/data/mockData.ts 삭제
- [ ] docs/에서 개발 문서 14개 삭제

### Phase 2: 소스 코드 정리
- [ ] console.log 약 25개 제거 (8개 파일)
- [ ] 개발 히스토리 주석 제거
- [ ] 함수 설명 주석 JSDoc 스타일로 정리
- [ ] 사용하지 않는 import 제거

### Phase 3: 문서 재구성
- [ ] README.md 재작성
- [ ] docs/README.md 생성
- [ ] docs/API_SPEC.md 생성 (openapi 기반)
- [ ] FEATURE_SPECIFICATION.md 버전 업데이트 (선택)
- [ ] USER_MANUAL.md 제목 업데이트 (선택)

### Phase 4: 최종 검증
- [ ] npm run lint (0 errors)
- [ ] npx tsc --noEmit (0 errors)
- [ ] npm run build (성공)
- [ ] 파일 구조 최종 확인

---

## 🎯 예상 결과

**정리 전**:
```
- 파일 개수: ~100개
- 문서 개수: 17개 (docs/) + 10개 (루트)
- console.log: 25개
- 개발 히스토리 주석: 다수
```

**정리 후**:
```
- 파일 개수: ~70개 (30% 감소)
- 문서 개수: 4개 (docs/) + 1개 (루트)
- console.log: 0개
- 주석: 함수 설명만 간결하게
```

**품질 향상**:
- ✅ 프로덕션 준비 완료
- ✅ 코드 가독성 향상
- ✅ 문서 전문화
- ✅ 발표/제출에 적합

---

## 📝 참고사항

### 백엔드 주소 처리
- README에서 환경 변수 설정 가이드 제거
- API_SPEC.md에 "Base URL: (프로덕션 환경)" 표기
- 실제 백엔드 주소는 코드에서 환경 변수로 관리 (공개 안 함)

### 삭제된 문서 백업
- 필요 시 git 히스토리에서 복구 가능
- 주요 개발 가이드는 별도 보관 고려

---

**작성일**: 2025-12-10
**작성자**: Claude
**브랜치**: claude/code-cleanup-016T53WurVkfqSVXvW3p2GC4
