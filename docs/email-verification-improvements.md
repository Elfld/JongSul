# 이메일 인증 UX 개선 보고서

작성일: 2025-11-28

## 1. 이메일 수정 시 타이머/텍스트 사라지는 버그

### 문제 상황
- 인증요청 후 이메일을 수정하면 타이머와 성공 메시지가 사라짐
- 사용자 요구사항: 이메일 수정해도 타이머는 계속 표시되어야 함

### 원인 분석

**위치:** `src/app/register/page.tsx:46-50`

```typescript
useEffect(() => {
  if (email !== previousEmail && emailVerificationRequested) {
    setEmailVerificationRequested(false);  // 문제 지점
  }
}, [email, previousEmail, emailVerificationRequested]);
```

**문제점:**
- `emailVerificationRequested` 상태가 두 가지 UI 요소를 동시에 제어:
  1. 버튼 텍스트 (인증요청 ↔ 재발송)
  2. 성공 메시지 및 타이머 표시 여부 (205-210줄)
- 이메일 수정 시 버튼을 "인증요청"으로 되돌리기 위해 `false`로 설정
- 결과적으로 성공 메시지까지 함께 사라짐

### 해결 방안

#### 옵션 A: 상태 분리 (별도 상태 추가)

`emailVerificationRequested`와 별도로 `showSuccessMessage` 상태 추가

**구현:**
```typescript
const [emailVerificationRequested, setEmailVerificationRequested] = useState(false);
const [showSuccessMessage, setShowSuccessMessage] = useState(false);

// 인증 요청 시
setEmailVerificationRequested(true);
setShowSuccessMessage(true);

// 이메일 변경 감지
useEffect(() => {
  if (email !== previousEmail && emailVerificationRequested) {
    setEmailVerificationRequested(false);
    // showSuccessMessage는 그대로 유지
  }
}, [email, previousEmail, emailVerificationRequested]);

// 버튼
{emailVerificationRequested ? '재발송' : '인증요청'}

// 메시지
{showSuccessMessage && remainingTime > 0 && !isEmailVerified && (
  <div>인증번호를 발송했습니다. {formatTime(remainingTime)}</div>
)}
```

**장점:**
- 명확한 역할 분리
- 버튼과 메시지 독립적 제어

**단점:**
- 상태 추가로 복잡도 증가
- 두 상태 동기화 관리 필요

---

#### 옵션 B: 조건 변경 (remainingTime 기반)

메시지 표시 조건을 `remainingTime > 0`으로만 제어

**구현:**
```typescript
// 버튼
{previousEmail === email && remainingTime > 0 ? '재발송' : '인증요청'}

// 메시지
{remainingTime > 0 && !isEmailVerified && (
  <div>인증번호를 발송했습니다. {formatTime(remainingTime)}</div>
)}

// 인증번호 입력 활성화
disabled={!(previousEmail === email && remainingTime > 0) || isEmailVerified}

// 확인 버튼 활성화
disabled={!(previousEmail === email && remainingTime > 0) || verificationCode.length !== 6 || verifyingEmail || isEmailVerified}

// 타이머 useEffect
useEffect(() => {
  if (remainingTime > 0 && !isEmailVerified) {
    const timer = setInterval(() => {
      setRemainingTime((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }
}, [remainingTime, isEmailVerified]);

// 이메일 변경 감지 useEffect 삭제 (불필요)
```

**장점:**
- `emailVerificationRequested` 상태 완전 제거 가능
- 기존 `previousEmail`, `remainingTime` 상태만으로 모든 제어
- 코드가 더 단순해짐
- 이메일이 다르면 자동으로 "인증요청"으로 변경
- 타이머는 계속 표시됨

**단점:**
- 초기 상태에서 `remainingTime`이 300이면 메시지가 바로 표시될 수 있음
  → 해결: 초기값을 0으로 설정하고, 인증 요청 시 300으로 설정

---

#### 옵션 C: 버튼 전용 상태 추가

버튼 텍스트 제어용 상태 별도 추가

**구현:**
```typescript
const [verificationRequestedForEmail, setVerificationRequestedForEmail] = useState('');

// 인증 요청 시
setVerificationRequestedForEmail(email);
setEmailVerificationRequested(true);

// 버튼
{verificationRequestedForEmail === email && emailVerificationRequested ? '재발송' : '인증요청'}

// 메시지
{emailVerificationRequested && remainingTime > 0 && !isEmailVerified && (
  <div>인증번호를 발송했습니다. {formatTime(remainingTime)}</div>
)}

// 이메일 변경 감지 useEffect 유지 (emailVerificationRequested 제어)
```

**장점:**
- 버튼 제어를 명확하게 분리
- `emailVerificationRequested`는 메시지 제어에만 사용

**단점:**
- 상태 추가
- 옵션 B보다 복잡

---

### 권장 사항

**옵션 B 추천**

**이유:**
1. 코드 간소화: 상태 제거 (`emailVerificationRequested`)
2. 명확한 로직: `previousEmail`, `remainingTime`만으로 모든 상태 파악 가능
3. 유지보수 용이: 조건이 직관적
4. 요구사항 완벽 충족: 이메일 수정해도 타이머 유지

**수정 범위:**
- 상태: `emailVerificationRequested` 제거, `remainingTime` 초기값 0으로 변경
- useEffect: 타이머 조건 단순화, 이메일 변경 감지 useEffect 삭제
- UI 조건: 모든 `emailVerificationRequested` → `previousEmail === email && remainingTime > 0`

---

## 2. alert() 사용 현황

총 **8개** 발견:

### `src/app/mypage/page.tsx` (5개)
- Line 161: `alert('수정이 완료되었습니다.');`
- Line 189: `alert(data.error || '저장 중 오류가 발생했습니다.');`
- Line 195: `alert('저장 중 오류가 발생했습니다.');`
- Line 205: `alert('비밀번호 변경이 완료되었습니다.');`
- Line 212: `alert('비밀번호 변경 중 오류가 발생했습니다.');`

### `src/components/claim/ClaimAgreement.tsx` (1개)
- Line 31: `alert(message);`

### `src/components/mypage/CancelReservationModal.tsx` (2개)
- Line 33: `alert('예약 취소가 완료되었습니다.');`
- Line 40: `alert(data.error || '예약 취소에 실패했습니다.');`

### 대응 방안
기존에 구현된 알림용 모달 컴포넌트로 교체

---

## 3. 인증번호 입력 검증 변경

### 요청사항
1. Placeholder: "인증번호(6자리)" → "인증번호"
2. 확인 버튼: 1자 이상 입력 시 즉시 활성화
3. 텍스트 입력 허용 (숫자만 아닌)

### 현재 구현

**Input Handler (88-92줄):**
```typescript
const handleVerificationCodeChange = (code: string) => {
  const numericCode = code.replace(/\D/g, '').slice(0, 6);  // 숫자만 필터링
  setVerificationCode(numericCode);
};
```

**Button Activation (235줄):**
```typescript
disabled={!emailVerificationRequested || verificationCode.length !== 6 || verifyingEmail || isEmailVerified}
// 정확히 6자리일 때만 활성화
```

**Input Field (220-230줄):**
```typescript
<input
  type="text"
  inputMode="numeric"
  placeholder="인증번호(6자리)"
  maxLength={6}
  // ...
/>
```

### API 구조 확인

**Endpoint:** `POST /api/users/email/verify`

**Request Body:**
```typescript
{
  email: string,
  code: string  // 형식 제한 없음
}
```

**Backend:**
- `code`를 문자열로 받음
- 숫자 외 문자 입력해도 API 호출 가능
- 잘못된 형식은 검증 실패로 400 에러 응답

### 기술적 문제점 분석

#### ✅ API 레벨: 문제 없음
- 백엔드는 `code`를 `string` 타입으로 받음
- 숫자 외 문자를 입력해도 API 호출 자체는 가능
- 검증 실패 시 400 에러로 응답 처리됨

#### ✅ 프론트엔드 레벨: 문제 없음
기술적으로 변경 가능한 부분

**필요한 수정:**

1. **Placeholder 변경:**
```typescript
placeholder="인증번호"
```

2. **숫자 필터 제거:**
```typescript
const handleVerificationCodeChange = (code: string) => {
  setVerificationCode(code.slice(0, 6));  // 숫자 필터(/\D/g) 제거
};
```

3. **maxLength 제거 또는 증가:**
```typescript
// maxLength={6} 제거
// 또는
maxLength={10}  // 필요시 더 긴 입력 허용
```

4. **버튼 활성화 조건 변경:**
```typescript
disabled={!emailVerificationRequested || verificationCode.length === 0 || verifyingEmail || isEmailVerified}
// length !== 6 → length === 0
```

5. **검증 로직 수정:**
```typescript
const handleVerifyCode = async () => {
  if (verificationCode.length === 0) {  // 6자리 체크 제거
    setError('인증번호를 입력해주세요.');
    return;
  }
  // ...
};
```

#### ⚠️ UX 고려사항

**현재 방식 (숫자만):**
- 잘못된 형식 입력 자체를 방지
- 사용자가 실수로 텍스트 입력 불가
- 에러 발생 가능성 감소

**변경 후 방식 (텍스트 허용):**
- 사용자가 텍스트 입력 가능
- 확인 버튼 클릭 → API 호출 → 에러 메시지 받는 플로우
- 사용자 입력 시도 횟수 증가 가능성
- 인증 실패 시 명확한 에러 메시지 필요

### 결론

**기술적으로 문제되는 사항: 없음**

- API와 프론트엔드 모두 수정 가능
- 백엔드에서 검증 처리됨
- 단, UX 측면에서 현재 방식(숫자만)이 사용자 실수를 줄이는 효과 있음

---

## Next Tasks

### 1. 이메일 수정 버그 수정
- [ ] `emailVerificationRequested` 상태 제거
- [ ] `remainingTime` 초기값 0으로 변경
- [ ] 타이머 useEffect 조건 단순화
- [ ] 이메일 변경 감지 useEffect 삭제
- [ ] 모든 UI 조건을 `previousEmail === email && remainingTime > 0`으로 변경

### 2. alert() → 모달 교체
- [ ] `src/app/mypage/page.tsx` (5개)
- [ ] `src/components/claim/ClaimAgreement.tsx` (1개)
- [ ] `src/components/mypage/CancelReservationModal.tsx` (2개)

### 3. 인증번호 입력 검증 변경
- [ ] Placeholder: "인증번호(6자리)" → "인증번호"
- [ ] 숫자 필터(`/\D/g`) 제거
- [ ] 버튼 활성화: `length !== 6` → `length > 0`
- [ ] 검증 로직: 6자리 체크 제거
- [ ] maxLength 조정 또는 제거
