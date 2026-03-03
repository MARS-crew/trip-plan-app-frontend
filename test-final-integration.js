/**
 * 환율 API 완전 통합 테스트
 * 제공된 실제 데이터 형식을 기반으로 테스트합니다.
 */

const API_URL = 'https://oapi.koreaexim.go.kr/site/program/financial/exchangeJSON';
const AUTH_KEY = 'RSu4909GdEh1ILWW2M8SX8zmz5EICQlx';

/**
 * 환율 정보를 API에서 조회합니다.
 */
const fetchExchangeRates = async (currencyCode, searchDate) => {
  try {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    const defaultDate = searchDate || date.toISOString().split('T')[0].replace(/-/g, '');

    const params = {
      authkey: AUTH_KEY,
      data: 'AP01',
      searchdate: defaultDate,
    };

    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    console.log('📡 API 요청 중...\n');

    const response = await fetch(`${API_URL}?${queryString}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rawData = await response.json();

    // 응답 데이터를 표준 형식으로 변환
    const data = rawData.map(item => ({
      RESULT: item.result,
      CUR_UNIT: item.cur_unit,
      CUR_NM: item.cur_nm,
      ITB: item.ttb,
      TTS: item.tts,
      DEAL_BAS_R: item.deal_bas_r,
      BKPR: item.bkpr,
      YY_EFEE_R: item.yy_efee_r,
      TEN_DD_EFEE_R: item.ten_dd_efee_r,
      KFTC_DEAL_BAS_R: item.kftc_deal_bas_r,
      KFTC_BKPR: item.kftc_bkpr,
    }));

    if (currencyCode) {
      return data.filter(item => item.CUR_UNIT === currencyCode);
    }

    return data;
  } catch (error) {
    console.error('❌ 환율 정보 조회 실패:', error.message);
    throw error;
  }
};

/**
 * 모든 환율 정보를 조회합니다.
 */
const fetchAllExchangeRates = async () => {
  return fetchExchangeRates();
};

/**
 * 특정 통화의 환율 정보를 조회합니다.
 */
const fetchExchangeRateByCurrency = async (currencyCode) => {
  const rates = await fetchExchangeRates(currencyCode);
  return rates.length > 0 ? rates[0] : null;
};

// ============================================
// 테스트 실행
// ============================================

async function runTests() {
  console.log('\n🧪 exchangeRateService 통합 테스트\n');
  console.log('═'.repeat(75) + '\n');

  try {
    // 테스트 1: 현재/최근 환율 조회
    console.log('✅ 테스트 1: 최근 영업일 환율 조회');
    console.log('─'.repeat(75));
    const allRates = await fetchAllExchangeRates();
    console.log(`✓ 조회 완료: ${allRates.length}개의 통화 정보\n`);

    if (allRates.length > 0) {
      // 테스트 2: 데이터 구조 확인
      console.log('✅ 테스트 2: 응답 데이터 구조 확인');
      console.log('─'.repeat(75));
      const firstRate = allRates[0];
      console.log('첫 번째 항목 (원본 필드명):');
      console.log('  └─ RESULT:', firstRate.RESULT, '(1=성공)');
      console.log('  └─ CUR_UNIT:', firstRate.CUR_UNIT, '(통화코드)');
      console.log('  └─ CUR_NM:', firstRate.CUR_NM, '(통화명)');
      console.log('  └─ DEAL_BAS_R:', firstRate.DEAL_BAS_R, '(기준율)');
      console.log('  └─ TTS:', firstRate.TTS, '(송금율)');
      console.log('  └─ ITB:', firstRate.ITB, '(수취율)');
      console.log('  └─ BKPR:', firstRate.BKPR, '(장부가격)');
      console.log('');

      // 테스트 3: 특정 통화 조회
      console.log('✅ 테스트 3: 특정 통화 조회 (USD)');
      console.log('─'.repeat(75));
      const usdRate = await fetchExchangeRateByCurrency('USD');
      if (usdRate) {
        console.log(`✓ ${usdRate.CUR_UNIT} (${usdRate.CUR_NM}) 조회 성공!`);
        console.log(`  기준율: ${usdRate.DEAL_BAS_R} KRW`);
        console.log(`  송금율(TTS): ${usdRate.TTS}`);
        console.log(`  수취율(ITB): ${usdRate.ITB}`);
        console.log('');
      } else {
        console.log('✗ USD 환율을 찾을 수 없습니다.\n');
      }

      // 테스트 4: 주요 통화 정보
      console.log('✅ 테스트 4: 주요 통화 환율 정보');
      console.log('─'.repeat(75));
      const mainCurrencies = ['USD', 'JPY(100)', 'EUR', 'GBP', 'CNH'];
      const mainRates = allRates.filter(r => mainCurrencies.includes(r.CUR_UNIT));
      
      mainRates.forEach(rate => {
        console.log(`${rate.CUR_UNIT.padEnd(12)} | ${rate.CUR_NM.padEnd(20)} | 기준율: ${rate.DEAL_BAS_R.padStart(10)}`);
      });
      console.log('');

      // 테스트 5: 모든 통화 목록
      console.log('✅ 테스트 5: 조회된 모든 통화 목록');
      console.log('─'.repeat(75));
      const currencyList = allRates.map(r => r.CUR_UNIT).join(', ');
      console.log(currencyList);
      console.log('');

      // 테스트 6: 환율 타입 검증
      console.log('✅ 테스트 6: 환율 데이터 유효성 검증');
      console.log('─'.repeat(75));
      const validationResults = {
        totalCount: allRates.length,
        validBaseRate: 0,
        validTTS: 0,
        validITB: 0,
        zeroValues: 0,
      };

      allRates.forEach(rate => {
        const baseRate = parseFloat(rate.DEAL_BAS_R);
        const tts = parseFloat(rate.TTS);
        const itb = parseFloat(rate.ITB);

        if (!isNaN(baseRate) && baseRate > 0) validationResults.validBaseRate++;
        if (!isNaN(tts) && tts > 0) validationResults.validTTS++;
        if (!isNaN(itb) && itb > 0) validationResults.validITB++;
        if (tts === 0 && itb === 0) validationResults.zeroValues++;
      });

      console.log(`총 통화 수: ${validationResults.totalCount}`);
      console.log(`유효한 기준율: ${validationResults.validBaseRate}개`);
      console.log(`유효한 송금율: ${validationResults.validTTS}개`);
      console.log(`유효한 수취율: ${validationResults.validITB}개`);
      console.log(`0값 항목: ${validationResults.zeroValues}개`);
      console.log('');

      // 테스트 7: 샘플 데이터 상세 보기
      console.log('✅ 테스트 7: 샘플 데이터 상세 정보');
      console.log('─'.repeat(75));
      console.log('JSON 형식:');
      console.log(JSON.stringify(firstRate, null, 2));
      console.log('');

    } else {
      console.log('⚠️ 조회된 데이터가 없습니다.');
      console.log('📝 참고: API는 영업일(월-금) 09:00~16:30에만 업데이트됩니다.\n');
    }

    console.log('═'.repeat(75));
    console.log('✨ 테스트 완료!\n');
    console.log('📌 서비스 사용법:');
    console.log('   import { fetchAllExchangeRates } from "@/services/exchangeRateService";');
    console.log('   const rates = await fetchAllExchangeRates();');
    console.log('');
    console.log('📌 상태 관리 (Zustand) 사용법:');
    console.log('   import { useExchangeRateStore } from "@/store/exchangeRateStore";');
    console.log('   const { exchangeRates, isLoading, error, fetchRates } = useExchangeRateStore();');
    console.log('   useEffect(() => { fetchRates(); }, []);\n');

  } catch (error) {
    console.error('❌ 테스트 실패:', error);
    process.exit(1);
  }
}

// 테스트 실행
runTests();
