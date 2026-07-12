import React from 'react';
import { Text, View, ScrollView, Linking, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { TopBar } from '@/components';

const PRIVACY_POLICY_URL =
    'https://snapdragon-rugby-6ee.notion.site/PLI-38edce13c56480388dccfba33401b024?pvs=74';

export const PrivacyPolicyScreen: React.FC = () => {
    const navigation = useNavigation();

    const handleOpenPrivacyPolicySite = () => {
        Linking.openURL(PRIVACY_POLICY_URL);
    };

    const requiredSignUpItems = ['아이디', '닉네임', '비밀번호', '이름', '생년월일', '성별', '국가', '이메일 주소'];
    const optionalSignUpItems = ['프로필 이미지', '마케팅 정보 수신 동의', '야간 마케팅 정보 수신 동의'];
    const socialLoginItems = [
        '카카오: 카카오 계정 식별자(CI), 이메일(선택), 닉네임, 프로필 이미지',
        '네이버: 네이버 계정 식별자(CI), 이메일, 이름(선택), 프로필 이미지(선택)',
        '구글: Google 계정 식별자, 이메일, 이름, 프로필 이미지',
    ];
    const autoCollectedItems = [
        '위치정보: GPS 기반 현재 위치(서비스 이용 시에만 수집, 상시 수집 없음)',
        '기기정보: OS 종류·버전, 기기 고유 식별자(UUID), 앱 버전, 푸시 토큰',
        '서비스 이용기록: 여행 플랜 조회·생성·수정 이력, 앱 내 검색 기록',
        '메시지: 앱 내 친구·그룹 간 여행 플랜 공유 메시지',
        '갤러리(사진/미디어): 이용자가 직접 업로드하는 프로필 이미지 및 여행 사진(이용자 허용 시에만 접근)',
        '알림 권한: 여행 플랜 공유 알림, 서비스 업데이트 등 푸시 알림 발송 목적으로 수집(이용자 허용 시에만 발송)',
    ];

    const purposeItems = [
        '회원 식별 및 인증: 아이디, 이메일, 소셜 계정 식별자, 비밀번호(암호화), 이름, 생년월일, 성별, 국가',
        '여행 플랜 서비스 제공: 위치정보, 지도 이용 내역, 플랜 생성·공유 기록',
        '친구/그룹 기능: 닉네임, 프로필 이미지, 메시지',
        '고객 지원: 이메일, 기기정보, 서비스 이용기록',
        '불법·어뷰징 방지: 기기정보, 서비스 이용기록',
        '서비스 개선 및 통계: 익명화된 이용 패턴(개인 식별 불가)',
        '마케팅 및 홍보: 이메일, 닉네임(마케팅·야간 마케팅 수신 동의자에 한함, 동의 철회 시 즉시 중단)',
    ];

    const internalRetentionItems = [
        '회원 정보: 회원 탈퇴 후 30일(이후 즉시 삭제, 단 법령에 따른 보존 기간 예외)',
        '위치정보: 이용 즉시 삭제(서버 저장 없음, 단말 내 임시 이용 후 폐기)',
        '여행 플랜 데이터: 탈퇴 후 30일(복구 요청 기간)',
        '메시지: 읽음 처리 후 90일 보관 후 삭제',
    ];
    const legalRetentionItems = [
        '계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래 등에서의 소비자 보호에 관한 법률)',
        '소비자 불만 또는 분쟁 처리 기록: 3년 (위 법률)',
        '접속 로그 및 접속 IP: 3개월 (통신비밀보호법)',
    ];

    const thirdPartyItems = [
        '이용자가 사전에 동의한 경우',
        '법령의 규정에 의거하거나 수사·조사 목적으로 법령에 정해진 절차에 따라 요청된 경우',
        '여행 플랜 공유 기능 이용 시, 이용자가 직접 지정한 친구·그룹에 한해 플랜 내용 공유',
    ];

    const outsourcingItems = [
        'Google Maps Platform: 지도 서비스 제공',
        '카카오, 네이버, Google: 소셜 로그인 인증(각 사 개인정보처리방침 적용)',
        'Firebase (Google): 푸시 알림 발송',
    ];

    const locationItems = [
        '현재 위치 정보는 주변 여행지 추천, 경로 안내 목적으로만 사용됩니다.',
        '위치정보는 서버에 별도 저장되지 않으며, 기능 실행 후 즉시 폐기됩니다.',
        '이용자는 기기 설정에서 위치 권한을 언제든지 철회할 수 있습니다. 단, 일부 기능 이용이 제한될 수 있습니다.',
        '「위치정보의 보호 및 이용 등에 관한 법률」에 따라 위치정보 이용·제공 사실을 이용자에게 고지합니다.',
    ];

    const rightsItems = [
        '개인정보 열람·정정·삭제 요청: 앱 내 [설정 > 내 정보 관리] 또는 개인정보보호 담당자 이메일',
        '개인정보 처리 정지 요청: 개인정보보호 담당자에게 서면, 이메일로 요청',
        '회원 탈퇴: 앱 내 [설정 > 회원 탈퇴] 메뉴에서 즉시 처리',
    ];

    const destructionItems = [
        '전자적 파일: 복구 불가능한 방법으로 영구 삭제',
        '서면·출력물: 파쇄 또는 소각',
    ];

    // 불릿 리스트 렌더링 함수 (재사용)
    const renderBulletList = (items: string[]) => {
        return items.map((item, index) => (
            <View key={index} className="flex-row items-start ml-2 mb-1">
                {/* 주황색 동그라미 */}
                <View className="w-[6px] h-[6px] mt-[8px] mr-3.5 rounded-full bg-main " />
                {/* 텍스트 */}
                <Text className="flex-1 text-p1 text-zero font-pretendardMedium ">
                    {item}
                </Text>
            </View>
        ));
    };

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            {/* TopBar 제목도 시안에 맞게 변경 */}
            <TopBar title="개인정보 처리방침" onPress={() => navigation.goBack()} />

            {/* 스크롤 가능한 본문 영역 */}
            <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>

                {/* 인트로 */}
                <View className="mb-6">
                    <Pressable onPress={handleOpenPrivacyPolicySite}>
                        <Text className="text-h2 font-pretendardSemiBold text-[#1D4ED8] underline mb-3">
                            개인정보 처리방침
                        </Text>
                    </Pressable>
                    <Text className="text-p1 text-gray font-pretendardRegular">
                        플리(이하 “회사”)는 이용자의 개인정보를 매우 중요하게 생각하며, 「개인정보 보호법」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등 관련 법령을 준수합니다.{'\n'}
                        본 방침은 회사가 제공하는 여행 플랜 서비스 앱(이하 “서비스”)에서 수집하는 개인정보의 처리 목적, 항목, 보유기간, 제3자 제공 여부 등에 대해 안내합니다.{'\n\n'}
                        시행일: 2026년 06월 30일
                    </Text>
                </View>

                {/* 1. 수집하는 개인정보 항목 */}
                <View className="mb-6">
                    <Text className="text-h3 font-pretendardSemiBold text-black mb-2">
                        1. 수집하는 개인정보 항목 및 수집 방법
                    </Text>

                    <Text className="text-p1 font-pretendardSemiBold text-black mb-1">
                        회원가입 시 수집 항목 (필수)
                    </Text>
                    {renderBulletList(requiredSignUpItems)}

                    <Text className="text-p1 font-pretendardSemiBold text-black mb-1 mt-3">
                        회원가입 시 수집 항목 (선택)
                    </Text>
                    {renderBulletList(optionalSignUpItems)}

                    <Text className="text-p1 font-pretendardSemiBold text-black mb-1 mt-3">
                        소셜 로그인 (카카오·네이버·구글)
                    </Text>
                    {renderBulletList(socialLoginItems)}

                    <Text className="text-p1 font-pretendardSemiBold text-black mb-1 mt-3">
                        서비스 이용 중 자동 수집 항목
                    </Text>
                    {renderBulletList(autoCollectedItems)}

                    <Text className="text-p1 text-gray font-pretendardRegular mt-3">
                        위치정보와 갤러리(사진/미디어)는 이용자가 앱 내 권한을 허용한 경우에만 수집·접근하며, 알림은 이용자가 알림 권한을 허용한 경우에만 발송됩니다.
                    </Text>
                </View>

                {/* 2. 개인정보 수집 및 이용 목적 */}
                <View className="mb-6">
                    <Text className="text-h3 font-pretendardSemiBold text-black mb-2">
                        2. 개인정보의 수집 및 이용 목적
                    </Text>
                    {renderBulletList(purposeItems)}
                </View>

                {/* 3. 개인정보 보유 및 이용 기간 */}
                <View className="mb-6">
                    <Text className="text-h3 font-pretendardSemiBold text-black mb-2">
                        3. 개인정보의 보유 및 이용기간
                    </Text>
                    <Text className="text-p1 text-gray font-pretendardRegular mb-3">
                        회사는 개인정보 수집·이용 목적이 달성되면 지체 없이 파기합니다. 단, 아래의 경우 해당 기간 동안 보유합니다.
                    </Text>

                    <Text className="text-p1 font-pretendardSemiBold text-black mb-1">
                        회사 내부 보유 기준
                    </Text>
                    {renderBulletList(internalRetentionItems)}

                    <Text className="text-p1 font-pretendardSemiBold text-black mb-1 mt-3">
                        관계 법령에 따른 보유
                    </Text>
                    {renderBulletList(legalRetentionItems)}
                </View>

                {/* 4. 개인정보의 제3자 제공 */}
                <View className="mb-6">
                    <Text className="text-h3 font-pretendardSemiBold text-black mb-2">
                        4. 개인정보의 제3자 제공
                    </Text>
                    <Text className="text-p1 text-gray font-pretendardRegular mb-3">
                        회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 아래의 경우는 예외로 합니다.
                    </Text>
                    {renderBulletList(thirdPartyItems)}
                </View>

                {/* 5. 개인정보 처리 위탁 */}
                <View className="mb-6">
                    <Text className="text-h3 font-pretendardSemiBold text-black mb-2">
                        5. 개인정보 처리 위탁
                    </Text>
                    {renderBulletList(outsourcingItems)}
                    <Text className="text-p1 text-gray font-pretendardRegular mt-3">
                        수탁업체가 위탁받은 업무 범위를 벗어나 개인정보를 이용하거나 제3자에게 제공하지 않도록 관리·감독합니다.
                    </Text>
                </View>

                {/* 6. 위치정보 처리 */}
                <View className="mb-6">
                    <Text className="text-h3 font-pretendardSemiBold text-black mb-2">
                        6. 위치정보 처리
                    </Text>
                    {renderBulletList(locationItems)}
                </View>

                {/* 7. 이용자의 권리 및 행사 방법 */}
                <View className="mb-6">
                    <Text className="text-h3 font-pretendardSemiBold text-black mb-2">
                        7. 이용자의 권리 및 행사 방법
                    </Text>
                    <Text className="text-p1 text-gray font-pretendardRegular mb-3">
                        이용자는 언제든지 아래의 권리를 행사할 수 있습니다.
                    </Text>
                    {renderBulletList(rightsItems)}
                    <Text className="text-p1 text-gray font-pretendardRegular mt-3">
                        ※ 만 14세 미만 아동의 경우 법정대리인이 동의·열람·정정·삭제 요청을 할 수 있습니다.
                    </Text>
                </View>

                {/* 8. 개인정보의 파기 */}
                <View className="mb-6">
                    <Text className="text-h3 font-pretendardSemiBold text-black mb-2">
                        8. 개인정보의 파기
                    </Text>
                    <Text className="text-p1 text-gray font-pretendardRegular mb-3">
                        개인정보 보유기간이 경과하거나 처리 목적이 달성된 경우 아래 방법으로 파기합니다.
                    </Text>
                    {renderBulletList(destructionItems)}
                </View>

                {/* 9. 개인정보 보호책임자 및 연락처 */}
                <View className="mb-6">
                    <Text className="text-h3 font-pretendardSemiBold text-black mb-2">
                        9. 개인정보 보호책임자 및 연락처
                    </Text>
                    <Text className="text-p1 text-gray font-pretendardRegular leading-6">
                        성명: 김도현 (개인정보 보호책임자){'\n'}
                        직책: 개인 개발자 (1인 운영){'\n'}
                        이메일: marssidestory@gmail.com{'\n'}
                        전화: 이메일로 문의 (1인 개발, 전화 미운영){'\n\n'}
                        이용자는 개인정보 관련 문의, 열람 요청, 침해 구제를 위해 아래 기관에도 신고·상담할 수 있습니다.{'\n'}
                        개인정보침해신고센터: privacy.kisa.or.kr / 전화 118{'\n'}
                        국민권익위원회: www.acrc.go.kr / 전화 1398
                    </Text>
                </View>

                {/* 10. 개인정보 처리방침 변경 */}
                <View className="mb-10">
                    <Text className="text-h3 font-pretendardSemiBold text-black mb-2">
                        10. 개인정보 처리방침 변경
                    </Text>
                    <Text className="text-p1 text-gray font-pretendardRegular">
                        본 방침은 법령·정책 변경에 따라 업데이트될 수 있으며, 변경 시 앱 내 공지 또는 이메일로 7일 전에 안내합니다.{'\n\n'}
                        공고일: 2026년 06월 30일{'\n'}
                        시행일: 2026년 06월 30일
                    </Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

PrivacyPolicyScreen.displayName = 'PrivacyPolicyScreen';

export default PrivacyPolicyScreen;
