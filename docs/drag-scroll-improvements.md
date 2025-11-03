# 드래그 스크롤 개선 사항

## 🎯 해결한 문제

### 1. 버튼 위에서 드래그가 안 되는 문제
**문제:** 칩스 버튼 위에서는 드래그가 작동하지 않고 클릭만 됨

**원인:** 버튼의 `onClick` 이벤트가 우선권을 가져서 드래그 이벤트가 차단됨

**해결:**
- 드래그와 클릭을 구분하는 로직 추가
- 5px 이상 이동하면 드래그로 인식
- 5px 미만 이동은 클릭으로 처리

### 2. 텍스트 선택 문제
**문제:** 드래그 중 텍스트가 선택되어 파란색 하이라이트가 표시되고 드래그가 방해받음

**해결:** CSS `user-select: none` 적용 (Tailwind: `select-none`)

---

## 🔧 수정 내용

### 1. useDragScroll Hook 개선

#### 새로운 옵션 추가
```typescript
export interface DragScrollOptions {
  scrollSpeed?: number;
  dragThreshold?: number; // 드래그로 인식할 최소 이동 거리 (기본 5px)
}
```

#### 새로운 상태 추가
```typescript
const [hasDragged, setHasDragged] = useState(false);
```
- `hasDragged`: 실제로 드래그가 발생했는지 추적
- 버튼 클릭 핸들러에서 이 값을 확인하여 드래그 중 클릭 방지

#### handleMouseMove 개선
```typescript
const handleMouseMove = useCallback(
  (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const x = e.pageX - containerRef.current.offsetLeft;
    const distance = Math.abs(x - startX);

    // dragThreshold 이상 이동하면 실제 드래그로 인식
    if (distance > dragThreshold) {
      e.preventDefault();
      setHasDragged(true);
      const walk = (x - startX) * scrollSpeed;
      containerRef.current.scrollLeft = scrollLeft - walk;
    }
  },
  [isDragging, startX, scrollLeft, scrollSpeed, dragThreshold]
);
```

**동작:**
1. 마우스 이동 거리(`distance`) 계산
2. `dragThreshold`(5px) 이상 이동했는지 확인
3. 조건 충족 시:
   - `e.preventDefault()`: 텍스트 선택 방지
   - `setHasDragged(true)`: 드래그 발생 표시
   - 스크롤 위치 업데이트

#### 반환값 추가
```typescript
return {
  containerRef,
  isDragging,
  hasDragged, // 새로 추가
  handlers: { ... }
};
```

---

### 2. CategoryChips 컴포넌트 수정

#### select-none 클래스 추가
```typescript
<div
  ref={containerRef}
  className={`flex gap-3 overflow-x-auto scrollbar-hide select-none ${
    isDragging ? 'cursor-grabbing' : 'cursor-grab'
  }`}
  {...handlers}
>
```

**`select-none`의 효과:**
```css
user-select: none;
```
- 드래그 중 텍스트 선택 완전 차단
- 모든 브라우저에서 작동

#### 버튼 클릭 핸들러 개선

**X 버튼:**
```typescript
<button
  onClick={(e) => {
    // 드래그 중이었다면 클릭 무시
    if (hasDragged) {
      e.preventDefault();
      return;
    }
    onClearAll();
  }}
  disabled={selectedTags.length === 0}
  className={...}
>
```

**태그 버튼:**
```typescript
<button
  onClick={(e) => {
    // 드래그 중이었다면 클릭 무시
    if (hasDragged) {
      e.preventDefault();
      return;
    }
    onTagToggle(tag);
  }}
  className={...}
>
  {tag}
</button>
```

**동작:**
1. 버튼 클릭 시 `hasDragged` 확인
2. `true`면 드래그였으므로 클릭 무시
3. `false`면 클릭으로 처리

---

## 🎮 동작 흐름

### 짧은 클릭 (5px 미만 이동)
```
1. 마우스 다운
   → isDragging = true
   → hasDragged = false

2. 마우스 이동 3px
   → distance = 3px < 5px
   → 스크롤 안 함
   → hasDragged = false (유지)

3. 마우스 업
   → isDragging = false
   → hasDragged = false

4. 버튼 클릭 이벤트
   → hasDragged === false
   → onTagToggle() 실행 ✅
```

### 드래그 (5px 이상 이동)
```
1. 마우스 다운
   → isDragging = true
   → hasDragged = false

2. 마우스 이동 10px
   → distance = 10px > 5px
   → 스크롤 발생
   → hasDragged = true

3. 마우스 이동 20px
   → 계속 스크롤
   → hasDragged = true (유지)

4. 마우스 업
   → isDragging = false
   → hasDragged = true (잠시 유지)

5. 버튼 클릭 이벤트
   → hasDragged === true
   → 클릭 무시 ❌
   → onTagToggle() 실행 안 함

6. setTimeout으로 초기화
   → hasDragged = false
```

---

## 🎨 사용자 경험 개선

### 이전 (문제 있음)
```
❌ 버튼 위에서 드래그 안 됨
❌ 드래그 중 텍스트 선택됨
❌ 드래그 후 의도치 않은 클릭 발생
```

### 현재 (개선됨)
```
✅ 칩스 영역 전체에서 드래그 가능
✅ 버튼 위에서도 드래그 가능
✅ 텍스트 선택 완전 차단
✅ 드래그와 클릭 정확히 구분
✅ 짧은 터치는 클릭으로 인식
```

---

## 🔍 핵심 개념

### 1. Drag Threshold (드래그 임계값)
```typescript
dragThreshold = 5px
```
- **5px 미만 이동**: 손 떨림 또는 클릭 의도 → 클릭으로 처리
- **5px 이상 이동**: 드래그 의도 → 스크롤 작동

### 2. hasDragged vs isDragging
```typescript
isDragging: 마우스 버튼을 누르고 있는지
hasDragged: 실제로 드래그가 발생했는지 (5px 이상 이동)

// 예시
마우스 다운 → isDragging = true, hasDragged = false
3px 이동 → isDragging = true, hasDragged = false
8px 이동 → isDragging = true, hasDragged = true ← 여기서 변경!
마우스 업 → isDragging = false, hasDragged = true (잠시)
```

### 3. setTimeout 초기화
```typescript
setTimeout(() => setHasDragged(false), 0);
```
- 다음 이벤트 루프 틱에서 초기화
- 클릭 핸들러가 먼저 실행된 후 초기화
- 타이밍 문제 방지

---

## 📊 성능 영향

### 추가된 연산
- `Math.abs()` 계산 (매우 가벼움)
- 조건문 1개 추가
- 상태 변경 1개 추가

### 성능 영향: **거의 없음**
- 드래그 중에만 실행
- 계산량이 매우 적음
- 60fps 유지 가능

---

## 🎯 테스트 시나리오

### 1. 버튼 클릭 테스트
```
1. '지갑' 버튼 클릭 (움직이지 않고)
   → 기대: 태그 선택/해제 됨 ✅

2. X 버튼 클릭
   → 기대: 모든 태그 해제됨 ✅
```

### 2. 드래그 테스트
```
1. 버튼 위에서 마우스 다운 후 좌우로 드래그
   → 기대: 스크롤 됨 ✅
   → 태그 선택 안 됨 ✅

2. 빈 공간에서 드래그
   → 기대: 스크롤 됨 ✅

3. 드래그 중 텍스트 확인
   → 기대: 텍스트 선택 안 됨 ✅
```

### 3. 엣지 케이스
```
1. 버튼 위에서 마우스 다운 → 3px 이동 → 마우스 업
   → 기대: 클릭으로 인식 (태그 토글) ✅

2. 버튼 위에서 마우스 다운 → 10px 이동 → 마우스 업
   → 기대: 드래그로 인식 (클릭 무시) ✅

3. 빠른 연속 클릭
   → 기대: 모든 클릭 정상 작동 ✅
```

---

## 🔧 커스터마이징

### dragThreshold 조정
```typescript
// 더 민감하게 (2px만 이동해도 드래그)
const { ... } = useDragScroll({ dragThreshold: 2 });

// 덜 민감하게 (10px 이상 이동해야 드래그)
const { ... } = useDragScroll({ dragThreshold: 10 });

// 기본값 (5px)
const { ... } = useDragScroll();
```

### 권장 값
- **모바일**: 8-10px (터치가 부정확함)
- **데스크톱**: 3-5px (마우스가 정확함)
- **현재 설정**: 5px (범용적)

---

## 📚 관련 개념

### user-select: none
```css
user-select: none;
-webkit-user-select: none; /* Safari */
-moz-user-select: none;    /* Firefox */
-ms-user-select: none;     /* IE/Edge */
```
- 텍스트 선택 차단
- 드래그 UX 개선에 필수

### preventDefault()
```typescript
e.preventDefault();
```
- 브라우저 기본 동작 차단
- 텍스트 선택, 이미지 드래그 등 방지

### Event Bubbling
```typescript
onClick={(e) => {
  if (hasDragged) {
    e.preventDefault(); // 버블링 중단
    return;
  }
  onTagToggle(tag);
}}
```
- 이벤트가 부모로 전파되는 것 방지
- 드래그 중 클릭이 부모에게 전달 안 됨

---

## 🎓 핵심 요약

### 해결 방안
1. **dragThreshold**: 드래그와 클릭을 거리로 구분 (5px)
2. **hasDragged**: 실제 드래그 발생 여부 추적
3. **select-none**: 텍스트 선택 완전 차단
4. **조건부 클릭**: 드래그 중이면 클릭 무시

### 결과
- ✅ 칩스 영역 전체에서 드래그 가능
- ✅ 버튼 클릭과 드래그 정확히 구분
- ✅ 텍스트 선택 문제 완전 해결
- ✅ 자연스러운 사용자 경험

**모든 영역에서 드래그 가능하면서도 버튼 클릭은 정상 작동합니다!**
