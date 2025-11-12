# 🚀 Next Tasks - API 연동

> **현재 작업**: Phase 7.3 - MyPage API 연동
> **목표**: 마이페이지 실제 데이터 연동

---

## ✅ 완료된 작업

### Phase 7.1 - 인증 시스템 구현 (완료)
- ✅ 회원가입 API 프록시 (`/api/users/register`)
- ✅ 로그인 API 프록시 (`/api/users/login`)
- ✅ AuthContext 전역 상태 관리
- ✅ 로그인 페이지 UI
- ✅ 회원가입 페이지 UI
- ✅ 인증 가드 (마이페이지, 클레임)
- ✅ ConfirmDialog 재사용 컴포넌트
- ✅ 로그인 복귀 기능
- ✅ 에러 로깅 개선

### Phase 7.2 - Claim API 연동 (완료)
- ✅ PickupCodeResponse, ClaimResponse 타입 추가
- ✅ Claim API 프록시 (`/api/items/[id]/claim`)
- ✅ Claim 페이지 실제 API 호출
- ✅ ClaimAgreement 컴포넌트 로딩/에러 상태
- ✅ Mock 코드 생성 제거 (백엔드 자동 생성)

---

## 📋 다음 작업: Phase 7.3 - MyPage API 연동

### 작업 개요
마이페이지의 Mock 데이터를 실제 API로 교체하고, 예약 목록을 동적으로 가져옵니다.

---

### Step 1: 타입 정의 추가 (5분)

**파일**: `src/lib/types/lostItem.ts`

**추가할 타입**:
```typescript
// MyPage 관련 타입
export interface MyItemDetailResponse {
  item: ItemResponse;
  pickup_code: PickupCodeResponse;
}
```

---

### Step 2: MyPage API 프록시 생성 (15분)

#### 2.1 내 예약 목록 프록시
**새 파일**: `src/app/api/items/me/route.ts`

```typescript
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }

  const apiBaseUrl = process.env.API_BASE_URL;
  const response = await fetch(`${apiBaseUrl}/main/items/me`, {
    headers: { 'Authorization': authHeader },
  });

  // 에러 처리: 401, 500+
  if (!response.ok) { ... }

  return NextResponse.json(await response.json());
}
```

#### 2.2 내 예약 상세 프록시 (Optional)
**새 파일**: `src/app/api/items/me/[id]/route.ts`

비슷한 구조로 상세 정보 프록시 생성

---

### Step 3: MyPage Mock 데이터 제거 (20분)

**파일**: `src/app/mypage/page.tsx`

**변경 내용**:

1. **Mock 데이터 제거**:
```typescript
// 삭제
const mockClaimedItems: ClaimedItem[] = [ ... ];
```

2. **State 추가**:
```typescript
const [claimedItems, setClaimedItems] = useState<ClaimedItem[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

3. **useEffect로 API 호출**:
```typescript
useEffect(() => {
  if (!isAuthenticated || isLoading) return;

  async function fetchMyItems() {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch('/api/items/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('access_token');
          router.push('/login?redirect=/mypage&message=로그인이 필요합니다.');
          return;
        }
        throw new Error('예약 목록을 불러오는데 실패했습니다.');
      }

      const data = await response.json();
      setClaimedItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  fetchMyItems();
}, [isAuthenticated, isLoading, router]);
```

4. **UI 상태 처리**:
```typescript
// 로딩 중
if (loading) {
  return <div>로딩 중...</div>;
}

// 에러
if (error) {
  return <div>에러: {error}</div>;
}

// 빈 목록
const pendingItems = claimedItems.filter(item => item.status === 'pending');
const completedItems = claimedItems.filter(item => item.status === 'completed');

{pendingItems.length === 0 && (
  <p>수령 대기 중인 분실물이 없습니다.</p>
)}
```

---

### Step 4: 예약 취소 기능 주석 처리 (5분)

**파일**: `src/app/mypage/page.tsx`

**이유**: OpenAPI 명세에 DELETE 엔드포인트 없음, 백엔드 확인 필요

```typescript
// TODO: DELETE API 구현 후 활성화
// const handleCancelReservation = () => { ... };
// const handleConfirmCancel = (reason: string) => { ... };
```

**CancelReservationModal 렌더링 주석**:
```typescript
{/* TODO: 예약 취소 API 구현 후 활성화
{showCancelModal && (
  <CancelReservationModal ... />
)}
*/}
```

**MyPageItemDetailModal의 취소 버튼도 숨김 처리**

---

### Step 5: ClaimedItem 타입 확인 (5분)

**파일**: `src/components/mypage/ClaimedItemCard.tsx`

OpenAPI 응답 구조와 ClaimedItem 타입이 일치하는지 확인:

```typescript
export interface ClaimedItem {
  id: number;
  tags: string[];           // → TagResponse[] 로 변경 필요?
  location: string | null;
  registered_at: string;
  photo_url: string | null;
  code: string;             // pickup_code.code
  status: 'pending' | 'completed';
  expires_at: string;       // pickup_code.expires_at
}
```

필요 시 타입 수정

---

## 🧪 테스트 시나리오

### 1. 정상 플로우
1. 로그인
2. 마이페이지 접근
3. 예약 목록 표시 확인
4. 수령 대기/완료 분리 확인

### 2. 에러 케이스
- 401: 토큰 만료 → 로그인 페이지로
- 빈 목록: "예약이 없습니다" 메시지
- 네트워크 에러: 에러 메시지 표시

### 3. 로딩 상태
- 스피너 또는 스켈레톤 표시

---

## 📝 커밋 전략

Phase 7.3 완료 시:
```
feat: Phase 7.3 - MyPage API 연동 완료

- GET /items/me API 프록시 생성
- Mock 데이터 제거
- 실제 API로 예약 목록 조회
- 로딩/에러 상태 처리
- 예약 취소 기능 주석 처리 (DELETE API 미구현)
```

---

## 🔜 다음 단계

Phase 7.3 완료 후:
- Phase 8: 성능 최적화 (React Query, 캐싱)
- Phase 9: 알림 설정 API 연동
- Phase 10: 에러 피드백 강화 (Toast)
