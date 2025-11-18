# 🚀 Next Tasks - API 연동 및 UX 개선

> **현재 상태**: Phase 7.3 완료 (MyPage API 연동 완료)
> **다음 작업**: Phase 7.4 - 알림 설정 API 연동 또는 Phase 7.5 - 에러 처리 강화
> **브랜치**: `claude/api-integration-011CUwzEYYyCCeRTQzUvFkcC`
> **최근 커밋**: `2488940` - API 에러 처리 및 로깅 강화

---

## ✅ 완료된 작업

### Phase 7.1 - 인증 시스템 구현 (완료)
- ✅ 회원가입 API 프록시 (`/api/users/register`)
- ✅ 로그인 API 프록시 (`/api/users/login`)
- ✅ AuthContext 전역 상태 관리
- ✅ 로그인/회원가입 페이지 UI
- ✅ 인증 가드 (마이페이지, 클레임)
- ✅ ConfirmDialog 재사용 컴포넌트
- ✅ 로그인 복귀 기능

### Phase 7.2 - Claim API 연동 (완료)
- ✅ PickupCodeResponse, ClaimResponse 타입 추가
- ✅ Claim API 프록시 (`/api/items/[id]/claim`)
- ✅ Claim 페이지 실제 API 호출
- ✅ ClaimAgreement 컴포넌트 로딩/에러 상태
- ✅ Mock 코드 생성 제거

### Phase 7.3 - MyPage API 연동 (완료) - 커밋 `6a2ef44`
- ✅ MyItemDetailResponse 타입 추가
- ✅ ClaimedItem 타입을 API 응답 구조에 맞게 수정
  - `tags: TagResponse[]` (기존: `string[]`)
  - `code`, `expires_at` 필드 제거 (상세 API에서만 제공)
  - `status: string` (기존: 'pending' | 'completed')
- ✅ MyPage API 프록시 생성
  - GET `/api/items/me` - 내 예약 목록
  - GET `/api/items/me/[id]` - 내 예약 상세 (pickup_code 포함)
- ✅ Mock 데이터 제거 및 실제 API 호출
- ✅ 로딩/에러 상태 처리
- ✅ 2열 그리드 레이아웃 적용
- ✅ 카드 클릭 시 상세 API 호출하여 pickup_code 표시
- ✅ "예약 유효기간" → "코드 유효기간" 라벨 변경
- ✅ 예약 취소 기능 주석 처리 (DELETE API 미구현)

### API 에러 처리 및 로깅 강화 (완료) - 커밋 `2488940`
- ✅ Claim API에 400 에러 처리 추가
- ✅ 모든 API 프록시에 상세 로깅 추가
  - 요청 URL 로깅
  - 성공 시 주요 정보 로깅
  - 에러 시 status, statusText, 상세 에러 데이터 로깅
- ✅ 클라이언트 Claim 페이지 로깅 강화
- ✅ 디버깅 편의성 향상 (raw 데이터 포함)

---

## 📋 다음 작업

### 🔴 Priority 1: Phase 7.4 - 알림 설정 API 연동
**상태**: ⏸️ 보류 (백엔드 API 명세 확인 필요)

**확인 필요 사항**:
- 관심 태그 저장 API 엔드포인트
- 알림 설정 조회 API 엔드포인트
- OpenAPI 명세에 없음 → 백엔드 팀 문의 필요

---

### 🟡 Priority 2: Phase 7.5 - 에러 처리 및 피드백 강화
**예상 시간**: 2시간
**목표**: 사용자 피드백 개선 (Toast 시스템, 에러 처리 일관성)

#### Option A: Toast 시스템 도입
- sonner 또는 react-hot-toast 설치
- alert() 제거하고 Toast로 전환
- 성공/에러 Toast 일관성 확보

#### Option B: 현재 상태 유지
- 기존 alert() 및 state 기반 에러 처리 유지
- 필요 시 커스텀 Toast 컴포넌트 제작

---

### 🔴 Priority 3: 백엔드 확인 필요

| 항목 | 상태 | 비고 |
|-----|------|------|
| `/items/2/claim` 400 에러 | 🔴 확인 필요 | 서버 측 원인 파악 필요 |
| DELETE `/items/{id}/claim` | 🔴 명세 없음 | 예약 취소 API 필요 |
| 알림 설정 API | 🔴 명세 없음 | Phase 7.4 블로킹 |

---

## 📊 API 연동 현황

### ✅ 구현 완료 (Public API)
| API | 파일 | 로깅 |
|-----|------|------|
| GET /health_check | `/api/health/route.ts` | ❌ |
| GET /items/search | `/api/items/search/route.ts` | ❌ |
| GET /items/{id} | `/api/items/[id]/route.ts` | ❌ |
| GET /tags | `/api/tags/route.ts` | ❌ |

### ✅ 구현 완료 (인증 API)
| API | 파일 | 로깅 |
|-----|------|------|
| POST /users/register | `/api/users/register/route.ts` | ✅ |
| POST /users/login | `/api/users/login/route.ts` | ✅ |

### ✅ 구현 완료 (Protected API)
| API | 파일 | 로깅 |
|-----|------|------|
| POST /items/{id}/claim | `/api/items/[id]/claim/route.ts` | ✅ |
| GET /items/me | `/api/items/me/route.ts` | ✅ |
| GET /items/me/{id} | `/api/items/me/[id]/route.ts` | ✅ |

### ❌ 미구현
| API | 우선순위 | 비고 |
|-----|----------|------|
| DELETE /items/{id}/claim | 🔴 보류 | 명세 없음, 백엔드 확인 필요 |
| 알림 설정 API | 🟡 중간 | 명세 없음, Phase 7.4 |

---

## 🧪 테스트 체크리스트

### Phase 7.3 완료 후 테스트
- [x] MyPage 목록 API 호출 성공
- [x] 2열 그리드 레이아웃 정상 표시
- [x] 카드 클릭 시 상세 정보 로딩
- [x] pickup_code 모달에서만 표시
- [x] 401 에러 시 로그인 페이지 이동
- [x] 로딩 상태 스피너 표시
- [x] 빈 목록 메시지 표시

---

## 📝 커밋 전략

### 문서 업데이트 시
```
docs: Phase 7.3 완료 및 다음 작업 계획 문서화

- next_tasks.md 업데이트
- TASKS.md 최신화
- Phase 7.3 완료 내역 정리
- Phase 7.4, 7.5 계획 추가
- 백엔드 확인 필요 항목 정리
```

---

## 🔜 향후 계획

### Phase 8: 성능 최적화
- React Query 도입 (캐싱, 재시도)
- 이미지 최적화
- 코드 스플리팅

### Phase 9: 추가 기능
- 알림 설정 API 연동 (백엔드 준비 시)
- 예약 취소 기능 (DELETE API 준비 시)
- 분실물 등록 기능 (관리자)

### Phase 10: 배포 준비
- 환경 변수 설정
- 빌드 최적화
- Vercel 배포

---

## 📚 참고 링크

- [Next.js 15 문서](https://nextjs.org/docs)
- [OpenAPI 명세](./docs/openapi.yaml)
