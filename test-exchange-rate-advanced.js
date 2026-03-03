/**
 * 환율 API 고급 테스트 스크립트
 * 다양한 요청 방식으로 API 연동을 테스트합니다.
 */

const API_URL = 'https://oapi.koreaexim.go.kr/site/program/financial/exchangeJSON';
const AUTH_KEY = 'RSu4909GdEh1ILWW2M8SX8zmz5EICQlx';

async function testWithDifferentMethods() {
  console.log('🌐 환율 API 고급 테스트 시작...\n');

  // 방법 1: 기본 요청
  console.log('📍 방법 1: 기본 요청 (파라미터 없음)');
  console.log('─'.repeat(60));
  try {
    const params1 = new URLSearchParams({
      authkey: AUTH_KEY,
      data: 'AP01',
    });
    console.log('요청 URL:', `${API_URL}?${params1.toString()}`);
    
    const response1 = await fetch(`${API_URL}?${params1.toString()}`);
    const data1 = await response1.json();
    console.log('응답:', Array.isArray(data1) ? `배열 (길이: ${data1.length})` : typeof data1);
    console.log('데이터:', JSON.stringify(data1).substring(0, 200));
  } catch (error) {
    console.error('에러:', error.message);
  }
  console.log('\n');

  // 방법 2: searchdate 파라미터 추가
  console.log('📍 방법 2: searchdate 파라미터 추가 (YYYYMMDD 형식)');
  console.log('─'.repeat(60));
  try {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
    
    const params2 = new URLSearchParams({
      authkey: AUTH_KEY,
      data: 'AP01',
      searchdate: dateStr,
    });
    console.log('요청 URL:', `${API_URL}?${params2.toString()}`);
    console.log('조회 날짜:', dateStr);
    
    const response2 = await fetch(`${API_URL}?${params2.toString()}`);
    const data2 = await response2.json();
    console.log('응답:', Array.isArray(data2) ? `배열 (길이: ${data2.length})` : typeof data2);
    if (Array.isArray(data2) && data2.length > 0) {
      console.log('첫 항목:', JSON.stringify(data2[0], null, 2).substring(0, 300));
    }
  } catch (error) {
    console.error('에러:', error.message);
  }
  console.log('\n');

  // 방법 3: 어제 날짜로 요청
  console.log('📍 방법 3: 어제 날짜로 요청');
  console.log('─'.repeat(60));
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split('T')[0].replace(/-/g, '');
    
    const params3 = new URLSearchParams({
      authkey: AUTH_KEY,
      data: 'AP01',
      searchdate: dateStr,
    });
    console.log('요청 URL:', `${API_URL}?${params3.toString()}`);
    console.log('조회 날짜:', dateStr);
    
    const response3 = await fetch(`${API_URL}?${params3.toString()}`);
    const data3 = await response3.json();
    console.log('응답:', Array.isArray(data3) ? `배열 (길이: ${data3.length})` : typeof data3);
    if (Array.isArray(data3) && data3.length > 0) {
      console.log('첫 항목:', JSON.stringify(data3[0], null, 2).substring(0, 300));
    }
  } catch (error) {
    console.error('에러:', error.message);
  }
  console.log('\n');

  // 방법 4: 특정 날짜로 요청 (예: 2023-01-01)
  console.log('📍 방법 4: 특정 과거 날짜로 요청 (2023-01-01)');
  console.log('─'.repeat(60));
  try {
    const params4 = new URLSearchParams({
      authkey: AUTH_KEY,
      data: 'AP01',
      searchdate: '20230101',
    });
    console.log('요청 URL:', `${API_URL}?${params4.toString()}`);
    
    const response4 = await fetch(`${API_URL}?${params4.toString()}`);
    const data4 = await response4.json();
    console.log('응답:', Array.isArray(data4) ? `배열 (길이: ${data4.length})` : typeof data4);
    if (Array.isArray(data4) && data4.length > 0) {
      console.log('\n✅ 성공! 환율 정보:');
      data4.slice(0, 3).forEach(rate => {
        console.log(`  ${rate.CUR_UNIT} (${rate.CUR_NM}): 기준율 ${rate.DEAL_BAS_R}`);
      });
      console.log(`  ... 외 ${data4.length - 3}개`);
    }
  } catch (error) {
    console.error('에러:', error.message);
  }
  console.log('\n');

  console.log('─'.repeat(60));
  console.log('✨ API 테스트 완료!\n');
  console.log('📌 주의사항:');
  console.log('  • API는 평일 영업시간(09:00~16:30)에만 환율 정보를 업데이트합니다.');
  console.log('  • 주말이나 공휴일에는 전일 환율 정보를 반환할 수 있습니다.');
  console.log('  • 특정 날짜의 과거 데이터는 항상 조회 가능합니다.\n');
}

testWithDifferentMethods();
