# 마이페이지 모달 모바일 개선 보고서

**작성일:** 2025-11-28
**문제:** 마이페이지 모달이 모바일에서 PC 버전처럼 보임
**목표:** 홈페이지 모달처럼 모바일 바텀시트로 변경

---

## 문제 분석

### 현재 상태 비교

#### 홈페이지 모달 (ItemModal) ✅ 좋은 예시
```jsx
// src/components/ItemModal.tsx:98
<div className="fixed inset-0 backdrop-blur-sm bg-black/40
                flex items-end md:items-center justify-center z-50 md:p-4">
  <div className="bg-white rounded-t-3xl md:rounded-3xl
                  w-full md:max-w-6xl max-h-[85vh] md:max-h-[90vh]">
    {/* 모달 내용 */}
  </div>
</div>
```

**특징:**
- `items-end`: 모바일에서 **하단 정렬** (바텀시트)
- `md:items-center`: 데스크톱에서 중앙 정렬
- `rounded-t-3xl`: 모바일에서 **상단만** 둥글게
- `md:rounded-3xl`: 데스크톱에서 전체 둥글게
- `md:p-4`: 데스크톱에서만 여백

---

#### 마이페이지 모달 (MyPageItemDetailModal) ❌ 문제
```jsx
// src/components/mypage/MyPageItemDetailModal.tsx:81
<div className="fixed inset-0 backdrop-blur-sm bg-black/40
                flex items-center justify-center z-50 p-4">
  <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh]">
    {/* 모달 내용 */}
  </div>
</div>
```

**문제점:**
- `items-center`: 모든 화면에서 중앙 정렬 → 모바일에서도 중앙에 뜸
- `p-4`: 모든 화면에서 여백 → 모바일에서 화면을 다 채우지 못함
- `rounded-3xl`: 모든 화면에서 전체 둥글게 → 모바일에서 불필요한 하단 라운딩
- `max-w-6xl`: 모바일에서도 최대 너비 제한 → 화면 활용도 낮음

---

## 개선 방안

### 방안 A: 홈페이지 모달 패턴 그대로 적용 ⭐ 추천

**변경:**

#### 1. 배경 래퍼
```jsx
// AS-IS
<div className="fixed inset-0 backdrop-blur-sm bg-black/40
                flex items-center justify-center z-50 p-4">

// TO-BE
<div className="fixed inset-0 backdrop-blur-sm bg-black/40
                flex items-end md:items-center justify-center z-50 md:p-4">
```

**변경점:**
- `items-center` → `items-end md:items-center`
- `p-4` → `md:p-4`

---

#### 2. 모달 카드
```jsx
// AS-IS
<div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh]
                overflow-hidden flex flex-col md:flex-row">

// TO-BE
<div className="bg-white rounded-t-3xl md:rounded-3xl
                w-full md:max-w-6xl max-h-[85vh] md:max-h-[90vh]
                overflow-hidden flex flex-col md:flex-row">
```

**변경점:**
- `rounded-3xl` → `rounded-t-3xl md:rounded-3xl`
- `max-w-6xl` → `md:max-w-6xl` (모바일 전체 너비)
- `max-h-[90vh]` → `max-h-[85vh] md:max-h-[90vh]` (모바일 높이 조정)

---

#### 3. 드래그 핸들 추가 (선택사항)

모바일 바텀시트 UX 개선을 위해 상단에 드래그 핸들 추가:

```jsx
<div className="bg-white rounded-t-3xl md:rounded-3xl ...">
  {/* 드래그 핸들 (모바일만) */}
  <div className="md:hidden flex justify-center py-3">
    <div className="w-12 h-1 bg-gray-300 rounded-full" />
  </div>

  {/* 기존 닫기 버튼 */}
  <button onClick={onClose} className="absolute top-4 right-4 ...">
    <X />
  </button>

  {/* 나머지 내용 */}
</div>
```

---

### 방안 B: 커스텀 모바일 레이아웃

홈페이지 모달과 다르게 마이페이지 전용 모바일 레이아웃 적용

**구조:**
```
모바일 (< md):
┌─────────────────┐
│   [드래그 핸들]  │
├─────────────────┤
│     이미지       │
├─────────────────┤
│   정보 (스크롤)  │
│   - 수령코드     │
│   - 장소         │
│   - 태그         │
│   [예약취소]     │
└─────────────────┘

데스크톱 (≥ md):
┌──────────┬─────┐
│          │정보 │
│  이미지  │태그 │
│          │버튼 │
└──────────┴─────┘
```

**구현:**
```jsx
<div className="bg-white rounded-t-3xl md:rounded-3xl ...">
  {/* 모바일: 세로 배치, 데스크톱: 가로 배치 */}
  <div className="flex flex-col md:flex-row">
    {/* 이미지 */}
    <div className="w-full md:w-2/3 h-64 md:h-auto">
      {/* 이미지 */}
    </div>

    {/* 정보 */}
    <div className="w-full md:w-1/3 p-4 overflow-y-auto">
      {/* 상세 정보 */}
    </div>
  </div>
</div>
```

---

## 상세 구현 (방안 A)

### 파일: `src/components/mypage/MyPageItemDetailModal.tsx`

#### 변경 1: 배경 래퍼 (line 80-83)

```jsx
// 기존
<div
  className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50 p-4"
  onClick={onClose}
>

// 수정
<div
  className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-end md:items-center justify-center z-50 md:p-4"
  onClick={onClose}
>
```

---

#### 변경 2: 모달 카드 (line 84-87)

```jsx
// 기존
<div
  className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
  onClick={(e) => e.stopPropagation()}
>

// 수정
<div
  className="bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-6xl max-h-[85vh] md:max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
  onClick={(e) => e.stopPropagation()}
>
```

---

#### 변경 3: 드래그 핸들 추가 (line 88 이후)

```jsx
<div className="...">
  {/* 드래그 핸들 (모바일 전용) */}
  <div className="md:hidden flex justify-center pt-3 pb-1 bg-white sticky top-0 z-10">
    <div className="w-12 h-1 bg-gray-300 rounded-full" />
  </div>

  {/* 기존 닫기 버튼 */}
  <button
    onClick={onClose}
    className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors"
  >
    <X className="w-6 h-6 text-gray-600" />
  </button>

  {/* 왼쪽: 이미지 영역 (기존 코드) */}
  <div className="relative md:w-2/3 ...">
    ...
  </div>
</div>
```

---

## CancelReservationModal도 동일 적용

`src/components/mypage/CancelReservationModal.tsx`도 같은 문제가 있습니다.

### 현재 (line 50-52)
```jsx
<div
  className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-[60] p-4"
  onClick={onClose}
>
```

### 수정
```jsx
<div
  className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-end md:items-center justify-center z-[60] md:p-4"
  onClick={onClose}
>
```

### 모달 카드 수정 (line 54-56)
```jsx
// 기존
<div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">

// 수정
<div className="bg-white rounded-t-3xl md:rounded-2xl w-full md:max-w-md p-6 shadow-xl">
```

---

## 효과 예상

### Before (현재)
```
모바일:
┌────────────┐
│            │ ← 상하 여백
│  ┌──────┐  │
│  │ 모달 │  │ ← 중앙 정렬
│  └──────┘  │
│            │ ← 상하 여백
└────────────┘
```

**문제:**
- 화면 활용도 낮음
- PC처럼 보임
- 터치 제스처 어색함

---

### After (개선)
```
모바일:
┌────────────┐
│            │
│            │
│┌──────────┐│
││  모달    ││ ← 하단 정렬
││          ││ ← 전체 너비
│└──────────┘│
└────────────┘
```

**개선:**
- 화면 최대 활용
- 네이티브 앱처럼 자연스러움
- 드래그 제스처 지원 가능
- 모바일 UX 최적화

---

## 추가 개선 (선택사항)

### 1. 스와이프 다운으로 닫기

```jsx
const [startY, setStartY] = useState(0);
const [currentY, setCurrentY] = useState(0);

const handleTouchStart = (e: React.TouchEvent) => {
  setStartY(e.touches[0].clientY);
};

const handleTouchMove = (e: React.TouchEvent) => {
  setCurrentY(e.touches[0].clientY);
};

const handleTouchEnd = () => {
  if (currentY - startY > 100) {
    onClose();
  }
  setStartY(0);
  setCurrentY(0);
};

<div
  onTouchStart={handleTouchStart}
  onTouchMove={handleTouchMove}
  onTouchEnd={handleTouchEnd}
>
  {/* 모달 내용 */}
</div>
```

---

### 2. 애니메이션 개선

모바일 바텀시트는 아래에서 위로 올라오는 애니메이션이 자연스럽습니다.

```jsx
// Tailwind CSS Animation
<div className="bg-white rounded-t-3xl md:rounded-3xl
                animate-in slide-in-from-bottom md:fade-in
                duration-300">
```

또는 Framer Motion 사용:
```jsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ y: '100%' }}
  animate={{ y: 0 }}
  exit={{ y: '100%' }}
  transition={{ type: 'spring', damping: 30 }}
  className="md:hidden"
>
  {/* 모바일 바텀시트 */}
</motion.div>
```

---

## 구현 우선순위

1. **즉시 적용 (필수):**
   - `items-end md:items-center` 적용
   - `rounded-t-3xl md:rounded-3xl` 적용
   - `md:p-4`, `md:max-w-6xl` 적용

2. **단기 적용 (권장):**
   - 드래그 핸들 추가

3. **장기 적용 (선택):**
   - 스와이프 다운 제스처
   - 애니메이션 개선

---

## 적용 파일

1. **MyPageItemDetailModal.tsx** ⭐ 우선순위 높음
   - 분실물 상세 모달
   - 가장 자주 사용

2. **CancelReservationModal.tsx** ⭐ 우선순위 높음
   - 예약 취소 모달
   - 모바일 UX 중요

---

## 테스트 체크리스트

- [ ] 모바일(< 768px): 바텀시트로 표시
- [ ] 데스크톱(≥ 768px): 중앙 모달로 표시
- [ ] 배경 클릭 시 닫힘
- [ ] ESC 키로 닫힘
- [ ] 드래그 핸들 표시 (모바일만)
- [ ] 스크롤 동작 정상
- [ ] 이미지 표시 정상
- [ ] 버튼 클릭 정상

---

## 참고

### 유사 사례
- Instagram 하단 액션 시트
- Twitter 댓글 모달
- 카카오톡 프로필 모달

### 디자인 가이드
- iOS: Bottom Sheet (최대 85% 높이)
- Android: Modal Bottom Sheet
- Material Design 3: Bottom Sheets
