# 🚀 Next Tasks - 개선 및 보완 작업

> **현재 상태**: v1.0.0 - 핵심 기능 구현 완료 (85%)
> **최종 업데이트**: 2025-11-22
> **브랜치**: `main`

---

## ✅ 완료된 작업

### 핵심 기능 (100% 완료)
- ✅ 메인 페이지 (검색, 태그 필터, 드래그 스크롤, 상세 모달)
- ✅ 소유권 주장 페이지 (서약서, 픽업 코드 발급)
- ✅ 마이페이지 (예약 목록, 상세 조회, 예약 취소)
- ✅ 로그인/회원가입 페이지
- ✅ JWT 인증 시스템 (AuthContext)
- ✅ 반응형 디자인 (모바일/태블릿/데스크톱)

### API 프록시 레이어 (11개 엔드포인트)
- ✅ GET /api/health
- ✅ GET /api/items, /api/items/search, /api/items/{id}
- ✅ POST /api/items/{id}/claim
- ✅ GET /api/items/me, /api/items/me/{id}
- ✅ POST /api/items/me/{id}/cancel
- ✅ GET /api/tags
- ✅ POST /api/users/login, /api/users/register

### UI/UX 개선 (완료)
- ✅ 태그 동적 로딩 (API 연동)
- ✅ Debounce 검색 (300ms)
- ✅ 이미지 로드 실패 시 fallback 아이콘
- ✅ 에러 처리 및 로깅 강화
- ✅ 상태별 버튼 제어 (보관/예약/수령완료)

---

## 📋 개선 필요 작업

### 🔴 Priority 1: 보안 강화 (High)

| 작업 | 현재 상태 | 개선 방안 | 백엔드 필요 |
|------|-----------|-----------|-------------|
| 토큰 저장 방식 | localStorage (XSS 취약) | httpOnly Cookie 사용 | ✅ |
| 토큰 검증 | 존재 여부만 체크 | 서버 검증 API 구현 | ✅ |
| Refresh Token | 미지원 (만료 시 재로그인) | Refresh Token 지원 | ✅ |
| CSRF 방지 | 미적용 | CSRF 토큰 적용 | ✅ |
| Content Security Policy | 미설정 | CSP 헤더 설정 | ❌ |

**즉시 가능한 작업**:
- [ ] CSP 헤더 설정 (next.config.ts)
- [ ] 입력값 sanitization 강화

**백엔드 협의 필요**:
- [ ] httpOnly Cookie 전환 논의
- [ ] Refresh Token API 지원 요청
- [ ] 토큰 검증 API 엔드포인트 확인

---

### 🔴 Priority 2: 테스트 및 품질 (High)

| 작업 | 현재 상태 | 목표 |
|------|-----------|------|
| 단위 테스트 | **0%** | 70%+ |
| E2E 테스트 | **0%** | 주요 플로우 커버 |
| CI/CD | 미구성 | GitHub Actions |
| Prettier | 미적용 | 적용 |

**작업 목록**:
- [ ] Jest + React Testing Library 설정
- [ ] 주요 Hook 테스트 작성 (useItemSearch, useDragScroll, useDebounce)
- [ ] AuthContext 테스트 작성
- [ ] API 프록시 테스트 작성
- [ ] Playwright E2E 테스트 설정
- [ ] 주요 플로우 E2E 테스트 (로그인 → 검색 → 예약)
- [ ] GitHub Actions CI 파이프라인 구성
- [ ] Prettier 설정 및 적용

---

### 🟡 Priority 3: 서버 사이드 처리 (Medium)

| 작업 | 현재 상태 | 개선 방안 |
|------|-----------|-----------|
| 라우트 보호 | 클라이언트에서만 체크 | Next.js Middleware 적용 |
| SSR | 미사용 | SEO/초기 로딩 개선 |
| 마이페이지 진입 | 스켈레톤 0.5초 노출 | 서버 측 인증 가드 |

**작업 목록**:
- [ ] Next.js Middleware로 인증 가드 구현
  - `/mypage`, `/claim/*` 라우트 보호
  - Cookie 기반 인증 필요 (localStorage 불가)
- [ ] 마이페이지 서버 컴포넌트 전환 검토
- [ ] 메타데이터 최적화 (SEO)

---

### 🟡 Priority 4: UX 개선 (Medium)

| 작업 | 현재 상태 | 개선 방안 |
|------|-----------|-----------|
| 폼 검증 | HTML5 기본만 | 실시간 피드백 |
| 비밀번호 강도 | 미체크 | 강도 표시기 추가 |
| 로딩 UX | 단순 스피너 | 스켈레톤 UI |
| ESC 키 모달 닫기 | 미구현 | 키보드 이벤트 추가 |
| Toast 알림 | alert() 사용 | Toast 시스템 도입 |

**작업 목록**:
- [ ] 폼 검증 강화
  - [ ] 이메일 정규식 검증
  - [ ] 비밀번호 강도 체크 (최소 8자, 영문+숫자)
  - [ ] 실시간 유효성 피드백
- [ ] 스켈레톤 UI 컴포넌트 구현
- [ ] 모달 ESC 키 닫기 구현
- [ ] Toast 시스템 도입 (sonner 또는 react-hot-toast)
  - [ ] alert() → toast() 전환
  - [ ] 성공/에러 피드백 일관성

---

### 🟢 Priority 5: 접근성 (Low)

| 작업 | 현재 상태 | 목표 |
|------|-----------|------|
| ARIA 속성 | 미적용 | WCAG 2.1 AA |
| 키보드 내비게이션 | 부분 지원 | 완전 지원 |
| 색상 대비 | 미검증 | 4.5:1 이상 |
| 스크린 리더 | 미지원 | 지원 |

**작업 목록**:
- [ ] ARIA 레이블 추가 (버튼, 폼, 모달)
- [ ] 포커스 관리 (모달 열릴 때 포커스 트랩)
- [ ] 키보드 트랩 방지
- [ ] 색상 대비 검증 및 개선

---

### 🟢 Priority 6: 기능적 제한사항 (Low / 백엔드 의존)

| 항목 | 현재 상태 | 필요 사항 |
|------|-----------|-----------|
| 알림 설정 | UI만 존재 (localStorage) | 백엔드 API 필요 |
| 무한 스크롤 | 전체 목록 한 번에 로드 | 백엔드 페이지네이션 필요 |
| 취소 후 재예약 | 불가 | 서버 측 확인 필요 |
| 관리자 페이지 | 미구현 | 별도 프로젝트 또는 추가 개발 |

**백엔드 확인 필요**:
- [ ] 알림 설정 API 명세 요청
- [ ] 페이지네이션 API 지원 여부 확인
- [ ] 취소 후 재예약 정책 확인

---

### 🟢 Priority 7: 인프라/배포 (Low)

| 항목 | 현재 상태 | 목표 |
|------|-----------|------|
| 배포 플랫폼 | 미정 | Vercel / AWS |
| 모니터링 | 미적용 | Sentry 또는 유사 |
| CDN | 미사용 | 이미지 CDN |
| Rate Limiting | 미적용 | API 보호 |

**작업 목록**:
- [ ] 배포 플랫폼 결정 및 설정
- [ ] 환경 변수 관리 (production/staging)
- [ ] 에러 모니터링 도구 설정
- [ ] 빌드 최적화 (번들 분석)

---

## 📊 작업 우선순위 요약

```
🔴 즉시 (보안 + 품질)
├── 토큰 검증 방식 개선 (백엔드 협의)
├── 단위 테스트 작성 시작
└── CI/CD 파이프라인 구축

🟡 단기 (1개월)
├── Next.js Middleware 인증 가드
├── 폼 검증 강화
├── Toast 시스템 도입
└── Prettier 적용

🟢 중기 (3개월)
├── E2E 테스트 작성
├── 접근성 개선 (WCAG 2.1 AA)
├── 성능 최적화 (Lighthouse 90+)
└── 배포 및 모니터링 설정

⏸️ 백엔드 협의 필요
├── httpOnly Cookie 전환
├── Refresh Token 지원
├── 알림 API 명세
└── 페이지네이션 지원
```

---

## 📝 백엔드 팀 협의 체크리스트

다음 항목들은 백엔드 팀과 협의가 필요합니다:

- [ ] **인증 보안 강화**
  - httpOnly Cookie 지원 가능 여부
  - Refresh Token API 제공 계획
  - 토큰 검증 API 엔드포인트 (`GET /users/me` 또는 유사)

- [ ] **API 추가/수정**
  - 알림 설정 저장/조회 API
  - 페이지네이션 지원 (`?page=1&limit=20`)

- [ ] **정책 확인**
  - 예약 취소 후 재예약 가능 여부
  - 토큰 만료 시간 정책

---

## 📚 참고 문서

- [기능 명세서](./docs/FEATURE_SPECIFICATION.md)
- [구축 상태](./docs/BUILD_STATUS.md)
- [README](./README.md)

---

**Last Updated**: 2025-11-22
