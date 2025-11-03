# 게시글 영역 레이아웃 완전 분해

## 📐 전체 구조

```
┌─────────────────────────────────────────┐
│  전체 컨테이너 (min-h-screen)            │
│  ┌───────────────────────────────────┐  │
│  │ Header (sticky)                   │  │ ← 스크롤해도 항상 보임
│  │ CategoryChips (sticky)            │  │ ← 스크롤해도 항상 보임
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ Main (p-6)                        │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │ Grid (gap-6)                │  │  │
│  │  │  [Card] [Card] [Card] [Card]│  │  │
│  │  │  [Card] [Card] [Card] [Card]│  │  │
│  │  │  [Card] [Card] [Card] [Card]│  │  │ ← 스크롤 시 위로 올라감
│  │  │  ...                         │  │  │
│  │  └─────────────────────────────┘  │  │
│  │  [Loading Spinner]                │  │
│  │  [완료 메시지]                     │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## 🎨 1. 전체 컨테이너

### 코드
```typescript
<div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
```

### 속성 분해

| 클래스 | 의미 | CSS | 설명 |
|--------|------|-----|------|
| `min-h-screen` | 최소 높이 100vh | `min-height: 100vh;` | 화면 전체 높이 보장 |
| `bg-gradient-to-b` | 세로 그라디언트 | `background-image: linear-gradient(to bottom, ...)` | 위에서 아래로 색상 변화 |
| `from-sky-50` | 시작 색상 | `--tw-gradient-from: rgb(240, 249, 255);` | 매우 연한 하늘색 |
| `to-white` | 끝 색상 | `--tw-gradient-to: white;` | 흰색 |

### 시각적 결과
```
┌─────────────────┐
│                 │ ← 연한 하늘색 (sky-50)
│                 │
│                 │ ← 점진적 변화
│                 │
│                 │ ← 흰색 (white)
└─────────────────┘
```

### 배경 그라디언트 이유
- 단조로운 흰색보다 시각적으로 부드러움
- 상단(Header)과 하단(게시글)의 자연스러운 구분
- 고급스러운 느낌

---

## 📌 2. Sticky 헤더 (스크롤해도 고정)

### 코드
```typescript
<div className="sticky top-0 z-40">
  <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
  <CategoryChips
    categories={categories}
    selectedTags={selectedTags}
    onTagToggle={toggleTag}
    onClearAll={clearAllTags}
  />
</div>
```

### 속성 분해

| 클래스 | 의미 | CSS | 설명 |
|--------|------|-----|------|
| `sticky` | 고정 위치 | `position: sticky;` | 스크롤 시 고정 |
| `top-0` | 상단에 고정 | `top: 0;` | 화면 맨 위에 고정 |
| `z-40` | 레이어 순서 | `z-index: 40;` | 다른 요소 위에 표시 |

### Sticky 동작 원리

**스크롤 전 (상단에 있을 때):**
```
┌─────────────────────┐
│ Header              │ ← 일반 위치
│ CategoryChips       │
├─────────────────────┤
│ [Card] [Card]       │
│ [Card] [Card]       │
└─────────────────────┘
```

**스크롤 후 (내려갈 때):**
```
┌─────────────────────┐
│ Header              │ ← sticky로 고정됨 (top-0)
│ CategoryChips       │ ← sticky로 고정됨
├─────────────────────┤ ← 여기부터 스크롤
│ [Card] [Card]       │
│ [Card] [Card]       │ ← 카드들이 위로 올라감
│ [Card] [Card]       │
```

### z-index 레이어 순서
```
z-index: 40 (Header/CategoryChips) ← 가장 위
z-index: 10 (Modal 있다면)
z-index: 0  (ItemCard, 일반 요소)
```

---

## 📦 3. Main 영역 (게시글 컨테이너)

### 코드
```typescript
<main className="p-6">
```

### 속성 분해

| 클래스 | 의미 | CSS | 설명 |
|--------|------|-----|------|
| `p-6` | 전체 패딩 24px | `padding: 24px;` | 상하좌우 모두 24px 여백 |

### 시각적 결과
```
┌─────────────────────────────────┐
│  ← 24px →                       │
│     ↑                           │
│   24px                          │
│     ↓                           │
│   [Card] [Card] [Card] [Card]   │ ← 실제 내용
│   [Card] [Card] [Card] [Card]   │
│     ↑                           │
│   24px                          │
│     ↓                           │
│  ← 24px →                       │
└─────────────────────────────────┘
```

### 마진 vs 패딩
```typescript
// 현재: padding 사용
<main className="p-6">

// margin을 사용했다면?
<main className="m-6">  // 외부 여백 (주변 요소와 거리)

// 차이점:
padding: 내부 여백 (컨테이너 안쪽에 공간)
margin: 외부 여백 (컨테이너 바깥쪽에 공간)
```

---

## 🎯 4. Grid 레이아웃 (카드 배치)

### 코드
```typescript
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {items.map((item) => (
    <ItemCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />
  ))}
</div>
```

### 속성 분해

| 클래스 | 의미 | CSS | 설명 |
|--------|------|-----|------|
| `grid` | Grid 레이아웃 | `display: grid;` | CSS Grid 활성화 |
| `grid-cols-1` | 기본 1열 | `grid-template-columns: repeat(1, minmax(0, 1fr));` | 모바일 (1개씩) |
| `sm:grid-cols-2` | 작은 화면 2열 | `@media (min-width: 640px) { ... }` | 태블릿 (2개씩) |
| `lg:grid-cols-3` | 큰 화면 3열 | `@media (min-width: 1024px) { ... }` | 노트북 (3개씩) |
| `xl:grid-cols-4` | 초대형 화면 4열 | `@media (min-width: 1280px) { ... }` | 데스크톱 (4개씩) |
| `gap-6` | 카드 간격 24px | `gap: 24px;` | 가로/세로 24px 간격 |

### 반응형 디자인 동작

**모바일 (< 640px):**
```
[Card 1]
[Card 2]
[Card 3]
[Card 4]
```

**태블릿 (640px ~ 1023px):**
```
[Card 1] [Card 2]
[Card 3] [Card 4]
[Card 5] [Card 6]
```

**노트북 (1024px ~ 1279px):**
```
[Card 1] [Card 2] [Card 3]
[Card 4] [Card 5] [Card 6]
```

**데스크톱 (≥ 1280px):**
```
[Card 1] [Card 2] [Card 3] [Card 4]
[Card 5] [Card 6] [Card 7] [Card 8]
```

### Gap (간격) 시각화
```
[Card]  ←24px→  [Card]  ←24px→  [Card]
  ↕ 24px
[Card]  ←24px→  [Card]  ←24px→  [Card]
  ↕ 24px
[Card]  ←24px→  [Card]  ←24px→  [Card]
```

---

## 🎴 5. ItemCard (개별 카드)

### 코드
```typescript
<div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer">
  <div className="h-48 bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center">
    {/* 이미지 또는 아이콘 */}
  </div>
  <div className="p-4 bg-white">
    {/* 태그, 위치, 날짜 */}
  </div>
</div>
```

### 외부 컨테이너 속성

| 클래스 | 의미 | CSS | 설명 |
|--------|------|-----|------|
| `bg-white` | 흰색 배경 | `background-color: white;` | 카드 배경 |
| `rounded-2xl` | 둥근 모서리 16px | `border-radius: 16px;` | 부드러운 모서리 |
| `overflow-hidden` | 넘치는 부분 숨김 | `overflow: hidden;` | 둥근 모서리 유지 |
| `shadow-md` | 중간 그림자 | `box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1)...` | 입체감 |
| `hover:shadow-xl` | 호버 시 큰 그림자 | 마우스 올리면 그림자 증가 | 인터랙션 피드백 |
| `transition-shadow` | 그림자 전환 | `transition-property: box-shadow;` | 부드러운 애니메이션 |
| `cursor-pointer` | 포인터 커서 | `cursor: pointer;` | 클릭 가능 표시 |

### 이미지 영역 (상단)

| 클래스 | 의미 | CSS | 설명 |
|--------|------|-----|------|
| `h-48` | 높이 192px | `height: 192px;` | 고정 높이 |
| `bg-gradient-to-br` | 대각선 그라디언트 | `background-image: linear-gradient(to bottom right, ...)` | 왼쪽 위 → 오른쪽 아래 |
| `from-sky-100` | 시작 색상 | 연한 하늘색 | 이미지 없을 때 배경 |
| `to-sky-200` | 끝 색상 | 조금 더 진한 하늘색 | |
| `flex items-center justify-center` | 중앙 정렬 | 아이콘 중앙 배치 | |

### 텍스트 영역 (하단)

| 클래스 | 의미 | CSS | 설명 |
|--------|------|-----|------|
| `p-4` | 패딩 16px | `padding: 16px;` | 텍스트 주변 여백 |
| `bg-white` | 흰색 배경 | 명시적 배경색 | |

### 카드 구조 시각화
```
┌──────────────────────────┐
│                          │
│        이미지 영역        │ ← h-48 (192px)
│    (그라디언트 배경)      │
│                          │
├──────────────────────────┤
│  [태그]                  │
│  📍 위치                 │ ← p-4 (16px padding)
│  📅 날짜                 │
└──────────────────────────┘
   ↑                     ↑
 shadow-md          hover:shadow-xl
```

---

## 🎬 6. 스크롤 동작 상세 설명

### Q1: 최상단에 요소를 넣으면 스크롤 시 안 보이나?

**A: 위치에 따라 다릅니다!**

#### Case 1: Sticky 내부에 넣으면 → 계속 보임 ✅
```typescript
<div className="sticky top-0 z-40">
  <Header />
  <CategoryChips />
  <div className="bg-yellow-100 p-2">
    🎉 이벤트 배너
  </div>  {/* ← 여기에 넣으면 스크롤해도 보임 */}
</div>
```

#### Case 2: Main 내부에 넣으면 → 스크롤 시 안 보임 ❌
```typescript
<main className="p-6">
  <div className="bg-yellow-100 p-2 mb-4">
    🎉 이벤트 배너
  </div>  {/* ← 여기에 넣으면 스크롤 시 올라가서 안 보임 */}

  <div className="grid ...">
    {/* 카드들 */}
  </div>
</main>
```

---

## 📌 7. 스크롤 상관없이 계속 보이게 하는 방법

### 방법 1: Sticky 사용 (현재 Header/Chips)
```typescript
<div className="sticky top-0 z-40">
  <div>계속 보이는 내용</div>
</div>
```

**특징:**
- 스크롤 전에는 일반 위치
- 스크롤 시 지정된 위치(`top-0`)에 고정
- 페이지 레이아웃에 영향을 줌

### 방법 2: Fixed 사용 (완전 고정)
```typescript
<div className="fixed top-0 left-0 right-0 z-50">
  <div>완전히 고정된 내용</div>
</div>
```

**특징:**
- 처음부터 완전히 고정
- 페이지 레이아웃에서 제외됨 (공간 차지 안 함)
- 다른 컨텐츠 위에 떠 있음

**Sticky vs Fixed 비교:**
```
Sticky:
┌────────────────┐
│ [Sticky 요소]  │ ← 여기 있다가...
├────────────────┤
│ 내용           │
│ 내용           │ ← 스크롤 시 위로 올라가다가
└────────────────┘    상단에 도달하면 고정

Fixed:
┌────────────────┐
│ [Fixed 요소]   │ ← 처음부터 여기 고정
│                │    (공간 차지 안 함)
├────────────────┤
│ 내용           │ ← 이 뒤에서 스크롤
│ 내용           │
└────────────────┘
```

### 방법 3: 상단/하단 고정 배너
```typescript
// 상단 고정 배너
<div className="fixed top-20 left-0 right-0 z-30 bg-yellow-100 p-2 text-center">
  🎄 크리스마스 이벤트 진행중!
</div>

// 하단 고정 배너
<div className="fixed bottom-0 left-0 right-0 z-30 bg-red-500 text-white p-4 text-center">
  📢 중요 공지사항
</div>
```

**시각화:**
```
┌─────────────────────────┐
│ Header (sticky top-0)   │ ← z-40
├─────────────────────────┤
│ 🎄 이벤트 (fixed top-20)│ ← z-30 (Header 아래)
├─────────────────────────┤
│                         │
│   스크롤 가능한 영역     │
│   [Card] [Card]         │
│   [Card] [Card]         │
│                         │
├─────────────────────────┤
│ 📢 공지 (fixed bottom-0)│ ← z-30
└─────────────────────────┘
```

---

## 🎨 8. 스크롤 중간에 장식 UI 추가하기

### 방법 1: Grid 사이에 광고/이벤트 삽입
```typescript
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {items.map((item, index) => (
    <>
      <ItemCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />

      {/* 4번째마다 이벤트 배너 삽입 */}
      {(index + 1) % 4 === 0 && (
        <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 bg-gradient-to-r from-red-100 to-green-100 rounded-2xl p-6 text-center">
          🎄 크리스마스 특별 이벤트! 🎅
        </div>
      )}
    </>
  ))}
</div>
```

**결과:**
```
[Card 1] [Card 2] [Card 3] [Card 4]
┌─────────────────────────────────┐
│ 🎄 크리스마스 이벤트! 🎅        │ ← 4개마다 삽입
└─────────────────────────────────┘
[Card 5] [Card 6] [Card 7] [Card 8]
┌─────────────────────────────────┐
│ 🎄 크리스마스 이벤트! 🎅        │
└─────────────────────────────────┘
```

### col-span 설명
```typescript
className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4"
```

| 화면 크기 | Grid 열 수 | col-span | 결과 |
|----------|-----------|----------|------|
| 모바일 | 1열 | col-span-1 | 1칸 차지 (전체) |
| 태블릿 | 2열 | col-span-2 | 2칸 차지 (전체) |
| 노트북 | 3열 | col-span-3 | 3칸 차지 (전체) |
| 데스크톱 | 4열 | col-span-4 | 4칸 차지 (전체) |

### 방법 2: 절대 위치로 떠다니는 장식
```typescript
// page.tsx에 추가
<div className="relative">
  {/* 떠다니는 눈송이 */}
  <div className="fixed top-1/4 right-10 z-20 animate-bounce text-4xl">
    ❄️
  </div>

  <div className="fixed top-1/2 left-10 z-20 animate-pulse text-4xl">
    🎅
  </div>

  {/* 기존 main */}
  <main className="p-6">
    ...
  </main>
</div>
```

**시각화:**
```
┌─────────────────────────────┐
│                          ❄️ │ ← fixed, animate-bounce
│                             │
│   [Card] [Card] [Card]      │
│                             │
│ 🎅                          │ ← fixed, animate-pulse
│   [Card] [Card] [Card]      │
│                             │
└─────────────────────────────┘
```

### 방법 3: 스크롤 위치에 따른 조건부 렌더링
```typescript
export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* 스크롤 500px 이상 내리면 표시 */}
      {scrollY > 500 && (
        <div className="fixed bottom-10 right-10 z-50 bg-red-500 text-white p-4 rounded-full shadow-xl animate-bounce">
          🎁 특별 선물!
        </div>
      )}

      {/* 기존 내용 */}
      ...
    </div>
  );
}
```

### 방법 4: 특정 카드 강조
```typescript
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {items.map((item, index) => (
    <div key={item.id} className="relative">
      <ItemCard item={item} onClick={() => setSelectedItem(item)} />

      {/* 홀수 번째 카드에 이벤트 뱃지 */}
      {index % 2 === 1 && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          HOT 🔥
        </div>
      )}
    </div>
  ))}
</div>
```

**결과:**
```
┌──────────┐  ┌──────────┐
│ Card 1   │  │ Card 2   │🔥HOT
└──────────┘  └──────────┘

┌──────────┐  ┌──────────┐
│ Card 3   │  │ Card 4   │🔥HOT
└──────────┘  └──────────┘
```

---

## 🎯 실전 예제: 크리스마스 이벤트 UI

### 완성 코드
```typescript
export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* 헤더 (sticky) */}
      <div className="sticky top-0 z-40">
        <Header />
        <CategoryChips />

        {/* 크리스마스 배너 (sticky 내부 - 항상 보임) */}
        <div className="bg-gradient-to-r from-red-500 to-green-500 text-white text-center py-2 text-sm font-bold">
          🎄 12월 특별 이벤트! 분실물 찾으면 선물 증정! 🎅
        </div>
      </div>

      {/* 떠다니는 눈송이 */}
      <div className="fixed top-20 right-10 z-20 animate-bounce text-4xl opacity-50">
        ❄️
      </div>
      <div className="fixed top-40 left-10 z-20 animate-pulse text-4xl opacity-50">
        ⛄
      </div>

      {/* 메인 영역 */}
      <main className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <>
              <ItemCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />

              {/* 8번째마다 이벤트 카드 삽입 */}
              {(index + 1) % 8 === 0 && (
                <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4">
                  <div className="bg-gradient-to-r from-red-100 via-yellow-100 to-green-100 rounded-2xl p-8 text-center shadow-xl">
                    <div className="text-4xl mb-2">🎁</div>
                    <h3 className="text-2xl font-bold mb-2">크리스마스 특별 이벤트</h3>
                    <p className="text-gray-600">12월 말까지 분실물을 찾아드립니다!</p>
                  </div>
                </div>
              )}
            </>
          ))}
        </div>

        {/* 로딩/완료 메시지 */}
        <div ref={observerTarget} className="h-20">
          {loading && <LoadingSpinner />}
        </div>
      </main>

      {/* 스크롤 다운 시 하단 고정 버튼 */}
      {scrollY > 300 && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-10 right-10 z-50 bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-2xl transition-all"
        >
          ⬆️ 맨 위로
        </button>
      )}
    </div>
  );
}
```

---

## 📊 레이아웃 속성 정리표

### 여백 (Spacing)

| 속성 | 값 | px | 용도 |
|------|----|----|------|
| `p-4` | 1rem | 16px | 작은 패딩 (카드 내부) |
| `p-6` | 1.5rem | 24px | 중간 패딩 (main) |
| `gap-6` | 1.5rem | 24px | Grid 간격 |
| `py-2` | 0.5rem | 8px | 세로 패딩 (배너) |
| `mb-4` | 1rem | 16px | 하단 마진 |

### 색상 (Colors)

| 클래스 | RGB | 용도 |
|--------|-----|------|
| `bg-white` | #FFFFFF | 카드 배경 |
| `from-sky-50` | rgb(240, 249, 255) | 연한 하늘색 |
| `from-sky-100` | rgb(224, 242, 254) | 하늘색 |
| `to-sky-200` | rgb(186, 230, 253) | 진한 하늘색 |
| `text-gray-600` | rgb(75, 85, 99) | 회색 텍스트 |

### 위치 (Position)

| 클래스 | CSS | 용도 |
|--------|-----|------|
| `sticky` | position: sticky | 스크롤 시 고정 |
| `fixed` | position: fixed | 완전 고정 |
| `relative` | position: relative | 상대 위치 |
| `absolute` | position: absolute | 절대 위치 |

### Z-Index (레이어 순서)

| z-index | 요소 |
|---------|------|
| 50 | 모달, 최상위 UI |
| 40 | Sticky Header |
| 30 | 고정 배너 |
| 20 | 떠다니는 장식 |
| 10 | 일반 오버레이 |
| 0 | 일반 요소 |

---

## 🎓 핵심 요약

### 1. 전체 레이아웃
- `min-h-screen`: 전체 화면 높이
- `bg-gradient`: 연한 하늘색 → 흰색 그라디언트
- `p-6`: Main 영역 24px 패딩

### 2. Sticky Header
- `sticky top-0 z-40`: 스크롤해도 상단 고정
- Header + CategoryChips 포함

### 3. Grid 레이아웃
- 반응형: 1열 → 2열 → 3열 → 4열
- `gap-6`: 카드 간 24px 간격

### 4. 스크롤 고정 방법
- **Sticky**: 스크롤 시 고정 (레이아웃 영향 O)
- **Fixed**: 항상 고정 (레이아웃 영향 X)

### 5. 중간 UI 삽입
- Grid 내부 삽입: `col-span-full`
- Fixed 오버레이: `fixed + z-index`
- 조건부 렌더링: `scrollY` 추적

**게시글 영역은 깔끔한 Grid + 반응형 + Sticky Header로 구성되어 있습니다!**
