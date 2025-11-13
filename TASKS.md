# JongSul 분실물 관리 시스템 개발 Tasks

> 📅 최종 업데이트: 2025-11-13
> 🔄 현재 브랜치: `claude/api-integration-011CUwzEYYyCCeRTQzUvFkcC`
> ✅ 최근 완료: API 에러 처리 및 로깅 강화 (커밋: `2488940`)
> 📋 다음 작업: Phase 7.4 (알림 설정) 또는 Phase 7.5 (피드백 강화)

---

## ✅ 완료된 작업

### Phase 0: 초기 프로젝트 구축 (완료)
- [x] Next.js 15 + TypeScript 프로젝트 셋업
- [x] OpenAPI 명세 기반 타입 정의
- [x] 기본 레이아웃 및 컴포넌트 구현
- [x] Mock API 구현
- [x] 무한 스크롤 기능
- [x] 검색 및 필터링 기능

### Phase 1: 분실물 상태 시스템 개선 (완료)
- [x] ItemResponse 타입 정의 개선
- [x] 상태 시스템 구현 (수령대기/예약중/수령완료)
- [x] 상태별 UI 표시 개선

### Phase 2: 마이페이지 UI 개선 (완료)
- [x] Phase 2-1: ClaimedItemCard 텍스트 표기 개선
  - [x] 이모티콘 → lucide-react 선형 아이콘 교체
  - [x] 태그에 테두리 추가
  - [x] flex 레이아웃 적용
- [x] Phase 2-2: MyPageItemDetailModal 생성
  - [x] 마이페이지 전용 상세 모달 구현
  - [x] 수령 코드 및 유효기간 표시
  - [x] 예약 취소 버튼 추가
- [x] Phase 2-3: CancelReservationModal 생성
  - [x] 2단계 확인 모달 구현
  - [x] 취소 사유 선택 기능
- [x] Phase 2-4: 통합 및 연결
  - [x] 카드 클릭 이벤트 연결
  - [x] 모달 상태 관리
  - [x] 예약 취소 플로우 구현

### 문서화 (완료)
- [x] DEVELOPMENT_PRINCIPLES.md 작성
  - [x] 페이즈별 커밋 원칙
  - [x] TASKS.md 관리 원칙
  - [x] 코드 품질 가이드라인

---

## 📋 진행 예정 작업

### Phase 3: UI/UX 개선
**우선순위**: 🔥 높음

#### 3.1 메인 모달 개선
- [ ] **(나중)** 내가 예약한 분실물 표시
  - 메인 모달에서 "수령 예약하기" 버튼 대신
  - "내가 예약한 상품" 핑크색 버튼으로 변경
  - 추가 구현 필요 (사용자 예약 상태 확인 로직)

#### 3.2 이미지 로드 실패 처리
- [x] 이미지 로드 실패 감지 (onError 핸들러)
- [x] fallback UI 개선 (깨진 이미지 → 📦 소포 아이콘)
- [x] ItemCard, ItemModal, ClaimedItemCard, MyPageItemDetailModal 모두 적용

### Phase 5: UI 통일성 개선 (완료)
**우선순위**: 🔥 높음

#### 5.1 ItemCard 아이콘 통일 (확정)
- [x] 이모티콘 → lucide-react 아이콘 변경
  - [x] 📍 → MapPin 아이콘 (위치)
  - [x] 📅 → Calendar 아이콘 (날짜)
  - [x] lucide-react import 추가

#### 5.2 ItemModal 아이콘 추가 (확정)
- [x] 텍스트 앞 아이콘 추가 (마이페이지 방식 적용)
  - [x] 카테고리: Package 아이콘
  - [x] 상태: AlertCircle/CheckCircle 아이콘
  - [x] 등록 날짜: Calendar 아이콘
  - [x] 분실함 위치: MapPin 아이콘
  - [x] lucide-react import 추가

#### 5.3 마이페이지 카드 외곽선 개선 (확정: Option 4)
- [x] ClaimedItemCard에 테두리 + 그림자 적용
  - [x] `border border-gray-100` 추가
  - [x] `shadow-sm` → `shadow-md`로 변경
  - [x] 빌드 및 시각적 확인

#### 5.4 서약서 페이지 상단 분실물 정보 개선 (확정)
- [x] 현재 문제: claim/[id] 페이지 상단 정보가 빈약함
- [x] 사용자 경험 개선: 모달 → 서약서 이동 시 분실물 정보 연속성 제공
- [x] 구현 방향:
  - [x] 좌측: 이미지 크게 표시 (w-80 h-80)
  - [x] 우측: ClaimedItemCard 스타일 레이아웃 적용
    - [x] 태그 표시 (border 있는 칩 스타일)
    - [x] 위치 표시 (MapPin 아이콘)
    - [x] 등록 날짜 표시 (Calendar 아이콘)
    - [x] ⚠️ 코드/예약날짜/수령대기 배지는 제외 (아직 예약 전)
  - [x] 반응형 레이아웃 (모바일: flex-col, 데스크톱: flex-row)
  - [x] 빌드 및 시각적 확인

---

## 📋 진행 예정 작업

### Phase 6: 서약서 페이지 데이터 연동 (완료)
**우선순위**: 🔥 높음

#### 6.1 claim/[id] 페이지 실제 API 연동 (완료)
- [x] Mock 데이터 제거
- [x] /api/items/[id] 엔드포인트 생성
- [x] itemId로 실제 분실물 정보 fetch
- [x] 로딩 상태 처리
- [x] 에러 처리 (404, 네트워크 에러)
- [x] 빌드 테스트

#### 6.2 ItemModal Prefetch 최적화 (예정)
- [ ] 모달 열릴 때 해당 아이템 API 미리 호출
- [ ] fetch 캐싱 옵션 추가 (revalidate: 180)
- [ ] 사용자가 서약서 페이지 이동 시 캐시에서 즉시 로드

---

### Phase 7: 전체 API 연동 (진행 중)
**우선순위**: 🔥 높음

#### 7.1 인증 시스템 구현 (완료)
**상태**: ✅ 완료

- [x] **인증 API 엔드포인트**
  - [x] POST /api/users/register - 회원가입 프록시
  - [x] POST /api/users/login - 로그인 프록시

- [x] **인증 상태 관리**
  - [x] 전역 상태 (Context API)
  - [x] access_token 저장 (localStorage)
  - [x] Bearer Token 수동 추가

- [x] **로그인 페이지 UI**
  - [x] /login 페이지 생성
  - [x] 이메일/비밀번호 폼
  - [x] 회원가입 링크
  - [x] 에러 처리
  - [x] 로그인 복귀 기능 (redirect parameter)

- [x] **회원가입 페이지 UI**
  - [x] /register 페이지 생성
  - [x] 이메일/비밀번호/이름 폼 (최소 검증)
  - [x] 로그인 페이지로 리다이렉트 (자동 로그인 없음)

- [x] **인증 가드**
  - [x] 마이페이지 접근 제한
  - [x] 클레임 페이지 로그인 확인
  - [x] ConfirmDialog 컴포넌트

#### 7.2 소유권 주장 API 연동 (완료)
**상태**: ✅ 완료
**커밋**: `9089e3d`

- [x] **타입 정의**
  - [x] PickupCodeResponse 타입
  - [x] ClaimResponse 타입

- [x] **API 엔드포인트**
  - [x] POST /api/items/[id]/claim 프록시 생성
  - [x] 인증 헤더 추가 (Authorization: Bearer {token})
  - [x] 에러 처리 (401, 404, 409, 422, 500+)

- [x] **claim/[id] 페이지 수정**
  - [x] Mock 코드 생성 제거
  - [x] handleAgree async 함수로 변경
  - [x] ClaimResponse 타입 처리 (pickup_code, expires_at)
  - [x] 로딩/에러 상태 추가

- [x] **ClaimAgreement 컴포넌트**
  - [x] loading, error props 추가
  - [x] 로딩 중 버튼 비활성화
  - [x] 에러 메시지 표시

#### 7.3 마이페이지 API 연동 (완료)
**상태**: ✅ 완료
**커밋**: `6a2ef44`
**위치**: `src/app/mypage/page.tsx`

- [x] **API 엔드포인트**
  - [x] GET /api/items/me - 내 예약 목록 프록시
  - [x] GET /api/items/me/[id] - 내 예약 상세 프록시 (pickup_code 포함)

- [x] **타입 정의 수정**
  - [x] MyItemDetailResponse 타입 추가 (`src/lib/types/lostItem.ts`)
  - [x] ClaimedItem 타입을 API 응답 구조에 맞게 수정
    - [x] `tags: TagResponse[]` (기존: `string[]`)
    - [x] `code`, `expires_at` 필드 제거 (상세 API에서만 제공)
    - [x] `status: string` (기존: 'pending' | 'completed')

- [x] **mypage 페이지 수정**
  - [x] Mock 데이터 완전 제거
  - [x] useEffect에서 /api/items/me 호출
  - [x] 로딩 상태 스피너 처리
  - [x] 에러 상태 메시지 처리
  - [x] 빈 목록 메시지 표시
  - [x] 2열 그리드 레이아웃 적용 (`grid-cols-1 md:grid-cols-2`)
  - [x] 401 에러 시 로그인 페이지 자동 이동

- [x] **카드 클릭 시 상세 API 호출**
  - [x] handleItemClick에서 /api/items/me/[id] 호출
  - [x] pickup_code는 상세 API에서만 제공 (목록 API에는 없음)
  - [x] 상세 로딩 중 스피너 표시

- [x] **MyPageItemDetailModal 수정**
  - [x] "예약 유효기간" → "코드 유효기간" 라벨 변경
  - [x] detailData, detailLoading props 추가
  - [x] 로딩 중 "코드 로딩 중..." 표시
  - [x] 에러 시 "코드를 불러올 수 없습니다" 표시

- [x] **예약 취소 기능**
  - [x] DELETE API 미구현 - 관련 코드 주석 처리
  - [x] 백엔드 확인 후 구현 예정

#### 7.3.5 API 에러 처리 및 로깅 강화 (완료)
**상태**: ✅ 완료
**커밋**: `2488940`

- [x] **Claim API 에러 처리 강화**
  - [x] 400 Bad Request 전용 핸들러 추가
  - [x] 에러 응답에 `raw` 데이터 포함 (디버깅용)
  - [x] `/api/items/[id]/claim/route.ts`

- [x] **서버 측 로깅 추가**
  - [x] 모든 API 프록시에 일관된 로깅 형식 적용
  - [x] 요청 시작 로그: `console.log('[API명] 외부 API 호출:', url)`
  - [x] 성공 로그: `console.log('[API명] 성공:', { 주요 정보 })`
  - [x] 에러 로그: `console.error('[API명] 외부 API 에러:', { status, statusText, error })`
  - [x] 네트워크 에러 로그: `console.error('[API명] 네트워크 에러:', { error, stack })`
  - [x] 적용 파일:
    - [x] `/api/items/[id]/claim/route.ts`
    - [x] `/api/items/me/route.ts`
    - [x] `/api/items/me/[id]/route.ts`

- [x] **클라이언트 로깅 강화**
  - [x] `/claim/[id]/page.tsx`
    - [x] `[Claim] API 호출 시작:` 로그
    - [x] `[Claim] API 성공:` 로그
    - [x] `[Claim] API 에러:` 로그 (status, statusText, errorData)
    - [x] 400 에러 특별 처리

- [x] **로깅 목적**
  - [x] 400 에러 원인 파악 용이성
  - [x] API 요청/응답 디버깅
  - [x] 프로덕션 트러블슈팅

#### 7.4 알림 설정 API 연동 (마이페이지)
**상태**: ⏸️ 보류 (API 명세 확인 필요)

- [ ] API 명세 확인 (백엔드 팀 문의)
- [ ] 관심 태그 저장 API 엔드포인트 확인
- [ ] 알림 설정 조회 API 엔드포인트 확인
- [ ] OpenAPI 명세에 없음 - 백엔드 문의 필요

#### 7.5 에러 처리 및 피드백 강화
**상태**: ⏸️ 계획 단계

**Option A: Toast 시스템 도입**
- [ ] sonner 또는 react-hot-toast 설치
- [ ] 전역 Toaster 컴포넌트 설정
- [ ] alert() → toast() 전환
- [ ] 성공/에러 Toast 일관성 확보
- [ ] 전역 apiClient 유틸리티 생성
- [ ] 401 에러 자동 로그인 페이지 이동

**Option B: 현재 상태 유지**
- [ ] 기존 alert() 및 state 기반 에러 처리 유지
- [ ] 필요 시 커스텀 Toast 컴포넌트 제작

---

## 📊 API 연동 현황

### ✅ 구현 완료 (Public API)
| API | 상태 | 파일 |
|-----|------|------|
| GET /health_check | ✅ | `/api/health/route.ts` |
| GET /items/search | ✅ | `/api/items/search/route.ts` |
| GET /items/{id} | ✅ | `/api/items/[id]/route.ts` |
| GET /tags | ✅ | `/api/tags/route.ts` |

### ✅ 구현 완료 (인증 API)
| API | 상태 | 파일 |
|-----|------|------|
| POST /users/register | ✅ | `/api/users/register/route.ts` |
| POST /users/login | ✅ | `/api/users/login/route.ts` |

### ✅ 구현 완료 (Protected API)
| API | 상태 | 파일 |
|-----|------|------|
| POST /items/{id}/claim | ✅ | `/api/items/[id]/claim/route.ts` |
| GET /items/me | ✅ | `/api/items/me/route.ts` |
| GET /items/me/{id} | ✅ | `/api/items/me/[id]/route.ts` |

### ❌ 미구현 (Protected API - 인증 필요)
| API | 우선순위 | 비고 |
|-----|----------|------|
| DELETE /items/{id}/claim | 🔴 보류 | OpenAPI 명세 없음, 백엔드 확인 필요 |

---

### Phase 4: API 연동 (Legacy)
**우선순위**: 🔵 나중 (UI 완성 후)

- [ ] **(나중)** Backend API 엔드포인트 확인
- [ ] **(나중)** ItemService 실제 API 연동
- [ ] **(나중)** 마이페이지 API 연동
- [ ] **(나중)** 에러 처리 및 피드백 강화

---

## 📌 작업 진행 가이드

### 작업 전 체크리스트
- [ ] 현재 브랜치 확인 (`git branch`)
- [ ] 최신 코드 pull (`git pull origin <branch>`)
- [ ] 의존성 설치 확인 (`npm install`)
- [ ] 개발 서버 실행 테스트 (`npm run dev`)

### 작업 중
- [ ] 페이즈별로 커밋 (한 커밋에 여러 페이즈 금지)
- [ ] 작업 완료 시 TASKS.md 체크박스 업데이트
- [ ] 타입 에러 확인 (IDE에서)
- [ ] 코드 변경 후 즉시 테스트

### 작업 완료 후
- [ ] 빌드 테스트 (`npm run build`)
- [ ] 브라우저에서 기능 동작 확인
- [ ] ESLint 경고 0개 확인
- [ ] TASKS.md 최신화
- [ ] 커밋 (`git commit -m "feat: <작업 내용>"`)
- [ ] 푸시 (`git push origin <branch>`)

---

## 🎯 진행 상황 추적

### 2025년 11월 (현재)
- [x] Phase 0: 초기 프로젝트 구축
- [x] Phase 1: 분실물 상태 시스템 개선
- [x] Phase 2: 마이페이지 UI 개선
- [ ] Phase 3: UI/UX 개선 (진행 중)

### 향후 계획
- [ ] Phase 4: API 연동

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
- `claude/*`: AI 작업 브랜치
- `feature/*`: 새 기능 브랜치
- `fix/*`: 버그 수정 브랜치

### 도움이 필요할 때
- TypeScript 에러: 타입 정의 확인
- 빌드 에러: `node_modules` 삭제 후 재설치
- 런타임 에러: 브라우저 콘솔 확인
- Git 에러: `git status`로 상태 확인

---

**Happy Coding! 🚀**
