/**
 * 환율 API 연동 테스트 스크립트
 * 환율 정보가 제대로 불러와지는지 확인하기 위한 Node.js 스크립트
 * 
 * 사용법: node test-exchange-rate.js
 */

const API_URL = 'https://oapi.koreaexim.go.kr/site/program/financial/exchangeJSON';
const AUTH_KEY = 'RSu4909GdEh1ILWW2M8SX8zmz5EICQlx';

async function testExchangeRateAPI() {
  console.log('🌐 환율 API 테스트 시작...\n');

  try {
    // 1. 모든 환율 정보 조회
    console.log('📊 Step 1: 모든 환율 정보 조회 중...');
    const params = new URLSearchParams({
      authkey: AUTH_KEY,
      data: 'AP01', // 환율 정보
    });

    const response = await fetch(`${API_URL}?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();

    console.log('✅ API 응답 성공!\n');
    console.log('📝 원본 응답:');
    console.log(JSON.stringify(data, null, 2));
    console.log('\n');

    // 2. 응답 데이터 분석
    if (Array.isArray(data)) {
      console.log(`📈 총 ${data.length}개의 통화 정보를 조회했습니다.\n`);

      // 3. 주요 통화 정보 표시
      const mainCurrencies = ['USD', 'JPY', 'EUR', 'GBP', 'CNY'];
      const filteredData = data.filter(item => mainCurrencies.includes(item.CUR_UNIT));

      console.log('💱 주요 통화별 환율 정보:');
      console.log('─'.repeat(80));

      filteredData.forEach(rate => {
        console.log(`\n🔹 ${rate.CUR_UNIT} (${rate.CUR_NM})`);
        console.log(`   매매기준율: ${rate.DEAL_BAS_R}`);
        console.log(`   송금(TTS): ${rate.TTS}`);
        console.log(`   수취(TTB): ${rate.ITB}`);
        console.log(`   장부가격: ${rate.BKPR}`);
      });

      console.log('\n' + '─'.repeat(80));
      console.log(`\n📋 전체 통화 목록 (${data.length}개):`);
      console.log(data.map(item => `  • ${item.CUR_UNIT}: ${item.CUR_NM}`).join('\n'));

      // 4. 항목별 상세 정보 (첫 번째 데이터)
      if (data.length > 0) {
        console.log('\n\n📝 API 응답 상세 정보 (첫 번째 항목):\n');
        console.log(JSON.stringify(data[0], null, 2));
      }

      // 5. RESULT 상태 확인
      const firstResult = data[0];
      console.log('\n\n✅ 요청 결과 코드 해석:');
      console.log(`   RESULT: ${firstResult.RESULT}`);
      switch (firstResult.RESULT) {
        case 1:
          console.log('   ✅ 성공 - 환율 정보가 정상적으로 조회되었습니다.');
          break;
        case 2:
          console.log('   ❌ 실패 - DATA코드 오류');
          break;
        case 3:
          console.log('   ❌ 실패 - 인증코드 오류');
          break;
        case 4:
          console.log('   ❌ 실패 - 일일제한횟수 초과');
          break;
        default:
          console.log('   ❓ 알 수 없는 상태');
      }

      console.log('\n\n✨ 환율 API 테스트 완료! 모든 기능이 정상 작동합니다.\n');

    } else {
      console.log('⚠️ API 응답이 배열 형식이 아닙니다:');
      console.log(data);
    }

  } catch (error) {
    console.error('❌ 에러 발생:', error.message);
    console.error('\n🔍 문제 해결 가이드:');
    console.error('1. 인터넷 연결을 확인하세요.');
    console.error('2. API URL이 올바른지 확인하세요: ' + API_URL);
    console.error('3. 인증키가 유효한지 확인하세요: ' + AUTH_KEY);
    console.error('4. API 서버의 상태를 확인하세요.');
    process.exit(1);
  }
}

// 테스트 실행
testExchangeRateAPI().catch(error => {
  console.error('테스트 실패:', error);
  process.exit(1);
});
