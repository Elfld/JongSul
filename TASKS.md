# JongSul 분실물 관리 시스템 개발 Tasks

> 📅 최종 업데이트: 2025-11-09 17:40
> 🔄 현재 브랜치: `claude/ui2-improvements-011CUwzEYYyCCeRTQzUvFkcC`

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

### Phase 7: 전체 API 연동
**우선순위**: 🔥 높음

#### 7.1 인증 시스템 구현
**상태**: ❌ 미구현 (회원가입/로그인 없음)

- [ ] **인증 API 엔드포인트**
  - [ ] POST /api/users/register - 회원가입 프록시
  - [ ] POST /api/users/login - 로그인 프록시

- [ ] **인증 상태 관리**
  - [ ] 전역 상태 (Context API 또는 Zustand)
  - [ ] access_token 저장 (localStorage/sessionStorage)
  - [ ] Bearer Token 자동 추가 (fetch interceptor)

- [ ] **로그인 페이지 UI**
  - [ ] /login 페이지 생성
  - [ ] 이메일/비밀번호 폼
  - [ ] 회원가입 링크
  - [ ] 에러 처리

- [ ] **회원가입 페이지 UI**
  - [ ] /register 페이지 생성
  - [ ] 이메일/비밀번호/이름/연락처 폼
  - [ ] 유효성 검증
  - [ ] 중복 체크

#### 7.2 소유권 주장 API 연동 (서약서 페이지)
**상태**: ❌ 미구현 (TODO 주석만 존재)
**위치**: `src/app/claim/[id]/page.tsx:64`

- [ ] **API 엔드포인트**
  - [ ] POST /api/items/[id]/claim 프록시 생성
  - [ ] 인증 헤더 추가 (Authorization: Bearer {token})

- [ ] **claim/[id] 페이지 수정**
  - [ ] handleAgree 함수에서 API 호출
  - [ ] ClaimResponse 타입 처리 (pickup_code, expires_at)
  - [ ] 에러 처리 (401 인증 실패, 409 이미 신청됨 등)
  - [ ] 성공 시 코드 표시
  - [ ] 로딩 상태 처리

#### 7.3 마이페이지 API 연동
**상태**: ❌ 미구현 (Mock 데이터 사용 중)
**위치**: `src/app/mypage/page.tsx:19,80`

- [ ] **API 엔드포인트**
  - [ ] GET /api/items/me - 내 예약 목록 프록시
  - [ ] GET /api/items/me/[id] - 내 예약 상세 프록시
  - [ ] DELETE /api/items/[id]/claim - 예약 취소 프록시 (추가 필요)

- [ ] **mypage 페이지 수정**
  - [ ] Mock 데이터 제거
  - [ ] useEffect에서 /api/items/me 호출
  - [ ] 로딩 상태 처리
  - [ ] 빈 목록 처리

- [ ] **예약 취소 기능**
  - [ ] handleConfirmCancel 함수에서 API 호출
  - [ ] 성공 시 목록에서 제거 또는 상태 업데이트
  - [ ] 에러 처리
  - [ ] Toast 알림 (성공/실패)

#### 7.4 알림 설정 API 연동 (마이페이지)
**상태**: ❌ 미구현 (API 명세 확인 필요)

- [ ] API 명세 확인 (백엔드 팀 문의)
- [ ] 관심 태그 저장 API 연동
- [ ] 알림 설정 조회 API 연동

#### 7.5 에러 처리 및 피드백 강화
- [ ] 전역 에러 핸들러
- [ ] Toast 알림 시스템 (sonner 또는 react-hot-toast)
- [ ] 401 에러 시 자동 로그인 페이지 이동
- [ ] 네트워크 에러 재시도 로직
- [ ] 낙관적 업데이트 (Optimistic Update)

---

## 📊 API 연동 현황

### ✅ 구현 완료 (Public API)
| API | 상태 | 파일 |
|-----|------|------|
| GET /health_check | ✅ | `/api/health/route.ts` |
| GET /items/search | ✅ | `/api/items/search/route.ts` |
| GET /items/{id} | ✅ | `/api/items/[id]/route.ts` |
| GET /tags | ✅ | `/api/tags/route.ts` |

### ❌ 미구현 (Protected API - 인증 필요)
| API | 우선순위 | TODO 위치 |
|-----|----------|-----------|
| POST /items/{id}/claim | 🔥 높음 | `claim/[id]/page.tsx:64` |
| GET /items/me | 🔥 높음 | `mypage/page.tsx:19` |
| GET /items/me/{id} | 🟡 중간 | 마이페이지 상세 |
| DELETE /items/{id}/claim | 🔥 높음 | `mypage/page.tsx:80` |

### ❌ 미구현 (인증 API)
| API | 우선순위 | 비고 |
|-----|----------|------|
| POST /users/register | 🔥 높음 | 회원가입 |
| POST /users/login | 🔥 높음 | 로그인 |

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
