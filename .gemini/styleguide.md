# Frontend Code Review Style Guide (React Native + Tailwind)

## Review Language

* 모든 리뷰 코멘트는 한국어로 작성한다.

---

## Review Priority

다음 순서로 중요도를 판단한다:

1. 실제 버그 가능성
2. 보안 문제
3. 성능 문제
4. 팀 컨벤션 위반
5. 가독성 및 리팩토링 제안

* 단순 취향 차이는 강한 수정 요청으로 남기지 않는다.
* 기존 프로젝트 구조와 팀 규칙을 최우선으로 따른다.

---

## Project Structure

* 모든 소스 코드는 `src/` 하위에 위치해야 한다.
* feature 기반 구조를 유지한다.

```text
components/   → 재사용 UI
screens/      → 화면 단위
services/     → API
store/        → Zustand
hooks/        → 커스텀 훅
utils/        → 유틸 함수
types/        → 타입 정의
constants/    → 상수
```

* 구조를 크게 변경하는 제안은 지양한다.

---

## Naming Conventions

### Files & Folders

* 컴포넌트: PascalCase (UserProfile.tsx)
* 스크린: PascalCase + Screen (HomeScreen.tsx)
* 훅: camelCase + use 접두사 (useAuthStore.ts)
* 스토어: camelCase + Store (authStore.ts)
* 유틸: camelCase (formatDate.ts)
* 타입: camelCase + `.types` (user.types.ts)
* 폴더: camelCase

### Variables & Functions

* 변수/함수: camelCase
* 상수: UPPER_SNAKE_CASE
* Boolean: is / has / can 접두사
* 이벤트 핸들러: handle 접두사
* 컴포넌트: PascalCase

---

## TypeScript Rules

* `any` 사용 금지
* 모든 함수는 파라미터 및 반환 타입 명시
* `interface` 우선 사용
* Optional chaining (`?.`) 적극 사용

### 반드시 지적해야 하는 경우

* any 사용
* 타입 누락
* null/undefined 처리 미흡

---

## Component Rules

### 내부 코드 순서

1. Hooks
2. 파생값 (useMemo / useCallback)
3. early return
4. render

### 분리 기준 (중요)

* 100줄 이상 컴포넌트는 분리 검토 대상
* 동일하거나 유사한 UI가 반복되면 컴포넌트로 분리해야 한다
* 재사용 가능성이 있으면 `components/ui`로 분리한다
* 리스트 아이템은 반드시 별도 컴포넌트로 분리한다

### 성능 관련

* React.memo: 불필요 렌더링 방지
* useCallback: 자식에 전달되는 함수
* useMemo: 비용 큰 계산

---

## State Management (Zustand)

* 도메인 단위로 store 분리
* UI 상태는 별도 store
* selector 사용 권장 (전체 구독 금지)

### 강하게 지적

* 전체 store 구독
* 불필요한 리렌더링 유발 구조

---

## API / Service Layer

* API 호출은 컴포넌트 내부에 직접 작성하지 않는다.
* services 레이어로 분리한다.

---

## Tailwind (NativeWind) Rules

### 기본 원칙

* StyleSheet 사용 금지
* className 사용 통일
* 동적 스타일은 조건 변수로 분리

### 클래스 작성 규칙

* 아래 순서를 기준으로 작성한다:

1. layout (flex, display)
2. position (absolute 등)
3. size (width, height)
4. spacing (margin, padding)
5. background & border
6. text
7. effects

⚠️ 단, 클래스 정렬 순서는 Prettier Tailwind Plugin 결과를 우선한다.

### 리뷰 기준

* 임의 px 값 남발 시 지적
* 기존 패턴과 다른 스타일 사용 시 지적
* 디자인 일관성 위반 시 지적

---

## Styling Rules

* 공통 스타일은 재사용 가능하게 추상화
* 색상, spacing 값 하드코딩 금지 → constants 또는 theme 사용

---

## Import Rules

* Barrel export (index.ts) 사용
* 절대 경로 (`@/`) 사용

---

## Lint / Formatting

* ESLint 경고는 무시하지 않는다
* Prettier 포맷을 따른다

---

## Anti-patterns (강하게 지적)

다음은 반드시 리뷰에서 지적한다:

* any 사용
* StyleSheet 사용
* 전체 store 구독
* useEffect 의존성 무시
* 색상, spacing, 문자열 하드코딩
* 보안 위험 코드
* 중복 로직

### 컴포넌트 구조 관련 (중요)

* 동일하거나 유사한 UI 코드가 반복되는 경우 컴포넌트로 분리되지 않은 경우
* 하나의 컴포넌트가 과도하게 커진 경우 (가독성 저하)
* JSX 내부에 로직이 과도하게 포함된 경우
* 리스트 렌더링 시 아이템 컴포넌트를 분리하지 않은 경우
* 재사용 가능한 UI를 screens 내부에 직접 작성한 경우

👉 위 항목들은 단순 제안이 아니라 **수정 권장 수준으로 강하게 지적한다**

---

## Soft Suggestions (약하게 제안)

* 변수명 개선
* 함수 분리
* 코드 가독성 개선
* 주석 정리

---

## Review Behavior

* 문제 발생 이유를 간단히 설명한다
* 가능하면 해결 방법을 함께 제시한다
* 애매한 경우 "제안" 형태로 표현한다
* 이미 컨벤션에 맞는 코드는 불필요하게 수정 요구하지 않는다
