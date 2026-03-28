import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, Pressable, TextInput, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Shadow } from 'react-native-shadow-2';
import type { HomeStackParamList } from '@/navigation';
import type { RootStackParamList } from '@/navigation';
import Animated, { useSharedValue, withTiming, useAnimatedStyle, interpolate } from 'react-native-reanimated';
import CustomBottomSheet from '@/components/ui/CustomBottomSheet';
import { ContentContainer } from '@/components/ui';
import Chip from '@/components/ui/Chip';
import { RobotIcon, SendIcon, X, NoticeIcon, NoticeDotIcon, LogoIcon, LogoLetter, ChatIcon } from '@/assets/icons';
import { COLORS } from '@/constants/colors';
import { ChatCaseContent, MainTripCard } from '@/screens/home/components';
import {
  CHAT_HEADER_HEIGHT,
  CHAT_INPUT_BOTTOM_SPACING,
  CHAT_INPUT_RADIUS,
  CHAT_SEND_BUTTON_SIZE,
  CHAT_SHEET_HEIGHT,
} from '@/screens/home/constants';

type NavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

const RECOMMENDED_DESTINATIONS = [
  {
    id: '1',
    title: '제주도',
    country: '한국',
    description: '아름다운 자연과 독특한 문화가 있는 한국의 보석 같은 섬',
    imageUrl: require('@/assets/images/mainjeju.png'),
    tags: ['자연', '맛집', '자연'],
  },
  {
    id: '2',
    title: '제주도',
    country: '한국',
    description: '아름다운 자연과 독특한 문화가 있는 한국의 보석 같은 섬',
    imageUrl: require('@/assets/images/mainjeju.png'),
    tags: ['자연', '맛집'],
  },
];

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const translateY = useSharedValue(CHAT_SHEET_HEIGHT);
  const SNAP_MIN = CHAT_SHEET_HEIGHT;
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatCaseOrder, setChatCaseOrder] = useState(-1);
  const [hasPlannedTrip, setHasPlannedTrip] = useState(false);
  const [isInTripScheduleView, setIsInTripScheduleView] = useState(false);
  const currentCaseIndex = chatCaseOrder < 0 ? 0 : chatCaseOrder;
  const hasNotification = true;

  const handleNavigateToDetail = useCallback(() => {
    navigation.navigate('Alert');
  }, [navigation]);

  const handleNavigateToAddTrip = useCallback(() => {
    setHasPlannedTrip(true);
    setIsInTripScheduleView(false);
  }, []);

  const handleOpenTripSchedule = useCallback(() => {
    setIsInTripScheduleView(true);
  }, []);

  const handleNavigateToMyTrip = useCallback(() => {
    navigation.navigate('MainTabs', { screen: 'MyTrip' });
  }, [navigation]);

  const handleOpenChat = useCallback(() => {
    setChatCaseOrder((prev) => (prev + 1) % 3);
    translateY.value = withTiming(0, { duration: 350 });
  }, [translateY]);

  const handleCloseChat = useCallback(() => {
    translateY.value = withTiming(SNAP_MIN, { duration: 300 });
  }, [translateY, SNAP_MIN]);

  const backdropStyle = useAnimatedStyle(() => {
    const opacity = interpolate(translateY.value, [0, SNAP_MIN], [0.3, 0]);
    return { opacity };
  }, [translateY, SNAP_MIN]);

  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
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
            zIndex: 10,
            elevation: 10,
          },
          backdropStyle,
        ]}
      >
        <Pressable style={{ flex: 1 }} onPress={handleCloseChat} />
      </Animated.View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-4 flex-row justify-between items-center">
          <View className="flex-row items-center">
            <LogoIcon width={38} height={38} />
            <LogoLetter width={65} height={32} />
          </View>
          <ContentContainer className="px-[10px] py-[10px] rounded-xl">
            <Pressable onPress={handleNavigateToDetail} className="items-center justify-center">
              {hasNotification ? <NoticeDotIcon width={20} height={20} /> : <NoticeIcon width={20} height={20} />}
            </Pressable>
          </ContentContainer>
        </View>

        <View className="mx-4 mt-4">
          <MainTripCard
            hasPlannedTrip={hasPlannedTrip}
            isInTripScheduleView={isInTripScheduleView}
            onAddTrip={handleNavigateToAddTrip}
            onOpenTripSchedule={handleOpenTripSchedule}
            onViewAllSchedule={handleNavigateToMyTrip}
          />
        </View>

        <View className="mt-6 mb-6">
          <View className="px-4 mb-4">
            <Text className="text-h1 font-semibold text-black mb-[2px]">추천 여행지</Text>
            <Text className="text-p text-gray">지금 떠나기 좋은 여행지를 모았어요</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 16 }}
          >
            {RECOMMENDED_DESTINATIONS.map((item) => (
              <Shadow
                key={item.id}
                distance={10}
                offset={[0, 0]}
                startColor="#00000025"
                endColor="#00000000"
                paintInside={false}
                style={{ borderRadius: 8, width: 260 }}
              >
                <TouchableOpacity className="rounded-lg overflow-hidden bg-white">
                  <View className="h-40 relative">
                    <Image source={item.imageUrl} className="w-full h-full" resizeMode="cover" />
                    <View className="absolute bottom-3 left-4">
                      <Text className="text-white text-h2 font-semibold">{item.title}</Text>
                      <Text className="text-white text-p font-semibold mt-1">{item.country}</Text>
                    </View>
                  </View>

                  <View className="p-4">
                    <Text className="text-gray text-p mb-4" numberOfLines={2}>
                      {item.description}
                    </Text>
                    <View className="flex-row gap-[6px]">
                      {item.tags.map((tag, index) => (
                        <Chip key={index} label={tag} />
                      ))}
                    </View>
                  </View>
                </TouchableOpacity>
              </Shadow>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      <TouchableOpacity onPress={handleOpenChat} className="absolute bottom-4 right-4 bg-main rounded-full px-4 py-4">
        <ChatIcon width={24} height={24} />
      </TouchableOpacity>

      <CustomBottomSheet
        translateY={translateY}
        height={CHAT_SHEET_HEIGHT}
        collapsedVisibleHeight={0}
        cornerRadius={12}
        backgroundColor="#FFFFFF"
        onStateChange={setIsChatOpen}
        showIndicator={false}
      >
        <View
          className="absolute top-0 left-0 right-0 bg-white px-4 flex-row items-center justify-center"
          style={{ height: CHAT_HEADER_HEIGHT }}
        >
          <View className="absolute left-4 flex-row items-center">
            <View className="w-8 h-8 rounded-full bg-chatHeaderCircleBackground items-center justify-center">
              <RobotIcon width={20} height={20} />
            </View>
            <View className="ml-[7px]">
              <Text className="text-h3 text-black font-semibold">Pli AI</Text>
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

        <View className="flex-1" style={{ marginTop: CHAT_HEADER_HEIGHT }}>
          <ChatCaseContent currentCaseIndex={currentCaseIndex} />

          <View className="absolute left-0 right-0 px-4 flex-row items-center" style={{ bottom: CHAT_INPUT_BOTTOM_SPACING }}>
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
