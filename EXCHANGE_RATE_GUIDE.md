# 환율 API 기능 구현 가이드

현재 환율 정보를 확인하는 기능이 추가되었습니다. 한국수출입은행의 공개 API를 사용하여 실시간 환율 정보를 조회합니다.

## 📋 구현된 기능

### 1. **exchangeRateService.ts** - API 서비스
환율 API와 통신하는 서비스 계층입니다.

**주요 함수:**
- `fetchExchangeRates(currencyCode?, searchDate?)` - 환율 정보 조회
- `fetchAllExchangeRates()` - 모든 환율 조회
- `fetchExchangeRateByCurrency(currencyCode)` - 특정 통화의 환율 조회
- `parseExchangeRateData(response)` - 응답 데이터 파싱

**사용 예시:**
```typescript
import { fetchAllExchangeRates, fetchExchangeRateByCurrency } from '@/services/exchangeRateService';

// 모든 환율 조회
const allRates = await fetchAllExchangeRates();

// 특정 통화 조회 (예: 미국 달러)
const usdRate = await fetchExchangeRateByCurrency('USD');
```

### 2. **exchangeRateStore.ts** - 상태 관리 (Zustand)
Zustand를 사용한 환율 상태 관리 스토어입니다.

**상태:**
- `exchangeRates[]` - 조회된 환율 목록
- `isLoading` - 로딩 상태
- `error` - 에러 메시지
- `lastFetchedAt` - 마지막 조회 시간

**액션:**
- `fetchRates()` - 모든 환율 조회
- `fetchRateByCurrency(currencyCode)` - 특정 통화 조회
- `clearError()` - 에러 초기화
- `reset()` - 상태 초기화

**사용 예시:**
```typescript
import { useExchangeRateStore } from '@/store/exchangeRateStore';

function MyComponent() {
  const { exchangeRates, isLoading, error, fetchRates } = useExchangeRateStore();

  useEffect(() => {
    fetchRates();
  }, []);

  if (isLoading) return <Text>로딩 중...</Text>;
  if (error) return <Text>오류: {error}</Text>;

  return (
    <View>
      {exchangeRates.map(rate => (
        <Text key={rate.CUR_UNIT}>{rate.CUR_NM}: {rate.DEAL_BAS_R}</Text>
      ))}
    </View>
  );
}
```

### 3. **ExchangeRateList 컴포넌트** - UI
환율 목록을 표시하는 컴포넌트입니다.

**특징:**
- 환율 목록 리스트 표시
- 풀 투 리프레시 지원
- 로딩 상태 표시
- 에러 처리 화면
- TailwindCSS 스타일링

**Props:**
```typescript
interface ExchangeRateListProps {
  rates: ExchangeRateResponse[];
  isLoading: boolean;
  error: string | null;
  onRefresh?: () => void;
  onRetry?: () => void;
}
```

### 4. **ExchangeRateScreen** - 화면
환율 정보를 표시하는 전체 스크린입니다.

## 🧪 테스트 방법

### 방법 1: ExchangeRateScreen을 App에 추가
[App.tsx](../src/App.tsx)를 다음과 같이 수정합니다:

```typescript
import ExchangeRateScreen from './screens/ExchangeRateScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function App() {
  return (
    <SafeAreaProvider>
      <ExchangeRateScreen />
    </SafeAreaProvider>
  );
}

export default App;
```

### 방법 2: 직접 테스트
```typescript
import { fetchExchangeRates } from './src/services/exchangeRateService';

// 콘솔에서 환율 정보 확인
const rates = await fetchExchangeRates();
console.log('환율 정보:', rates);
```

## 📊 API 응답 형식

### 요청 예시
```
https://oapi.koreaexim.go.kr/site/program/financial/exchangeJSON
?authkey=RSu4909GdEh1ILWW2M8SX8zmz5EICQlx
&data=AP01
```

### 응답 예시
```json
[
  {
    "RESULT": 1,
    "CUR_UNIT": "USD",
    "CUR_NM": "미국 달러",
    "ITB": "1,300.50",
    "TTS": "1,280.00",
    "DEAL_BAS_R": "1,290.00",
    "BKPR": "1,290.00",
    "YY_EFEE_R": "1,290.00",
    "TEN_DD_EFEE_R": "1,290.00",
    "KFTC_DEAL_BAS_R": "1,290.00",
    "KFTC_BKPR": "1,290.00"
  }
]
```

## 📝 주요 필드 설명

| 필드 | 설명 | 예시 |
|------|------|------|
| RESULT | 조회 결과 | 1: 성공, 2-4: 실패 |
| CUR_UNIT | 통화코드 | USD, JPY, EUR 등 |
| CUR_NM | 통화명 | 미국 달러, 일본 엔 등 |
| ITB | 전신환 수취율 | 1,300.50 |
| TTS | 전신환 송금율 | 1,280.00 |
| DEAL_BAS_R | 매매 기준율 | 1,290.00 |
| BKPR | 장부가격 | 1,290.00 |

## 🔧 설정 정보

**API 정보:**
- URL: `https://oapi.koreaexim.go.kr/site/program/financial/exchangeJSON`
- 인증키: `RSu4909GdEh1ILWW2M8SX8zmz5EICQlx`
- 데이터 타입: `AP01` (환율 정보)

**지원 통화 코드:**
- USD (미국 달러)
- JPY (일본 엔)
- EUR (유로)
- GBP (영국 파운드)
- CNY (중국 위안화)
- HKD (홍콩 달러)
- TWD (대만 달러)
- SGD (싱가포르 달러)
- THB (태국 바트)
- VND (베트남 동)
- PHP (필리핀 페소)
- IDR (인도네시아 루피아)
- MYR (말레이시아 링깟)
- 기타 다양한 통화

## ⚙️ 파일 구조

```
src/
├── services/
│   └── exchangeRateService.ts    # API 통신 서비스
├── store/
│   └── exchangeRateStore.ts      # Zustand 상태 관리
├── components/
│   └── ui/
│       └── ExchangeRateList.tsx  # 환율 목록 컴포넌트
├── screens/
│   └── ExchangeRateScreen.tsx    # 환율 화면
└── types/
    └── index.ts                  # TypeScript 타입 정의
```

## 🚀 다음 단계

1. **App.tsx 수정** - ExchangeRateScreen을 메인 화면에 추가
2. **네비게이션 연동** - React Navigation과 통합
3. **캐싱 구현** - 환율 정보 로컬 캐싱
4. **알림 설정** - 특정 환율에서 알림 등록
5. **즐겨찾기** - 자주 사용하는 통화 저장
