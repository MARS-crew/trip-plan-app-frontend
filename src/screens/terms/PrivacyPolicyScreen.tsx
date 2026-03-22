import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { TopBar } from '@/components';



export const PrivacyPolicyScreen: React.FC = () => {
    const navigation = useNavigation();

    const oneItems = ['이름', '닉네임', '성별', '국가', '이메일 주소'];
    const twoItems = [
        '회원 식별 및 계정 관리',
        '서비스 이용에 따른 본인 확인',
        '여행 일정 기록 및 사용자 맞춤 서비스 제공',
        '서비스 관련 공지 및 안내 전달',
        '고객 문의 대응 및 서비스 개선',
    ];

    // 불릿 리스트 렌더링 함수 (재사용)
    const renderBulletList = (items: string[]) => {
        return items.map((item, index) => (
            <View key={index} className="flex-row items-start ml-2 mb-1">
                {/* 주황색 동그라미 */}
                <View className="w-[6px] h-[6px] mt-[8px] mr-3.5 rounded-full bg-main " />
                {/* 텍스트 */}
                <Text className="flex-1 text-p1 text-zero font-medium ">
                    {item}
                </Text>
            </View>
        ));
    };

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            {/* TopBar 제목도 시안에 맞게 변경 */}
            <TopBar title="개인정보 수집 및 이용 동의" onPress={() => navigation.goBack()} />

            {/* 스크롤 가능한 본문 영역 */}
            <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>

                {/* 인트로 */}
                <View className="mb-6">
                    <Text className="text-h2 font-semibold text-black mb-3">
                        개인정보 수집 및 이용 동의
                    </Text>
                    <Text className="text-p1 text-gray font-regular">
                        본 앱은 서비스 제공을 위해 아래와 같이 개인정보를 수집 및 이용합니다.{'\n'}
                        내용을 충분히 확인하신 후 동의 여부를 결정해 주시기 바랍니다.
                    </Text>
                </View>

                {/* 1. 수집하는 개인정보 항목 */}
                <View className="mb-6">
                    <Text className="text-h3 font-semibold text-black mb-2">
                        1. 수집하는 개인정보 항목
                    </Text>
                    <Text className="text-p1 text-gray font-regular leading-6 mb-3">
                        본 앱은 회원가입 및 서비스 이용을 위해 다음과 같은 개인정보를 수집합니다.
                    </Text>
                    {/* 배열 매핑 렌더링 */}
                    {renderBulletList(oneItems)}
                </View>

                {/* 2. 개인정보 수집 및 이용 목적 */}
                <View className="mb-6">
                    <Text className="text-h3 font-semibold text-black mb-2">
                        2. 개인정보 수집 및 이용 목적
                    </Text>
                    <Text className="text-p1 text-gray font-medium mb-3">
                        수집된 개인정보를 다음의 목적을 위해 사용됩니다.
                    </Text>
                    {/* 배열 매핑 렌더링 */}
                    {renderBulletList(twoItems )}
                </View>

                {/* 3. 개인정보 보유 및 이용 기간 */}
                <View className="mb-6">
                    <Text className="text-h3 font-semibold text-black mb-2">
                        3. 개인정보 보유 및 이용 기간
                    </Text>
                    <Text className="text-p1 text-gray font-medium">
                        수집된 개인정보는 회원 탈퇴 시까지 보유 및 이용되며, 회원 탈퇴 시 관련 법령에 따라 보관이 필요한 경우를 제외하고는 지체 없이 파기됩니다.
                    </Text>
                </View>

                {/* 4. 동의 거부 권리 안내 */}
                <View className="mb-10">
                    <Text className="text-h3 font-semibold text-black mb-2">
                        4. 동의 거부 권리 안내
                    </Text>
                    <Text className="text-p1 text-gray font-regular">
                        이용자는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있습니다. 단, 필수 정보 수집에 동의하지 않을 경우 회원가입 및 서비스 이용 제한이 될 수 있습니다.
                    </Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

PrivacyPolicyScreen.displayName = 'PrivacyPolicyScreen';

export default PrivacyPolicyScreen;