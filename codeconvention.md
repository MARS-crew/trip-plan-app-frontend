# React Native 코드 컨벤션 가이드

**React Native CLI · Tailwind (NativeWind) · Zustand**

---

## 1. 프로젝트 디렉토리 구조

모든 소스 코드는 `src/` 아래에 위치하며, 기능 단위(feature-based)로 폴더를 구성합니다.

```notion
src/
├── App.tsx
├── components/
│   └── ui/               # 기본 UI 원소 (Button, Input 등)
├── screens/              # 화면 단위 컴포넌트
├── navigation/           # React Navigation 설정
├── store/                # Zustand 스토어
├── hooks/                # 커스텀 훅
├── services/             # API, 외부 서비스
├── utils/                # 순수 유틸 함수
├── types/                # 전역 TypeScript 타입 정의
├── constants/            # 상수값 (colors, sizes 등)
└── assets/               # 이미지, 폰트 등 정적 리소스
```

---

## 2. 네이밍 컨벤션

### 파일 및 폴더

| 항목          | 규칙                       | 예시              |
| ------------- | -------------------------- | ----------------- |
| 컴포넌트 파일 | PascalCase                 | `UserProfile.tsx` |
| 스크린 파일   | PascalCase + Screen 접미사 | `HomeScreen.tsx`  |
| 훅 파일       | camelCase + use 접두사     | `useAuthStore.ts` |
| 스토어 파일   | camelCase + Store 접미사   | `authStore.ts`    |
| 유틸 파일     | camelCase                  | `formatDate.ts`   |
| 타입 파일     | camelCase + .types 접미사  | `user.types.ts`   |
| 폴더명        | camelCase                  | `userProfile/`    |
|               |                            |                   |

### 변수 및 함수

| 항목            | 규칙                  | 예시                          |
| --------------- | --------------------- | ----------------------------- |
| 일반 변수       | camelCase             | `const userName`              |
| 모듈 레벨 상수  | UPPER_SNAKE_CASE      | `const BASE_URL`              |
| 함수            | camelCase             | `function fetchUserData()`    |
| 컴포넌트        | PascalCase            | `function UserCard()`         |
| 타입/인터페이스 | PascalCase            | `interface UserProps`         |
| Boolean 변수    | is / has / can 접두사 | `isLoading`, `hasError`       |
| 이벤트 핸들러   | handle 접두사         | `handlePress`, `handleSubmit` |

---

## 3. TypeScript 컨벤션

**기본 원칙**

- `any` 타입 사용 금지 → 명시적 타입 사용
- 모든 함수의 파라미터와 반환 타입을 명시
- `type`보다 `interface` 우선 사용 (확장 가능성)
- Optional chaining (`?.`) 및 nullish coalescing (`??`) 적극 활용

**Props 타입 정의**

tsx

```jsx
// 올바른 예
interface UserCardProps {
  userId: string;
  name: string;
  avatarUrl?: string;         // optional은 ? 사용
  onPress: (id: string) => void;
}

const UserCard = ({ userId, name, avatarUrl, onPress }: UserCardProps) => {
  return <View />;
};
```

**API 응답 타입**

ts

```jsx
// types/user.types.ts
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
```

---

## 4. 컴포넌트 작성 규칙

### 내부 코드 순서

tsx

```jsx
const MyComponent = ({ prop1, prop2 }: MyComponentProps) => {
  // 1. Hooks (useState, useEffect, 커스텀 훅)
  const [state, setState] = useState(false);
  const { data } = useMyStore();

  // 2. 파생 값 (useMemo, useCallback)
  const computedValue = useMemo(() => ..., [data]);
  const handlePress = useCallback(() => setState(true), []);

  // 3. 조기 반환 (early return)
  if (!data) return null;

  // 4. 렌더링
  return (
    <View className="flex-1 bg-white">
      <Text className="text-lg font-bold">{prop1}</Text>
    </View>
  );
};
```

### 컴포넌트 분리 기준

- 100줄을 초과하면 분리 검토
- 재사용 가능성이 있으면 `components/ui/`로 분리
- 스크린 전용 서브컴포넌트는 `screens/{ScreenName}/components/`에 배치
- 리스트 아이템은 반드시 별도 컴포넌트로 분리 (FlatList 성능 최적화)

### memo / useCallback / useMemo 사용 기준

| API           | 사용 시점                                         |
| ------------- | ------------------------------------------------- |
| `React.memo`  | 부모 리렌더링 시 불필요한 자식 렌더링을 방지할 때 |
| `useCallback` | 자식에게 콜백 prop으로 전달되는 함수              |
| `useMemo`     | 정렬, 필터 등 계산 비용이 높은 파생값             |

---

## 5. Tailwind (NativeWind) 스타일 규칙

**기본 원칙**

- 인라인 `StyleSheet` 사용 금지 — `className` prop으로 통일
- 동적 클래스는 조건 변수로 분리하여 가독성 확보
- 자주 쓰이는 클래스 조합은 컴포넌트로 추상화
- **tailwindcss 플러그인을 사용해 클래스 순서는 아래와 같게 진행하나 Prettier plugin 결과를 따르는 것으로 진행한다**

### 클래스 작성 순서

| 순서 | 카테고리                 | 예시                                    |
| ---- | ------------------------ | --------------------------------------- |
| 1    | 레이아웃 (flex, display) | `flex flex-row items-center`            |
| 2    | 위치 (position, z-index) | `absolute top-0 z-10`                   |
| 3    | 크기 (width, height)     | `w-full h-12`                           |
| 4    | 간격 (margin, padding)   | `mx-4 px-3 py-2`                        |
| 5    | 배경·테두리              | `bg-white rounded-lg border`            |
| 6    | 텍스트                   | `text-base font-semibold text-gray-800` |
| 7    | 효과·기타                | `shadow-md opacity-75`                  |

**동적 스타일 예시**

tsx

```jsx
// 올바른 예 — 조건 변수로 분리
const isActive = selected === item.id;

<TouchableOpacity
  className={`flex-row items-center px-4 py-3 rounded-xl
    ${isActive ? 'bg-blue-500' : 'bg-gray-100'}`}
  onPress={() => handleSelect(item.id)}
>
  <Text className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-700'}`}>
    {item.label}
  </Text>
</TouchableOpacity>

// 잘못된 예 — StyleSheet 혼용
<View style={styles.container} className="flex-1" />
```

**커스텀 테마 (tailwind.config.js)**

js

```jsx
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#3B82F6', dark: '#2563EB' },
        secondary: '#6B7280',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['Pretendard', 'System'],
      },
    },
  },
};
```

---

## 6. Zustand 상태 관리 규칙

### 스토어 구조

ts

```jsx
// store/authStore.ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface AuthState {
  // 상태
  user: User | null;
  isLoading: boolean;
  // 액션
  setUser: (user: User) => void;
  logout: () => void;
  fetchUser: (id: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  immer((set) => ({
    user: null,
    isLoading: false,

    setUser: (user) => set({ user }),
    logout: () => set({ user: null }),

    fetchUser: async (id) => {
      set({ isLoading: true });
      try {
        const user = await userService.getUser(id);
        set({ user, isLoading: false });
      } catch {
        set({ isLoading: false });
      }
    },
  }))
);
```

### 스토어 분리 원칙

- 도메인 단위로 분리 (`authStore`, `cartStore`, `uiStore` 등)
- UI 상태(모달 오픈 여부 등)는 별도 `uiStore`로 관리
- 서버 데이터 캐싱은 React Query와 병행 사용 권장

### 컴포넌트에서 사용

ts

```jsx
// selector로 필요한 값만 구독
const user = useAuthStore((state) => state.user);
const logout = useAuthStore((state) => state.logout);

// 전체 스토어 구독 — 모든 변경마다 리렌더링 발생
const store = useAuthStore();
```

---

## 7. Navigation 규칙

ts

```jsx
// navigation/types.ts
export type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  Settings: undefined;
};

// 화면 이동 (타입 안전)
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
type Nav = NativeStackNavigationProp<RootStackParamList>;
const navigation = useNavigation<Nav>();

navigation.navigate('Profile', { userId: '123' });
```

---

## 8. import / export 규칙

### Barrel export (index.ts)

각 폴더에 `index.ts`를 생성하여 외부 노출 API를 한 곳에서 관리합니다.

ts

```jsx
// components/ui/index.ts
export { default as Button } from './Button';
export { default as Input } from './Input';

// 사용할 때
import { Button, Input } from '@/components/ui';
```

### 절대 경로 (Path Alias)

json

```jsx
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
```

js

```jsx
// babel.config.js (babel-plugin-module-resolver 설치 필요)
module.exports = {
  plugins: [['module-resolver', { alias: { '@': './src' } }]],
};
```

---

## 10. Linting & Formatting

js

```jsx
// .eslintrc.js
rules: {
  'no-console': ['warn', { allow: ['warn', 'error'] }],
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/no-unused-vars': 'error',
  'react-hooks/exhaustive-deps': 'warn',
  'prefer-const': 'error',
}
```

json

```jsx
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100,
  "bracketSameLine": true
}
```

---

## 11. 금지 사항 (Anti-patterns)

| 금지 패턴                    | 대안                                 |
| ---------------------------- | ------------------------------------ |
| `any` 타입 사용              | `unknown` 또는 명시적 타입           |
| `StyleSheet.create` 사용     | Tailwind `className` prop            |
| 전체 스토어 구독             | selector로 필요한 값만 구독          |
| `useEffect` 의존성 배열 무시 | eslint 경고 반드시 해결              |
| 색상·문자열 하드코딩         | `constants/` 또는 Tailwind 테마 활용 |
| `index.ts` 없는 폴더         | 항상 barrel export 작성              |
| 익명 default export          | named + default export 병행          |
