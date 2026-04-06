import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { HomeStackParamList } from '@/navigation';
import type { RootStackParamList } from '@/navigation';
import Animated, { useSharedValue, withTiming, useAnimatedStyle, interpolate } from 'react-native-reanimated';
import CustomBottomSheet from '@/components/ui/CustomBottomSheet';
import { RobotIcon, SendIcon, X } from '@/assets/icons';
import { COLORS } from '@/constants/colors';
import { ChatCaseContent } from '@/screens/home/components';
import {
  CHAT_HEADER_HEIGHT,
  CHAT_INPUT_BOTTOM_SPACING,
  CHAT_INPUT_RADIUS,
  CHAT_SEND_BUTTON_SIZE,
  CHAT_SHEET_HEIGHT,
} from '@/screens/home/constants';

// ============ Types ============
type NavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const translateY = useSharedValue(CHAT_SHEET_HEIGHT);
  const SNAP_MIN = CHAT_SHEET_HEIGHT;
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatCaseOrder, setChatCaseOrder] = useState(-1);
  const currentCaseIndex = chatCaseOrder < 0 ? 0 : chatCaseOrder;

  const handleNavigateToDetail = useCallback(() => {
    navigation.navigate('Alert');
  }, [navigation]);

  const handleOpenChat = useCallback(() => {
    setChatCaseOrder((prev) => (prev + 1) % 3);
    translateY.value = withTiming(0, { duration: 350 });
  }, [translateY]);

  const handleCloseChat = useCallback(() => {
    translateY.value = withTiming(SNAP_MIN, { duration: 300 });
  }, [translateY, SNAP_MIN]);

  const backdropStyle = useAnimatedStyle(() => {
    const opacity = interpolate(translateY.value, [0, SNAP_MIN], [1, 0]);
    return { opacity };
  }, [translateY, SNAP_MIN]);

  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <View className="flex-1 items-center justify-center">
        <Text className="text-h1 font-pretendardBold text-black">홈</Text>
        <TouchableOpacity
          onPress={handleNavigateToDetail}
          className="bg-main px-6 py-3 rounded-lg">
          <Text className="text-white font-pretendardSemiBold">알림 리스트</Text>
        </TouchableOpacity>
      </View>

      {/* 배경 오버레이 */}
      <Animated.View
        pointerEvents={isChatOpen ? 'auto' : 'none'}
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          },
          backdropStyle,
        ]}
      >
        <Pressable style={{ flex: 1 }} onPress={handleCloseChat} />
      </Animated.View>

      {/* 채팅 플로팅 버튼 */}
      {/* TODO: 재원님 여기 만드시면 돼요 */}
      <TouchableOpacity
        onPress={handleOpenChat}
        className="absolute bottom-6 right-6 bg-main rounded-full px-5 py-4"
      >
        <Text className="text-white font-pretendardSemiBold">채팅</Text>
      </TouchableOpacity>

      {/* 채팅 바텀시트 */}
      <CustomBottomSheet
        translateY={translateY}
        height={CHAT_SHEET_HEIGHT}
        collapsedVisibleHeight={0}
        cornerRadius={12}
        backgroundColor="#FFFFFF"
        onStateChange={setIsChatOpen}
        showIndicator={false}
      >
        {/* 바텀시트 헤더 */}
        <View
          className="absolute top-0 left-0 right-0 bg-white px-4 flex-row items-center justify-center"
          style={{ height: CHAT_HEADER_HEIGHT }}
        >
          <View className="absolute left-4 flex-row items-center">
            <View className="w-8 h-8 rounded-full bg-chatHeaderCircleBackground items-center justify-center">
              <RobotIcon width={20} height={20} />
            </View>
            <View className="ml-[7px]">
              <Text className="text-h3 text-black font-pretendardSemiBold">Pli AI</Text>
              <Text className="text-p text-gray">여행 계획을 도와드려요</Text>
            </View>
          </View>
          <Pressable
            onPress={handleCloseChat}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            className="absolute right-4 w-8 h-8 rounded-full bg-chatHeaderCircleBackground items-center justify-center"
          >
            <X width={14} height={14} />
          </Pressable>
          <View className="absolute bottom-0 left-0 right-0 h-px bg-borderGray" />
        </View>

        {/* 헤더 아래 콘텐츠 영역 */}
        <View className="flex-1" style={{ marginTop: CHAT_HEADER_HEIGHT }}>
          {/* 케이스별 콘텐츠 */}
          <ChatCaseContent currentCaseIndex={currentCaseIndex} />

          {/* 하단 입력창 */}
          <View
            className="absolute left-0 right-0 px-4 flex-row items-center"
            style={{ bottom: CHAT_INPUT_BOTTOM_SPACING }}
          >
            <TextInput
              placeholder="AI에게 질문해보세요"
              placeholderTextColor={COLORS.gray}
              className="flex-1 h-12 border border-borderGray px-4 text-p1 text-black"
              style={{ borderRadius: CHAT_INPUT_RADIUS }}
            />
            <View
              className="ml-3 rounded-full bg-main items-center justify-center"
              style={{ width: CHAT_SEND_BUTTON_SIZE, height: CHAT_SEND_BUTTON_SIZE }}
            >
              <SendIcon width={24} height={24} />
            </View>
          </View>
        </View>
      </CustomBottomSheet>
    </SafeAreaView>
  );
};
export default HomeScreen;
export { HomeScreen };