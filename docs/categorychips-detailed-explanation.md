# CategoryChips 컴포넌트 완전 분해 설명

## 📁 파일 위치
`src/components/CategoryChips.tsx`

---

## 📋 전체 코드

```typescript
// components/CategoryChips.tsx
'use client';

import { X } from 'lucide-react';
import { useDragScroll } from '@/lib/hooks/useDragScroll';

interface CategoryChipsProps {
  categories: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClearAll: () => void;
}

export default function CategoryChips({
  categories,
  selectedTags,
  onTagToggle,
  onClearAll,
}: CategoryChipsProps) {
  const { containerRef, isDragging, handlers } = useDragScroll();

  return (
    <div className="bg-white border-b border-sky-100 px-6 py-4">
      <div
        ref={containerRef}
        className={`flex gap-3 overflow-x-auto scrollbar-hide ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        {...handlers}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* 전체 해제 버튼 */}
        <button
          onClick={onClearAll}
          disabled={selectedTags.length === 0}
          className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            selectedTags.length > 0
              ? 'bg-red-500 text-white hover:bg-red-600 cursor-pointer'
              : 'bg-gray-200 text-gray-600 opacity-50'
          }`}
        >
          <X className="w-4 h-4" />
        </button>

        {/* 카테고리 버튼들 */}
        {categories.map((tag) => (
          <button
            key={tag}
            onClick={() => onTagToggle(tag)}
            className={`flex-shrink-0 px-5 py-2 rounded-full transition-all ${
              selectedTags.includes(tag)
                ? 'bg-sky-600 text-white hover:bg-sky-700'
                : 'bg-sky-100 text-sky-700 hover:bg-sky-200'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
```

---

## 🎯 1. 파일 최상단 설정

### 'use client'

```typescript
'use client';
```

**의미:**
- Next.js 13+ App Router에서 사용하는 지시어
- "이 컴포넌트는 클라이언트에서 실행됩니다"라는 선언
- 없으면 서버에서만 실행되어 `useState`, `onClick` 같은 인터랙티브 기능 사용 불가

**왜 필요한가?**
```typescript
// 이 컴포넌트는:
// - 드래그 스크롤 (마우스 이벤트)
// - 버튼 클릭 (onClick)
// → 클라이언트 환경에서만 동작하므로 'use client' 필수!
```

### import 문

```typescript
import { X } from 'lucide-react';
import { useDragScroll } from '@/lib/hooks/useDragScroll';
```

**lucide-react:**
- 아이콘 라이브러리
- `X`는 ❌ 모양 아이콘
- 다른 예: `Search`, `Menu`, `ChevronDown` 등

**useDragScroll:**
- 우리가 만든 커스텀 Hook
- 드래그로 스크롤하는 기능 제공

---

## 🎯 2. Props (속성) 정의

```typescript
interface CategoryChipsProps {
  categories: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClearAll: () => void;
}
```

**interface란?**
- TypeScript의 타입 정의
- "이 컴포넌트는 이런 데이터를 받습니다"라는 계약서

**각 prop 설명:**

### categories: string[]

```typescript
categories: string[]
```

- **의미**: 표시할 카테고리 목록 (배열)
- **예시**: `['시계', '지갑', '카드', '인형', '가방', '우산', '열쇠', '핸드폰']`
- **`string[]`**: 문자열 배열 타입

### selectedTags: string[]

```typescript
selectedTags: string[]
```

- **의미**: 현재 선택된 태그들
- **예시**: `['지갑', '카드']` (사용자가 이 두 개를 선택함)
- **비어있음**: `[]` (아무것도 선택 안 함)

### onTagToggle: (tag: string) => void

```typescript
onTagToggle: (tag: string) => void
```

- **의미**: 태그 클릭 시 실행할 함수
- **`(tag: string)`**: "어떤 태그를 클릭했는지" 전달받음
- **`=> void`**: 반환값 없음 (그냥 동작만 함)
- **사용 예시**:
```typescript
// 부모 컴포넌트에서 전달
<CategoryChips onTagToggle={(tag) => console.log('클릭:', tag)} />

// '지갑' 클릭 시: console.log('클릭:', '지갑')
```

### onClearAll: () => void

```typescript
onClearAll: () => void
```

- **의미**: 전체 해제 버튼 클릭 시 실행할 함수
- **`()`**: 매개변수 없음
- **`=> void`**: 반환값 없음

---

## 🎯 3. 컴포넌트 함수 선언

```typescript
export default function CategoryChips({
  categories,
  selectedTags,
  onTagToggle,
  onClearAll,
}: CategoryChipsProps) {
```

**분해해서 이해하기:**

```typescript
export default function CategoryChips(...)
```
- `export default`: 이 파일의 기본 내보내기 (다른 파일에서 import 가능)
- `function`: 함수 선언
- `CategoryChips`: 함수 이름 (컴포넌트 이름)

```typescript
{
  categories,
  selectedTags,
  onTagToggle,
  onClearAll,
}: CategoryChipsProps
```
- **구조 분해 할당 (Destructuring)**
- props 객체에서 필요한 속성만 꺼내기

**같은 의미:**
```typescript
// 방법 1 (현재 코드 - 구조 분해)
function CategoryChips({ categories, selectedTags, ... }) { }

// 방법 2 (구조 분해 안 함)
function CategoryChips(props) {
  const categories = props.categories;
  const selectedTags = props.selectedTags;
  // ...
}
```

---

## 🎯 4. 드래그 스크롤 Hook 사용

```typescript
const { containerRef, isDragging, handlers } = useDragScroll();
```

**useDragScroll()가 반환하는 것:**
- `containerRef`: DOM 요소를 가리킬 ref
- `isDragging`: 현재 드래그 중인지 (true/false)
- `handlers`: 마우스 이벤트 핸들러 모음

**구조 분해 할당으로 받기:**
```typescript
const result = useDragScroll();
// result = { containerRef: ..., isDragging: ..., handlers: ... }

// 구조 분해로 각각 변수에 할당
const { containerRef, isDragging, handlers } = result;
```

---

## 🎯 5. 외부 컨테이너 (흰색 배경)

```typescript
<div className="bg-white border-b border-sky-100 px-6 py-4">
```

**Tailwind CSS 클래스 하나씩 분해:**

| 클래스 | 의미 | CSS 코드 |
|--------|------|----------|
| `bg-white` | 배경색 흰색 | `background-color: white;` |
| `border-b` | 아래쪽 테두리 | `border-bottom-width: 1px;` |
| `border-sky-100` | 테두리 색상 (연한 하늘색) | `border-color: rgb(224, 242, 254);` |
| `px-6` | 좌우 패딩 24px | `padding-left: 24px; padding-right: 24px;` |
| `py-4` | 위아래 패딩 16px | `padding-top: 16px; padding-bottom: 16px;` |

**시각적 결과:**
```
┌───────────────────────────────────┐
│  ← 24px →                 ← 24px →│
│     ↑                              │
│   16px                             │
│     ↓                              │
│   [전체 해제] [전자기기] [의류]...│ ← 내부 칩스들
│     ↑                              │
│   16px                             │
│     ↓                              │
└───────────────────────────────────┘
     ↑ 아래쪽 연한 하늘색 선
```

---

## 🎯 6. 스크롤 컨테이너 (칩스를 담는 영역)

```typescript
<div
  ref={containerRef}
  className={`flex gap-3 overflow-x-auto scrollbar-hide ${
    isDragging ? 'cursor-grabbing' : 'cursor-grab'
  }`}
  {...handlers}
  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
>
```

### ref={containerRef}

```typescript
ref={containerRef}
```

**의미:**
- 이 `<div>` 요소를 `containerRef`로 참조
- useDragScroll에서 이 요소의 스크롤을 제어하기 위함

**동작:**
```typescript
// useDragScroll 내부에서:
containerRef.current.scrollLeft = 100;  // 스크롤 위치 변경
```

### className (기본 스타일)

```typescript
className={`flex gap-3 overflow-x-auto scrollbar-hide ${...}`}
```

**백틱 `` ` `` 사용 이유:**
- 템플릿 리터럴 (Template Literal)
- 문자열 안에 변수나 표현식 삽입 가능
- `${}` 안에 JavaScript 코드 실행

| 클래스 | 의미 | CSS 코드 |
|--------|------|----------|
| `flex` | Flexbox 레이아웃 | `display: flex;` |
| `gap-3` | 자식 요소 간격 12px | `gap: 12px;` |
| `overflow-x-auto` | 가로 스크롤 허용 | `overflow-x: auto;` |
| `scrollbar-hide` | 스크롤바 숨김 (커스텀 클래스) | 스크롤바 안 보임 |

**Flexbox 동작:**
```
flex: 자식 요소들을 가로로 배치
gap-3: 각 요소 사이 12px 간격

[X] ←12px→ [전자기기] ←12px→ [의류] ←12px→ [도서]
```

### className (조건부 스타일)

```typescript
${
  isDragging ? 'cursor-grabbing' : 'cursor-grab'
}
```

**삼항 연산자 (Ternary Operator):**
```typescript
조건 ? 참일때값 : 거짓일때값
```

**동작:**
```typescript
// isDragging = false (드래그 안 함)
→ 'cursor-grab' 적용 → 커서: ✋ (손 펼침)

// isDragging = true (드래그 중)
→ 'cursor-grabbing' 적용 → 커서: ✊ (손 쥠)
```

### {...handlers}

```typescript
{...handlers}
```

**스프레드 연산자 (Spread Operator):**
- `handlers` 객체의 모든 속성을 펼쳐서 전달

**실제 동작:**
```typescript
// handlers = {
//   onMouseDown: handleMouseDown,
//   onMouseMove: handleMouseMove,
//   onMouseUp: handleMouseUp,
//   onMouseLeave: handleMouseLeave
// }

// {...handlers}는 다음과 같음:
<div
  onMouseDown={handleMouseDown}
  onMouseMove={handleMouseMove}
  onMouseUp={handleMouseUp}
  onMouseLeave={handleMouseLeave}
>
```

### style 속성

```typescript
style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
```

**인라인 스타일 (CSS):**
- `scrollbarWidth: 'none'`: Firefox 스크롤바 숨김
- `msOverflowStyle: 'none'`: IE/Edge 스크롤바 숨김

**이중 중괄호 `{{ }}` 이유:**
```typescript
style={...}           // JSX 표현식 (바깥 중괄호)
style={{ ... }}       // JavaScript 객체 (안쪽 중괄호)
```

---

## 🎯 7. X 버튼 (전체 해제)

```typescript
<button
  onClick={onClearAll}
  disabled={selectedTags.length === 0}
  className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
    selectedTags.length > 0
      ? 'bg-red-500 text-white hover:bg-red-600 cursor-pointer'
      : 'bg-gray-200 text-gray-600 opacity-50'
  }`}
>
  <X className="w-4 h-4" />
</button>
```

### onClick={onClearAll}

```typescript
onClick={onClearAll}
```

**의미:**
- 버튼 클릭 시 `onClearAll` 함수 실행
- 부모 컴포넌트(page.tsx)에서 전달받은 함수

### disabled 속성

```typescript
disabled={selectedTags.length === 0}
```

**조건:**
- `selectedTags.length === 0`: 선택된 태그가 0개
- `true`면 버튼 비활성화 (클릭 안 됨)
- `false`면 버튼 활성화

**예시:**
```typescript
selectedTags = []              → disabled={true}  (비활성)
selectedTags = ['지갑']        → disabled={false} (활성)
selectedTags = ['지갑', '카드'] → disabled={false} (활성)
```

### className (고정 스타일)

```typescript
className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all ...`}
```

| 클래스 | 의미 | 설명 |
|--------|------|------|
| `flex-shrink-0` | 크기 고정 | 부모가 좁아져도 축소 안 됨 |
| `w-9` | 너비 36px | `width: 36px;` |
| `h-9` | 높이 36px | `height: 36px;` |
| `rounded-full` | 완전한 원형 | `border-radius: 9999px;` |
| `flex` | Flexbox | 내부 X 아이콘 배치용 |
| `items-center` | 세로 중앙 정렬 | X 아이콘 세로 중앙 |
| `justify-center` | 가로 중앙 정렬 | X 아이콘 가로 중앙 |
| `transition-all` | 모든 변화 애니메이션 | 0.15초 부드러운 전환 |

**시각적 결과:**
```
┌─────────┐
│    ❌    │  ← 36px × 36px 원형
│         │  ← X 아이콘이 정중앙
└─────────┘
```

### className (조건부 스타일)

```typescript
${
  selectedTags.length > 0
    ? 'bg-red-500 text-white hover:bg-red-600 cursor-pointer'
    : 'bg-gray-200 text-gray-600 opacity-50'
}
```

**조건: selectedTags.length > 0**

#### 선택된 태그 있음 (활성 상태):
```typescript
'bg-red-500 text-white hover:bg-red-600 cursor-pointer'
```

| 클래스 | 의미 |
|--------|------|
| `bg-red-500` | 배경 빨간색 |
| `text-white` | 글자 흰색 |
| `hover:bg-red-600` | 마우스 올리면 더 진한 빨간색 |
| `cursor-pointer` | 커서: 손가락 모양 |

**시각적:**
```
일반 상태:  🔴 (빨간 원)
호버 상태:  🔴 (더 진한 빨간 원)
```

#### 선택된 태그 없음 (비활성 상태):
```typescript
'bg-gray-200 text-gray-600 opacity-50'
```

| 클래스 | 의미 |
|--------|------|
| `bg-gray-200` | 배경 연한 회색 |
| `text-gray-600` | 글자 회색 |
| `opacity-50` | 투명도 50% (흐릿함) |

**시각적:**
```
⚪ (흐릿한 회색 원, 클릭 안 됨)
```

### X 아이콘

```typescript
<X className="w-4 h-4" />
```

- `X`: lucide-react의 X 아이콘
- `w-4`: 너비 16px
- `h-4`: 높이 16px

---

## 🎯 8. 카테고리 버튼들

```typescript
{categories.map((tag) => (
  <button
    key={tag}
    onClick={() => onTagToggle(tag)}
    className={`flex-shrink-0 px-5 py-2 rounded-full transition-all ${
      selectedTags.includes(tag)
        ? 'bg-sky-600 text-white hover:bg-sky-700'
        : 'bg-sky-100 text-sky-700 hover:bg-sky-200'
    }`}
  >
    {tag}
  </button>
))}
```

### categories.map()

```typescript
{categories.map((tag) => ( ... ))}
```

**의미:**
- 배열의 각 요소를 순회하며 JSX 생성
- `categories = ['시계', '지갑', '카드']`이면 3개 버튼 생성

**동작 과정:**
```typescript
categories = ['시계', '지갑', '카드'];

// 1번째 순회: tag = '시계'
<button key="시계">시계</button>

// 2번째 순회: tag = '지갑'
<button key="지갑">지갑</button>

// 3번째 순회: tag = '카드'
<button key="카드">카드</button>
```

### key={tag}

```typescript
key={tag}
```

**의미:**
- React가 각 요소를 구별하기 위한 고유 식별자
- 리렌더링 최적화에 필수
- 반복문(map)에서 `key`는 필수!

**왜 필요한가?**
```typescript
// key 없으면:
// React: "버튼이 8개 있는데... 어떤 게 어떤 건지 모르겠어!"
// → 전부 다시 렌더링 (느림)

// key 있으면:
// React: "'지갑' 버튼만 바뀌었네? 이것만 업데이트!"
// → 변경된 것만 렌더링 (빠름)
```

### onClick 이벤트

```typescript
onClick={() => onTagToggle(tag)}
```

**화살표 함수를 쓰는 이유:**

```typescript
// ❌ 이렇게 하면 안 됨:
onClick={onTagToggle(tag)}
// → 즉시 실행됨! (렌더링 시점에 실행)

// ✅ 화살표 함수로 감싸기:
onClick={() => onTagToggle(tag)}
// → 클릭할 때만 실행 (올바름)
```

**동작 과정:**
```typescript
// '지갑' 버튼의 경우:
tag = '지갑'
onClick={() => onTagToggle('지갑')}

// 사용자가 '지갑' 버튼 클릭
// → onTagToggle('지갑') 실행
// → 부모 컴포넌트에서 '지갑' 태그 토글 처리
```

### className (고정 스타일)

```typescript
className={`flex-shrink-0 px-5 py-2 rounded-full transition-all ...`}
```

| 클래스 | 의미 | 설명 |
|--------|------|------|
| `flex-shrink-0` | 크기 고정 | 버튼이 줄어들지 않음 |
| `px-5` | 좌우 패딩 20px | 텍스트 좌우 여백 |
| `py-2` | 위아래 패딩 8px | 텍스트 상하 여백 |
| `rounded-full` | 완전한 둥근 모서리 | 알약 모양 |
| `transition-all` | 모든 변화 애니메이션 | 색상 변경 부드럽게 |

**시각적:**
```
┌──────────┐
│   지갑   │  ← rounded-full로 둥근 모서리
└──────────┘
   ↑    ↑
 px-5  px-5
```

### className (조건부 스타일)

```typescript
${
  selectedTags.includes(tag)
    ? 'bg-sky-600 text-white hover:bg-sky-700'
    : 'bg-sky-100 text-sky-700 hover:bg-sky-200'
}
```

**조건: selectedTags.includes(tag)**
- `includes()`: 배열에 특정 값이 있는지 확인
- `true`: 선택됨
- `false`: 선택 안 됨

**예시:**
```typescript
selectedTags = ['지갑', '카드']

'지갑'.includes(['지갑', '카드'])  → true  (선택됨)
'의류'.includes(['지갑', '카드'])  → false (선택 안 됨)
```

#### 선택됨 (true):
```typescript
'bg-sky-600 text-white hover:bg-sky-700'
```

| 클래스 | 의미 |
|--------|------|
| `bg-sky-600` | 배경 진한 하늘색 |
| `text-white` | 글자 흰색 |
| `hover:bg-sky-700` | 호버 시 더 진한 하늘색 |

**시각적:**
```
일반: [  지갑  ]  ← 진한 하늘색 배경, 흰 글자
호버: [  지갑  ]  ← 더 진한 하늘색
```

#### 선택 안 됨 (false):
```typescript
'bg-sky-100 text-sky-700 hover:bg-sky-200'
```

| 클래스 | 의미 |
|--------|------|
| `bg-sky-100` | 배경 연한 하늘색 (회색 섞임) |
| `text-sky-700` | 글자 진한 하늘색 |
| `hover:bg-sky-200` | 호버 시 조금 더 진한 연한 하늘색 |

**시각적:**
```
일반: [  의류  ]  ← 연한 하늘색 배경, 진한 하늘색 글자
호버: [  의류  ]  ← 조금 더 진한 연한 하늘색
```

### 버튼 텍스트

```typescript
{tag}
```

- 중괄호 `{}`는 JavaScript 표현식 삽입
- `tag` 변수의 값을 표시
- 예: `tag = '지갑'` → 화면에 "지갑" 표시

---

## 🎨 전체 스타일 정리

### 색상 팔레트

```
X 버튼:
- 활성: bg-red-500 (빨간색)
- 호버: bg-red-600 (더 진한 빨간색)
- 비활성: bg-gray-200 (회색, opacity-50)

태그 버튼 (선택 안 됨):
- 배경: bg-sky-100 (연한 하늘색, 회색 섞임)
- 글자: text-sky-700 (진한 하늘색)
- 호버: bg-sky-200 (조금 더 진한)

태그 버튼 (선택됨):
- 배경: bg-sky-600 (진한 하늘색)
- 글자: text-white (흰색)
- 호버: bg-sky-700 (더 진한 하늘색)
```

### 크기와 간격

```
외부 컨테이너:
- 좌우 패딩: px-6 (24px)
- 상하 패딩: py-4 (16px)

X 버튼:
- 크기: w-9 h-9 (36px × 36px)
- 아이콘: 16px × 16px

태그 버튼:
- 좌우 패딩: px-5 (20px)
- 상하 패딩: py-2 (8px)

버튼 간 간격:
- gap-3 (12px)
```

### 애니메이션

```typescript
transition-all
```
- 모든 CSS 속성 변화를 0.15초 동안 부드럽게 전환
- 배경색, 텍스트색 변경이 자연스러움

---

## 🔄 전체 동작 흐름

```
1. 사용자가 '지갑' 버튼 클릭
   ↓
2. onClick={() => onTagToggle('지갑')} 실행
   ↓
3. 부모 컴포넌트(page.tsx)의 toggleTag('지갑') 호출
   ↓
4. selectedTags 상태 업데이트
   - 없었으면: ['지갑'] 추가
   - 있었으면: [] 제거
   ↓
5. CategoryChips 리렌더링
   ↓
6. selectedTags.includes('지갑') 조건 재평가
   ↓
7. 버튼 스타일 변경
   - true: 진한 하늘색 배경 + 흰 글자
   - false: 연한 하늘색 배경 + 진한 글자
```

---

## 🎯 핵심 개념 요약

### 1. Props로 데이터 전달
```typescript
<CategoryChips
  categories={['시계', '지갑', ...]}
  selectedTags={['지갑']}
  onTagToggle={toggleTag}
  onClearAll={clearAllTags}
/>
```

### 2. 조건부 렌더링
```typescript
{조건 ? '참일때' : '거짓일때'}
```

### 3. 배열 순회
```typescript
{배열.map((항목) => <JSX>항목</JSX>)}
```

### 4. 이벤트 핸들링
```typescript
onClick={() => 함수(인자)}
```

### 5. Tailwind CSS
- 클래스 이름으로 스타일 적용
- `bg-`, `text-`, `px-`, `py-` 등

### 6. 드래그 스크롤
- `ref`로 DOM 접근
- `{...handlers}`로 이벤트 핸들러 적용
- `isDragging`으로 커서 변경

---

## 📚 관련 문서

- **드래그 스크롤 상세 설명**: `docs/drag-scroll-explanation.md`
- **useDragScroll Hook**: `src/lib/hooks/useDragScroll.ts`
- **Tailwind CSS 문서**: https://tailwindcss.com/docs

모든 개념을 기초부터 설명했습니다! 추가로 궁금한 부분이 있으면 알려주세요.
