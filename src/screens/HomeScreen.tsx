import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  TextInput,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Shadow } from 'react-native-shadow-2';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  interpolate,
} from 'react-native-reanimated';
import CustomBottomSheet from '@/components/ui/CustomBottomSheet';
import { MainRecChip } from '@/components/ui';
import { RobotIcon, SendIcon, X, NoticeIcon, LogoIcon, LogoLetter, ChatIcon } from '@/assets/icons';
import { COLORS } from '@/constants/colors';
import { ChatCaseContent, MainTripCard } from '@/screens/home/components';
import { getUnreadAlert } from '@/services/alertService';
import { getRecommendedPlaces } from '@/services/placeService';
import { getNearbySchedule } from '@/services/tripService';
import { useAuthStore } from '@/store';
import type { NearbyScheduleData } from '@/types/myTrip.types';
import type { RecommendedPlace } from '@/types/place';
import type { HomeScreenNavigationProp } from '@/types/home';
import {
  CHAT_HEADER_HEIGHT,
  CHAT_INPUT_BOTTOM_SPACING,
  CHAT_INPUT_RADIUS,
  CHAT_SEND_BUTTON_SIZE,
  CHAT_SHEET_HEIGHT,
} from '@/screens/home/constants';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const translateY = useSharedValue(CHAT_SHEET_HEIGHT);
  const SNAP_MIN = CHAT_SHEET_HEIGHT;
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatCaseOrder, setChatCaseOrder] = useState(-1);
  const [hasPlannedTrip, setHasPlannedTrip] = useState(false);
  const [isInTripScheduleView, setIsInTripScheduleView] = useState(false);
  const [nearbyTrip, setNearbyTrip] = useState<NearbyScheduleData | null>(null);
  const [recommendedPlaces, setRecommendedPlaces] = useState<RecommendedPlace[]>([]);
  const currentCaseIndex = chatCaseOrder < 0 ? 0 : chatCaseOrder;
  const [hasNotification, setHasNotification] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchUnread = async (): Promise<void> => {
        try {
          const unread = await getUnreadAlert();
          if (isActive) {
            setHasNotification(unread);
          }
        } catch {
          if (isActive) {
            setHasNotification(false);
          }
        }
      };

      fetchUnread();

      const controller = new AbortController();
      const fetchNearby = async (): Promise<void> => {
        try {
          const userId = useAuthStore.getState().user?.id;
          const result = await getNearbySchedule({ userId, signal: controller.signal });
          if (!isActive) return;

          const data = result.data;
          if (!data || !data.hasNearbyTrip) {
            setHasPlannedTrip(false);
            setIsInTripScheduleView(false);
            setNearbyTrip(null);
          } else {
            setNearbyTrip(data);
            setHasPlannedTrip(true);
            const status = (data.tripStatus ?? '').toUpperCase();
            // TripStatus 타입 정의에 맞춰 상태를 확인합니다.
            setIsInTripScheduleView(status === 'ONGOING' || status === 'TRAVELING');
          }
        } catch (err) {
          if (isActive && (err as Error).name !== 'AbortError') {
            setHasPlannedTrip(false);
            setIsInTripScheduleView(false);
            setNearbyTrip(null);
          }
        }
      };

      const fetchRecommendedPlaces = async (): Promise<void> => {
        try {
          const result = await getRecommendedPlaces({ limit: 5, signal: controller.signal });
          if (!isActive) return;

          if (result.error) {
            setRecommendedPlaces([]);
            return;
          }

          setRecommendedPlaces(result.data ?? []);
        } catch (err) {
          if (isActive && (err as Error).name !== 'AbortError') {
            setRecommendedPlaces([]);
          }
        }
      };

      void fetchNearby();
      void fetchRecommendedPlaces();

      return () => {
        isActive = false;
        controller.abort();
      };
    }, []),
  );

  const handleNavigateToDetail = useCallback(() => {
    navigation.navigate('Alert');
  }, [navigation]);

  const handleNavigateToAddTrip = useCallback(() => {
    navigation.navigate('AddTripScreen');
  }, [navigation]);

  const handleOpenTripSchedule = useCallback(() => {
    if (nearbyTrip?.tripId) {
      navigation.navigate('TripDetail', { tripId: nearbyTrip.tripId });
    }
  }, [navigation, nearbyTrip]);

  const handleNavigateToMyTrip = useCallback(() => {
    if (nearbyTrip?.tripId) {
      navigation.navigate('TripDetail', { tripId: nearbyTrip.tripId });
    } else {
      navigation.navigate('MainTabs', { screen: 'MyTrip' });
    }
  }, [navigation, nearbyTrip]);

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
        ]}>
        <Pressable style={{ flex: 1 }} onPress={handleCloseChat} />
      </Animated.View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between px-4 py-4">
          <View className="flex-row items-center">
            <LogoIcon width={38} height={38} />
            <LogoLetter width={65} height={32} />
          </View>
          <Shadow
            distance={2}
            startColor="#00000025"
            endColor="#00000000"
            offset={[0, 0]}
            paintInside={false}
            style={{ borderRadius: 12 }}>
            <View className="rounded-xl bg-white px-[10px] py-[10px]">
              <Pressable onPress={handleNavigateToDetail} className="items-center justify-center">
                <View className="relative">
                  <NoticeIcon width={20} height={20} />
                  {hasNotification && (
                    <View className="absolute right-[-1px] top-[-1px] h-2 w-2 rounded-full bg-statusError" />
                  )}
                </View>
              </Pressable>
            </View>
          </Shadow>
        </View>

        <View className="mx-4 mt-4">
          <MainTripCard
            hasPlannedTrip={hasPlannedTrip}
            isInTripScheduleView={isInTripScheduleView}
            onAddTrip={handleNavigateToAddTrip}
            onOpenTripSchedule={handleOpenTripSchedule}
            onViewAllSchedule={handleNavigateToMyTrip}
            nearbyTrip={nearbyTrip}
          />
        </View>

        <View className="mb-6 mt-6">
          <View className="mb-2 px-4">
            <Text className="mb-[2px] font-pretendardSemiBold text-h1 text-black">추천 여행지</Text>
            <Text className="text-p text-gray">지금 떠나기 좋은 여행지를 모았어요</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8, gap: 16 }}>
            {recommendedPlaces.map((item) => (
              <Shadow
                key={item.placeId}
                distance={10}
                offset={[0, 0]}
                startColor="#00000025"
                endColor="#00000000"
                paintInside={false}
                style={{ borderRadius: 8, width: 260 }}>
                <View className="overflow-hidden rounded-lg bg-white">
                  <View className="relative h-40">
                    <Image
                      source={
                        item.imageUrl
                          ? { uri: item.imageUrl }
                          : require('@/assets/images/mainjeju.png')
                      }
                      className="h-full w-full"
                      resizeMode="cover"
                    />
                    <View className="absolute bottom-3 left-4">
                      <Text className="font-pretendardSemiBold text-h2 text-white">
                        {item.name}
                      </Text>
                      <Text className="mt-1 font-pretendardSemiBold text-p text-white">
                        {item.countryName}
                      </Text>
                    </View>
                  </View>

                  <View className="p-4">
                    <Text className="mb-4 text-p text-gray" numberOfLines={2}>
                      {`지금 ${item.cityName}에서 인기 있는 추천 장소예요`}
                    </Text>
                    <View className="flex-row">
                      {(item.tags ?? []).slice(0, 3).map((tag, index) => (
                        <MainRecChip
                          key={`${item.placeId}-${tag}-${index}`}
                          label={tag}
                          className={'mr-[6px]'}
                        />
                      ))}
                    </View>
                  </View>
                </View>
              </Shadow>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={handleOpenChat}
        className="absolute bottom-4 right-4 rounded-full bg-main px-4 py-4">
        <ChatIcon width={24} height={24} />
      </TouchableOpacity>

      <CustomBottomSheet
        translateY={translateY}
        height={CHAT_SHEET_HEIGHT}
        collapsedVisibleHeight={0}
        cornerRadius={12}
        backgroundColor="#FFFFFF"
        onStateChange={setIsChatOpen}
        showIndicator={false}>
        <View
          className="absolute left-0 right-0 top-0 flex-row items-center justify-center bg-white px-4"
          style={{ height: CHAT_HEADER_HEIGHT }}>
          <View className="absolute left-4 flex-row items-center">
            <View className="h-8 w-8 items-center justify-center rounded-full bg-chatHeaderCircleBackground">
              <RobotIcon width={20} height={20} />
            </View>
            <View className="ml-[7px]">
              <Text className="font-pretendardSemiBold text-h3 text-black">Pli AI</Text>
              <Text className="text-p text-gray">여행 계획을 도와드려요</Text>
            </View>
          </View>
          <Pressable
            onPress={handleCloseChat}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            className="absolute right-4 h-8 w-8 items-center justify-center rounded-full bg-chatHeaderCircleBackground">
            <X width={14} height={14} />
          </Pressable>
          <View className="absolute bottom-0 left-0 right-0 h-px bg-borderGray" />
        </View>

        <View className="flex-1" style={{ marginTop: CHAT_HEADER_HEIGHT }}>
          <ChatCaseContent currentCaseIndex={currentCaseIndex} />

          <View
            className="absolute left-0 right-0 flex-row items-center px-4"
            style={{ bottom: CHAT_INPUT_BOTTOM_SPACING }}>
            <TextInput
              placeholder="AI에게 질문해보세요"
              placeholderTextColor={COLORS.gray}
              className="h-12 flex-1 border border-borderGray px-4 text-p1 text-black"
              style={{ borderRadius: CHAT_INPUT_RADIUS }}
            />
            <View
              className="ml-3 items-center justify-center rounded-full bg-main"
              style={{ width: CHAT_SEND_BUTTON_SIZE, height: CHAT_SEND_BUTTON_SIZE }}>
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
