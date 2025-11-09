# 마이페이지 UI 개선 작업

## 📋 Phase 1: ClaimedItemCard 텍스트 표기 개선

### 1.1 아이콘 import 추가
- [ ] lucide-react 아이콘 import
  - Package, MapPin, Calendar, Key, Clock, CheckCircle, AlertCircle

### 1.2 태그 스타일 개선
- [ ] 태그에 테두리 추가 (`border border-sky-200`)
- [ ] `#` 기호 제거
- [ ] 배지 형태 유지 (rounded-full, bg-sky-100)

### 1.3 이모티콘 → 선형 아이콘 교체
- [ ] 📦 → `<Package />` (이미지 영역)
- [ ] 📍 → `<MapPin />` (위치)
- [ ] 📅 → `<Calendar />` (날짜)
- [ ] 🔑 → `<Key />` (수령 코드)
- [ ] ⏰ → `<Clock />` (유효기간)
- [ ] 🟡 → `<AlertCircle />` (수령대기 배지)
- [ ] ✓ → `<CheckCircle />` (수령완료 배지)

### 1.4 텍스트 레이아웃 개선
- [ ] 아이콘 + 텍스트를 flex로 정렬
- [ ] 아이콘 크기 통일 (`w-4 h-4`)
- [ ] 아이콘 색상 회색 처리 (`text-gray-500`)

---

## 📋 Phase 2: MyPageItemDetailModal 생성

### 2.1 새 모달 파일 생성
- [ ] `/src/components/mypage/MyPageItemDetailModal.tsx` 생성
- [ ] Props: `item: ClaimedItem`, `onClose: () => void`

### 2.2 모달 레이아웃 구조
- [ ] ItemModal.tsx와 유사한 2단 레이아웃 (이미지 | 정보)
- [ ] 왼쪽: 이미지 영역
- [ ] 오른쪽: 분실물 정보 + 수령 코드 + 유효기간

### 2.3 정보 표시 항목
- [ ] 태그 목록 (배지 형태)
- [ ] 상태 (수령대기 / 수령완료)
- [ ] 등록 날짜
- [ ] 위치
- [ ] **수령 코드** (pending 상태일 때만 표시)
- [ ] **유효기간** (pending 상태일 때만 표시)

### 2.4 하단 버튼
- [ ] pending 상태: "예약 취소" 버튼 (빨간색 계열)
- [ ] completed 상태: 버튼 없음 또는 "닫기" 버튼

---

## 📋 Phase 3: CancelReservationModal 생성

### 3.1 새 모달 파일 생성
- [ ] `/src/components/mypage/CancelReservationModal.tsx` 생성
- [ ] Props: `onClose: () => void`, `onConfirm: (reason: string) => void`

### 3.2 모달 레이아웃
- [ ] 작은 크기 모달 (`max-w-md`)
- [ ] 중앙 배치
- [ ] 제목: "예약을 취소하시겠습니까?"

### 3.3 취소 사유 선택
- [ ] 라디오 버튼으로 사유 선택
  - "일정 변경"
  - "다른 방법으로 찾음"
  - "기타"
- [ ] state로 선택된 사유 관리

### 3.4 버튼
- [ ] "돌아가기" (회색, 모달 닫기)
- [ ] "취소하기" (빨간색, 예약 취소 실행)

---

## 📋 Phase 4: 통합 및 연결

### 4.1 ClaimedItemCard 클릭 이벤트
- [ ] ClaimedItemCard에 onClick 핸들러 추가
- [ ] 클릭 시 MyPageItemDetailModal 열기

### 4.2 MyPage.tsx 상태 관리
- [ ] selectedItem state 추가
- [ ] 모달 열기/닫기 핸들러

### 4.3 모달 간 연결
- [ ] MyPageItemDetailModal에서 "예약 취소" 버튼 클릭
- [ ] CancelReservationModal 열기
- [ ] 취소 확정 시 두 모달 모두 닫기

### 4.4 API 연동 준비 (TODO 주석)
- [ ] 예약 취소 API 호출 위치 TODO 주석 추가
- [ ] 성공/실패 처리 로직 주석 추가

---

## 🎨 디자인 가이드라인

### 색상
- 예약 취소 버튼: `bg-red-500 hover:bg-red-600`
- 알림 배지: `bg-yellow-100 text-yellow-700` (pending)
- 완료 배지: `bg-green-100 text-green-700` (completed)

### 아이콘 크기
- 카드 내부: `w-4 h-4`
- 섹션 헤더: `w-6 h-6`

### 간격
- 카드 간: `space-y-4`
- 항목 간: `space-y-2`
- 아이콘-텍스트: `gap-2`

---

## ✅ 완료 조건
- [ ] 모든 이모티콘이 선형 아이콘으로 교체됨
- [ ] 태그에 테두리가 추가됨
- [ ] 마이페이지 분실물 클릭 시 상세 모달 열림
- [ ] 모달에서 "예약 취소" 클릭 시 취소 확인 모달 열림
- [ ] 취소 사유 선택 후 확정 가능
- [ ] 타입 에러 없음
- [ ] ESLint 경고 없음
