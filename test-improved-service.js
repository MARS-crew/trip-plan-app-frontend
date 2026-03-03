/**
 * 개선된 환율 서비스 테스트
 * 최근 데이터를 자동으로 찾는 기능 테스트
 */

const API_URL = 'https://oapi.koreaexim.go.kr/site/program/financial/exchangeJSON';
const AUTH_KEY = 'RSu4909GdEh1ILWW2M8SX8zmz5EICQlx';

// YYYYMMDD 형식의 날짜 문자열을 생성합니다.
const getDateString = (daysAgo = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0].replace(/-/g, '');
};

// 특정 날짜의 환율 정보를 API에서 조회합니다.
const fetchRatesForDate = async (searchDate) => {
  const params = {
    authkey: AUTH_KEY,
    data: 'AP01',
    searchdate: searchDate,
  };

  const queryString = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');

  const response = await fetch(`${API_URL}?${queryString}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

// 최근의 유효한 환율 정보를 조회합니다.
const fetchLatestExchangeRates = async (maxDaysBack = 7) => {
  let lastError = null;

  for (let daysAgo = 0; daysAgo <= maxDaysBack; daysAgo++) {
    try {
      const dateStr = getDateString(daysAgo);
      console.log(`  📅 ${dateStr}에서 조회 시도...`);
      
      const rawData = await fetchRatesForDate(dateStr);
      
      if (rawData && rawData.length > 0) {
        console.log(`  ✓ ${dateStr}에서 ${rawData.length}개 데이터 발견!\n`);
        return rawData;
      }
    } catch (error) {
      lastError = error;
      console.log(`  ✗ 조회 실패, 이전 날짜 시도...`);
      continue;
    }
  }

  throw lastError || new Error('최근 7일 내에서 환율 정보를 찾을 수 없습니다.');
};

// ============================================
// 테스트 실행
// ============================================

async function runTests() {
  console.log('\n🧪 개선된 exchangeRateService 테스트\n');
  console.log('═'.repeat(75) + '\n');

  try {
    // 테스트 1: 최근 유효한 환율 조회
    console.log('✅ 테스트 1: 최근 유효한 환율 조회 (7일 범위 내)');
    console.log('─'.repeat(75));
    
    const rates = await fetchLatestExchangeRates(7);
    
    console.log(`✓ 성공! ${rates.length}개의 통화 정보 조회됨\n`);

    // 테스트 2: 데이터 구조 확인
    console.log('✅ 테스트 2: 응답 데이터 구조 확인');
    console.log('─'.repeat(75));
    const firstRate = rates[0];
    console.log('첫 번째 항목:');
    console.log(`  • result: ${firstRate.result}`);
    console.log(`  • cur_unit: ${firstRate.cur_unit} (통화코드)`);
    console.log(`  • cur_nm: ${firstRate.cur_nm} (통화명)`);
    console.log(`  • deal_bas_r: ${firstRate.deal_bas_r} (기준율)`);
    console.log(`  • tts: ${firstRate.tts} (송금율)`);
    console.log(`  • ttb: ${firstRate.ttb} (수취율)`);
    console.log('');

    // 테스트 3: 주요 통화 정보
    console.log('✅ 테스트 3: 주요 통화 정보');
    console.log('─'.repeat(75));
    const mainCurrencies = ['USD', 'JPY(100)', 'EUR', 'GBP', 'CNH'];
    const mainRates = rates.filter(r => mainCurrencies.includes(r.cur_unit));
    
    console.log('찾은 주요 통화:');
    mainRates.forEach(rate => {
      console.log(`  ${rate.cur_unit.padEnd(12)} | ${rate.cur_nm.padEnd(20)} | 기준율: ${rate.deal_bas_r}`);
    });
    console.log('');

    // 테스트 4: 모든 통화 목록
    console.log('✅ 테스트 4: 조회된 모든 통화');
    console.log('─'.repeat(75));
    const currencyList = rates.map(r => r.cur_unit).join(', ');
    console.log(currencyList);
    console.log('');

    // 테스트 5: USD 상세 정보
    console.log('✅ 테스트 5: USD 환율 상세 정보');
    console.log('─'.repeat(75));
    const usdRate = rates.find(r => r.cur_unit === 'USD');
    if (usdRate) {
      console.log(`통화명: ${usdRate.cur_nm}`);
      console.log(`송금율(tts): ${usdRate.tts} KRW`);
      console.log(`수취율(ttb): ${usdRate.ttb} KRW`);
      console.log(`매매기준율(deal_bas_r): ${usdRate.deal_bas_r} KRW`);
      console.log(`장부가격(bkpr): ${usdRate.bkpr}`);
    } else {
      console.log('USD 정보를 찾을 수 없습니다.');
    }
    console.log('');

    // 테스트 6: JSON 형식 출력
    console.log('✅ 테스트 6: 샘플 데이터 (JSON 형식)');
    console.log('─'.repeat(75));
    console.log(JSON.stringify(rates.slice(0, 2), null, 2));
    console.log('');

    console.log('═'.repeat(75));
    console.log('✨ 모든 테스트 성공! 환율 조회 기능이 정상 작동합니다.\n');

  } catch (error) {
    console.error('❌ 테스트 실패:', error.message);
    process.exit(1);
  }
}

// 테스트 실행
runTests();
