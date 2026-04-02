import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { TopBar } from '@/components';



export const MarketingConsentScreen: React.FC = () => {
    const navigation = useNavigation();

    const oneItems = ['신규 서비스 안내', '여행 관련 콘텐츠 및 추천 정보 제공', '이벤트 및 프로모션 안내', '할인 및 혜택 정보 제공'];
    const twoItems = [
        '이메일',
        '앱 푸시 알림',

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
            <TopBar title="마케팅 정보 수신 동의" onPress={() => navigation.goBack()} />

            {/* 스크롤 가능한 본문 영역 */}
            <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>

                {/* 인트로 */}
                <View className="mb-6">
                    <Text className="text-h2 font-pretendardSemiBold text-black mb-3">
                        마케팅 정보 수신 동의
                    </Text>
                    <Text className="text-p1 text-gray font-pretendardRegular">
                        본 앱은 이용자에게 다양한 혜택 및 서비스 정보를 제공하기 위해 마케팅 정보를 발송할 수 있습니다. 아래 내용을 확인하시고 동의 여부를 선택해주시기 바랍니다.
                    </Text>
                </View>

                {/* 1. 수집하는 개인정보 항목 */}
                <View className="mb-6">
                    <Text className="text-h3 font-pretendardSemiBold text-black mb-3">
                        1. 수집 및 이용 목적
                    </Text>

                    {/* 배열 매핑 렌더링 */}
                    {renderBulletList(oneItems)}
                </View>

                {/* 2. 개인정보 수집 및 이용 목적 */}
                <View className="mb-6">
                    <Text className="text-h3 font-pretendardSemiBold text-black mb-3">
                        2. 수신 방법
                    </Text>

                    {/* 배열 매핑 렌더링 */}
                    {renderBulletList(twoItems)}
                </View>

                {/* 3. 개인정보 보유 및 이용 기간 */}
                <View className="mb-6">
                    <Text className="text-h3 font-pretendardSemiBold text-black mb-2">
                        3. 보유 및 이용 기간
                    </Text>
                    <Text className="text-p1 text-gray font-pretendardMedium">
                        마케팅 정보 수신 동의일로부터 회원 탈퇴 시 또는 동의 철회 시까지 보유 및 이용됩니다.
                    </Text>
                </View>

                {/* 4. 동의 거부 권리 안내 */}
                <View className="mb-10">
                    <Text className="text-h3 font-pretendardSemiBold text-black mb-2">
                        4. 동의 거부에 따른 안내
                    </Text>
                    <Text className="text-p1 text-gray font-pretendardRegular">
                        이용자는 마케팅 정보 수신 동의를 거부할 권리가 있습니다. 단, 동의하지 않을 경우 이벤트, 혜택, 프로모션, 광고성 푸시 알림 및 안내 메일 등 마케팅 정보 수신이 제한될 수 있습니다
                    </Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

MarketingConsentScreen.displayName = 'MarketingConsentScreen';

export default MarketingConsentScreen;