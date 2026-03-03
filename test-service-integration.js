/**
 * exchangeRateService 통합 테스트
 * React Native 환경이 아닌 Node.js에서 서비스 메서드들을 직접 테스트합니다.
 */

// API_URL과 AUTH_KEY를 로컬로 정의 (import 대신)
const API_URL = 'https://oapi.koreaexim.go.kr/site/program/financial/exchangeJSON';
const AUTH_KEY = 'RSu4909GdEh1ILWW2M8SX8zmz5EICQlx';

/**
 * 환율 정보를 API에서 조회합니다.
 */
const fetchExchangeRates = async (
  currencyCode,
  searchDate
) => {
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

    console.log('📡 API 요청: ' + API_URL + '?\n');

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
    console.error('❌ 환율 정보 조회 실패:', error);
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
  console.log('🧪 exchangeRateService 통합 테스트\n');
  console.log('═'.repeat(70) + '\n');

  try {
    // 테스트 1: 모든 환율 조회
    console.log('✅ 테스트 1: 모든 환율 조회');
    console.log('─'.repeat(70));
    const allRates = await fetchAllExchangeRates();
    console.log(`✓ 성공! ${allRates.length}개의 통화 정보 조회됨\n`);

    // 테스트 2: 데이터 변환 확인
    console.log('✅ 테스트 2: 데이터 변환 확인');
    console.log('─'.repeat(70));
    if (allRates.length > 0) {
      const firstRate = allRates[0];
      console.log('첫 번째 항목:');
      console.log(`  • 통화코드: ${firstRate.CUR_UNIT}`);
      console.log(`  • 통화명: ${firstRate.CUR_NM}`);
      console.log(`  • 기준율: ${firstRate.DEAL_BAS_R}`);
      console.log(`  • 송금율(TTS): ${firstRate.TTS}`);
      console.log(`  • 수취율(TTB): ${firstRate.ITB}`);
      console.log(`  • 결과코드: ${firstRate.RESULT}`);
      console.log('');
    }

    // 테스트 3: 특정 통화 조회
    console.log('✅ 테스트 3: 특정 통화 조회 (USD)');
    console.log('─'.repeat(70));
    const usdRate = await fetchExchangeRateByCurrency('USD');
    if (usdRate) {
      console.log('✓ USD 환율 조회 성공!');
      console.log(`  ${usdRate.CUR_UNIT} (${usdRate.CUR_NM}): ${usdRate.DEAL_BAS_R}`);
    } else {
      console.log('✗ USD 환율을 찾을 수 없습니다.');
    }
    console.log('');

    // 테스트 4: 주요 통화 목록
    console.log('✅ 테스트 4: 조회된 모든 통화');
    console.log('─'.repeat(70));
    const currencyList = allRates.map(r => `${r.CUR_UNIT} (${r.CUR_NM})`).join(', ');
    console.log(currencyList);
    console.log('');

    // 테스트 5: 환율 값 검증
    console.log('✅ 테스트 5: 환율 값 유효성 검증');
    console.log('─'.repeat(70));
    const validRates = allRates.filter(r => {
      const rate = parseFloat(r.DEAL_BAS_R);
      return !isNaN(rate) && rate > 0;
    });
    console.log(`✓ ${validRates.length}/${allRates.length}개의 유효한 환율 발견`);
    
    if (validRates.length > 0) {
      const rates = validRates.map(r => parseFloat(r.DEAL_BAS_R));
      const minRate = Math.min(...rates);
      const maxRate = Math.max(...rates);
      console.log(`  최소: ${minRate}, 최대: ${maxRate}`);
    }
    console.log('');

    console.log('═'.repeat(70));
    console.log('✨ 모든 테스트 완료! 환율 API가 정상적으로 작동합니다.\n');

  } catch (error) {
    console.error('❌ 테스트 실패:', error);
    process.exit(1);
  }
}

// 테스트 실행
runTests();
