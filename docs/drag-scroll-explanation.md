# 드래그 스크롤 상세 설명

## 📊 전체 동작 흐름

```
1. 마우스 다운 → 2. 마우스 이동 → 3. 마우스 업/나가기
   (시작)         (드래그 중)        (종료)
```

## 🔧 핵심 개념: 좌표 시스템

드래그 스크롤은 **좌표 차이를 이용한 스크롤 위치 계산**입니다.

### 페이지 좌표 vs 컨테이너 좌표

```
브라우저 페이지 전체:
├────────────────────────────────────────┤
0px                                    1920px

컨테이너 위치:
        ├───────────────┤
        500px (offsetLeft)  900px

마우스 클릭:
               ↓
               700px (e.pageX)
```

**컨테이너 내부 상대 좌표 계산:**
```typescript
const x = e.pageX - containerRef.current.offsetLeft;
// x = 700 - 500 = 200
// → 컨테이너 왼쪽 끝으로부터 200px 위치
```

---

## 📝 코드 단계별 분석

### 파일 위치
- `src/lib/hooks/useDragScroll.ts`
- `src/components/CategoryChips.tsx` (사용 예시)

### 1️⃣ 상태 변수 (4개)

```typescript
const containerRef = useRef<HTMLDivElement>(null);
const [isDragging, setIsDragging] = useState(false);
const [startX, setStartX] = useState(0);
const [scrollLeft, setScrollLeft] = useState(0);
```

| 변수 | 타입 | 역할 |
|------|------|------|
| `containerRef` | ref | 드래그할 DOM 요소 참조 |
| `isDragging` | boolean | 현재 드래그 중인지 여부 |
| `startX` | number | 드래그 시작 시 마우스 X 위치 (컨테이너 기준) |
| `scrollLeft` | number | 드래그 시작 시 스크롤 위치 |

---

### 2️⃣ handleMouseDown - 드래그 시작

```typescript
const handleMouseDown = useCallback((e: React.MouseEvent) => {
  if (!containerRef.current) return;

  setIsDragging(true);
  setStartX(e.pageX - containerRef.current.offsetLeft);
  setScrollLeft(containerRef.current.scrollLeft);
}, []);
```

**동작 시나리오:**

```
사용자가 칩스 영역을 클릭했을 때:

브라우저 화면:
├─────────────────────────────────────┤
0                                   1920px
        ┌─────────────────────┐
        │ [전자기기][의류]... │ ← 컨테이너
        └─────────────────────┘
        500px (offsetLeft)
                 ↓ 클릭 (e.pageX = 700)

계산:
startX = 700 - 500 = 200
scrollLeft = 0 (현재 스크롤 위치)
isDragging = true
```

**각 줄의 역할:**

```typescript
setIsDragging(true);
// "지금부터 드래그 모드입니다!"

setStartX(e.pageX - containerRef.current.offsetLeft);
// "컨테이너 내부에서 200px 위치를 클릭했구나!"

setScrollLeft(containerRef.current.scrollLeft);
// "현재 스크롤 위치는 0px구나! 기억해두자"
```

---

### 3️⃣ handleMouseMove - 드래그 중

```typescript
const handleMouseMove = useCallback(
  (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * scrollSpeed;
    containerRef.current.scrollLeft = scrollLeft - walk;
  },
  [isDragging, startX, scrollLeft, scrollSpeed]
);
```

**핵심 수식:**

```typescript
const x = e.pageX - containerRef.current.offsetLeft;
// 현재 마우스 위치 (컨테이너 기준)

const walk = (x - startX) * scrollSpeed;
// 이동 거리 = (현재 위치 - 시작 위치) × 속도

containerRef.current.scrollLeft = scrollLeft - walk;
// 새 스크롤 위치 = 시작 스크롤 - 이동 거리
```

**시각적 예시:**

```
시작 상태:
[전자기기][의류][도서][기타][생활용품]...
 ↑ 클릭 (startX = 200, scrollLeft = 0)

마우스를 왼쪽으로 50px 이동:
[전자기기][의류][도서][기타][생활용품]...
         ← 50px

계산:
x = 150 (현재 마우스 위치)
walk = (150 - 200) × 2 = -100
scrollLeft = 0 - (-100) = 100

결과:
         [도서][기타][생활용품][문구]...
         ↑ 컨텐츠가 오른쪽으로 밀림 (스크롤 왼쪽으로)
```

**scrollSpeed의 역할:**

```typescript
scrollSpeed = 1   // 마우스 이동과 같은 속도
scrollSpeed = 2   // 마우스 이동의 2배 속도 (기본값)
scrollSpeed = 0.5 // 마우스 이동의 절반 속도

// 예: 마우스를 50px 이동
walk = 50 × 1 = 50   // 스크롤 50px
walk = 50 × 2 = 100  // 스크롤 100px (더 빠름)
walk = 50 × 0.5 = 25 // 스크롤 25px (더 느림)
```

**e.preventDefault()의 역할:**

```typescript
e.preventDefault();
```

이게 없으면:
- 드래그 중 텍스트 선택됨 (파란색 하이라이트)
- 이미지 드래그 시작
- 링크가 끌려다님

이걸 막아서 순수하게 스크롤만 발생하도록 함.

---

### 4️⃣ handleMouseUp & handleMouseLeave - 드래그 종료

```typescript
const handleMouseUp = useCallback(() => {
  setIsDragging(false);
}, []);

const handleMouseLeave = useCallback(() => {
  setIsDragging(false);
}, []);
```

**종료 조건 2가지:**

1. **mouseup**: 마우스 버튼을 뗐을 때
2. **mouseleave**: 마우스가 컨테이너 영역을 벗어났을 때

```
시나리오 1: 정상 종료
[전자기기][의류][도서]
         ↓ 클릭
         → 드래그
         ↑ 버튼 뗌 (mouseup)

시나리오 2: 영역 이탈
[전자기기][의류][도서]
         ↓ 클릭
         → 드래그
               → → → (컨테이너 밖으로)
                     ↑ mouseleave

두 경우 모두 isDragging = false로 드래그 종료
```

---

## 🎯 완전한 드래그 사이클 예시

```typescript
// 초기 상태
isDragging = false
startX = 0
scrollLeft = 0

// 1. 마우스 다운 (pageX = 700, offsetLeft = 500, scrollLeft = 0)
handleMouseDown()
→ isDragging = true
→ startX = 700 - 500 = 200
→ scrollLeft = 0

// 2. 마우스 이동 (pageX = 650)
handleMouseMove()
→ x = 650 - 500 = 150
→ walk = (150 - 200) × 2 = -100
→ scrollLeft = 0 - (-100) = 100
→ 컨테이너.scrollLeft = 100 (스크롤 발생!)

// 3. 마우스 이동 (pageX = 600)
handleMouseMove()
→ x = 600 - 500 = 100
→ walk = (100 - 200) × 2 = -200
→ scrollLeft = 0 - (-200) = 200
→ 컨테이너.scrollLeft = 200 (더 스크롤!)

// 4. 마우스 업
handleMouseUp()
→ isDragging = false
→ 드래그 종료
```

---

## 🔍 실제 화면에서의 움직임

```
컨테이너 내부 (overflow-x-scroll):
┌────────────────┐ ← 보이는 영역 (컨테이너)
│[전자기기][의류]│[도서][기타][생활용품][문구]...
└────────────────┘
scrollLeft = 0

마우스를 왼쪽으로 드래그:
┌────────────────┐
[전자기기][의류][도서][기타]│[생활용품][문구]...
                └────────────────┘
                scrollLeft = 100

더 드래그:
┌────────────────┐
[전자기기][의류][도서][기타][생활용품][문구]│...
                                └────────────────┘
                                scrollLeft = 200
```

---

## 🎨 커서 스타일 변경

```typescript
// CategoryChips.tsx에서
className={`${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
```

```
cursor-grab:      ✋ (손 펼침 - 잡을 수 있음)
cursor-grabbing:  ✊ (손 쥠 - 잡고 있음)
```

사용자에게 "여기를 드래그할 수 있어요!"라는 시각적 피드백 제공.

---

## 💡 핵심 수학 공식 정리

```typescript
// 컨테이너 기준 좌표
x = e.pageX - containerRef.current.offsetLeft

// 이동 거리 (음수 = 왼쪽, 양수 = 오른쪽)
walk = (현재위치 - 시작위치) × 속도

// 스크롤 위치 업데이트 (반대 방향!)
scrollLeft = 시작스크롤 - 이동거리
```

**왜 `-` (빼기)를 쓰나요?**

```
마우스 오른쪽 이동 (+50) → 컨텐츠 왼쪽으로 밀기 (스크롤 +)
마우스 왼쪽 이동 (-50) → 컨텐츠 오른쪽으로 밀기 (스크롤 -)

마우스와 컨텐츠가 반대 방향으로 움직여야 자연스러움!
```

---

## 🚀 성능 최적화: useCallback

```typescript
const handleMouseMove = useCallback(
  (e: React.MouseEvent) => { ... },
  [isDragging, startX, scrollLeft, scrollSpeed]
);
```

**useCallback을 쓰는 이유:**

1. **불필요한 함수 재생성 방지**
   - 의존성이 변경될 때만 새 함수 생성
   - 매 렌더링마다 새 함수 만들지 않음

2. **이벤트 핸들러 최적화**
   - 마우스 이동은 초당 60회 이상 발생 가능
   - 함수 재생성 오버헤드 제거

---

## 📦 전체 코드 (useDragScroll.ts)

```typescript
// lib/hooks/useDragScroll.ts
import { useRef, useState, useCallback } from 'react';

export interface DragScrollOptions {
  scrollSpeed?: number;
}

export function useDragScroll(options: DragScrollOptions = {}) {
  const { scrollSpeed = 2 } = options;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;

    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      e.preventDefault();
      const x = e.pageX - containerRef.current.offsetLeft;
      const walk = (x - startX) * scrollSpeed;
      containerRef.current.scrollLeft = scrollLeft - walk;
    },
    [isDragging, startX, scrollLeft, scrollSpeed]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  return {
    containerRef,
    isDragging,
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave,
    },
  };
}
```

---

## 🎯 사용 예시 (CategoryChips.tsx)

```typescript
export default function CategoryChips({ categories, selectedTags, onTagToggle, onClearAll }) {
  // Hook 호출
  const { containerRef, isDragging, handlers } = useDragScroll();

  return (
    <div
      ref={containerRef}                    // 1. DOM 요소 연결
      {...handlers}                         // 2. 이벤트 핸들러 적용
      className={`
        flex gap-3 overflow-x-auto
        ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}  // 3. 커서 변경
      `}
    >
      {categories.map(tag => (
        <button onClick={() => onTagToggle(tag)}>
          {tag}
        </button>
      ))}
    </div>
  );
}
```

---

## 🎓 핵심 요약

1. **좌표 시스템**: 페이지 좌표를 컨테이너 기준으로 변환
2. **상태 추적**: `isDragging`, `startX`, `scrollLeft`로 드래그 상태 관리
3. **수식**: `scrollLeft = 시작스크롤 - (현재위치 - 시작위치) × 속도`
4. **반대 방향**: 마우스 오른쪽 → 스크롤 왼쪽 (자연스러운 UX)
5. **성능**: useCallback으로 함수 재생성 최소화
6. **UX**: preventDefault로 기본 동작 차단, 커서 변경으로 피드백

**드래그 스크롤 = 마우스 이동 거리를 스크롤 위치로 변환하는 것!**
