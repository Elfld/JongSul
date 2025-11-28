# 이메일 인증 UX 개선 작업 요약

**작업일:** 2025-11-28
**브랜치:** `claude/email-verification-013XWjudsHGt33Yg9sXFRWLn`
**커밋:** c47bedd

---

## 작업 내용

### 1. 이메일 수정 시 타이머 사라지는 버그 수정 (옵션 B)

**문제:**
- 인증 요청 후 이메일을 수정하면 타이머와 성공 메시지가 사라짐
- 요구사항: 이메일 수정해도 타이머는 계속 표시되어야 함

**원인:**
- `emailVerificationRequested` 상태가 버튼 텍스트와 메시지 표시를 동시에 제어
- 이메일 변경 시 `false`로 설정되어 메시지까지 사라짐

**해결 방안 비교:**
- 옵션 A: 상태 분리 (`showSuccessMessage` 추가)
- **옵션 B: 조건 변경 (`remainingTime` 기반)** ✅ 선택
- 옵션 C: 버튼 전용 상태 추가 (`verificationRequestedForEmail`)

**선택 이유 (옵션 B):**
- 논리적으로 가장 명확: 단일 진실 원천 (Single Source of Truth)
- `remainingTime > 0` = 인증번호 유효
- `previousEmail === email` = 현재 이메일로 요청했는지
- 상태 추가 없이 코드 간소화

**구현:**
```typescript
// emailVerificationRequested 상태 제거
// remainingTime 초기값 0으로 변경

// 버튼 텍스트
previousEmail === email && remainingTime > 0 ? '재발송' : '인증요청'

// 메시지 표시
remainingTime > 0 && !isEmailVerified

// 입력란 활성화
previousEmail === email && remainingTime > 0
```

**결과:**
- 이메일 수정해도 타이머 유지
- 버튼은 "인증요청"으로 변경 (논리적으로 정확)
- 코드 간결화

---

### 2. alert() 8개를 ConfirmDialog 모달로 교체

**작업:**
- `ConfirmDialog` 컴포넌트 확장: `onCancel`을 optional로 변경
- 취소 버튼 없이 확인 버튼만 표시 가능 (단순 알림 지원)

**교체 완료:**
1. `src/app/mypage/page.tsx`: 5개
   - 로그인 필요, 권한 없음, 예약 없음, 취소 완료, 오류
2. `src/components/claim/ClaimAgreement.tsx`: 1개
   - 서약서 동의 필요
3. `src/components/mypage/CancelReservationModal.tsx`: 2개
   - 취소 사유 선택 필요, 취소 사유 입력 필요

**개선 효과:**
- 일관된 UI/UX
- 재사용 가능한 컴포넌트 활용
- 브라우저 기본 alert 의존성 제거

---

### 3. 인증번호 입력 검증 변경

**변경 사항:**
1. Placeholder: "인증번호(6자리)" → "인증번호"
2. `maxLength` 제거
3. 숫자 필터 제거: `/\D/g` 제거하여 텍스트 입력 허용
4. 버튼 활성화: 정확히 6자리 → 1자 이상 입력 시
5. 검증 로직: 6자리 체크 제거 → 빈 입력만 체크

**기술적 검토:**
- API: `code: string` (형식 제한 없음) → 문제 없음
- 백엔드에서 검증 처리
- 사용자 입력 유연성 증가

---

## 보안 분석

### 질문: disabled 강제 해제 시 보안 문제?

**시나리오 A: 인증번호 검증**
```
1. old@email.com으로 인증 요청
2. new@email.com으로 변경 + disabled 해제
3. API: { email: "new@email.com", code: "123456" }
4. 백엔드: new@email.com에 대한 인증번호 없음 → 400 에러
```
→ **차단됨** ✅

**시나리오 B: 회원가입**
```
1. old@email.com으로 인증 완료 → verification_token 발급
2. disabled 해제 → new@email.com으로 변경
3. API: { email: "new@email.com", verification_token: "old 토큰" }
4. 백엔드: 토큰-이메일 불일치 → 400/401 에러
```
→ **차단됨** ✅

**결론:**
- 현재 구조는 **백엔드 검증으로 안전함**
- 프론트엔드는 UX 개선용 (백엔드가 최종 검증)
- `previousEmail`과 `email` 분리로 의도 명확화

---

## 파일 변경 내역

```
src/app/register/page.tsx                            // 이메일 인증 UX 개선
src/app/mypage/page.tsx                              // alert → ConfirmDialog
src/components/ConfirmDialog.tsx                     // onCancel optional
src/components/claim/ClaimAgreement.tsx              // alert → ConfirmDialog
src/components/mypage/CancelReservationModal.tsx    // alert → ConfirmDialog
```

---

## 커밋 히스토리

```
c47bedd - feat: 이메일 인증 UX 개선 (옵션 B) 및 alert 대체
33c4e55 - docs: 이메일 인증 UX 개선사항 보고서 작성
c28aa21 - feat: 이메일 인증 UX 개선
4239045 - fix: ESLint 에러 수정 (any → unknown)
```

---

## 논의 내용

### 옵션 B 선택 근거

**논리적 우수성:**
1. **단일 진실 원천:** `remainingTime`, `previousEmail`만으로 모든 상태 파악
2. **도메인 정확성:** 실제 비즈니스 로직(5분 유효기간)을 직접 표현
3. **불일치 불가능:** 독립적 사실만 저장, 파생 상태는 계산
4. **간결성:** 불필요한 상태 제거
5. **확장성:** 타이머 관련 기능 추가 시 자연스럽게 확장

**vs 옵션 A:**
- 두 불린 상태(`emailVerificationRequested`, `showSuccessMessage`)가 불일치할 수 있음
- 상태 동기화 관리 필요

**vs 옵션 C:**
- `verificationRequestedForEmail`은 `previousEmail`과 중복
- `emailVerificationRequested`는 `remainingTime > 0`과 동일한 의미

---

## 추가 개선 제안 (미구현)

1. **인증된 이메일 명시적 저장**
   - 인증 완료 시 `verifiedEmail` 상태에 이메일 저장
   - API 호출 시 `verifiedEmail` 사용
   - 프론트엔드 레벨에서 이메일-토큰 매칭 보장

2. **인증 완료 후 이메일 변경 완전 차단**
   - 현재: disabled로만 차단 (DOM 조작 가능)
   - 개선: 인증 완료 시 이메일 입력란 자체를 고정

---

## 참고

- 백엔드 API: `/users/email/verify`, `/users/register/verified`
- 인증번호 유효기간: 5분
- 토큰 유효기간: 10분
- 백엔드에서 이메일-토큰 매칭 검증 수행
