import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  TextInput,
  ScrollView,
  ActivityIndicator,
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
import { RobotIcon, SendIcon, X, NoticeIcon, LogoIcon, LogoLetter, ChatIcon } from '@/assets/icons';
import { COLORS } from '@/constants/colors';
import { ChatMessageBubble, MainTripCard, RecommendedPlaceCard } from '@/screens/home/components';
import { getUnreadAlert } from '@/services/alertService';
import { postChatMessage } from '@/services/chatService';
import { getRecommendedPlaces } from '@/services/placeService';
import { getNearbySchedule } from '@/services/tripService';
import { useAuthStore } from '@/store';
import type { NearbyScheduleData } from '@/types/myTrip.types';
import type { RecommendedPlace } from '@/types/place';
import type { HomeScreenNavigationProp } from '@/types/home';
import type { ChatMessage } from '@/types/chat';
import {
  CHAT_HEADER_HEIGHT,
  CHAT_INPUT_BOTTOM_SPACING,
  CHAT_INPUT_KEYBOARD_GAP,
  CHAT_INPUT_RADIUS,
  CHAT_SEND_BUTTON_SIZE,
  CHAT_SHEET_HEIGHT,
} from '@/screens/home/constants';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const translateY = useSharedValue(CHAT_SHEET_HEIGHT);
  const SNAP_MIN = CHAT_SHEET_HEIGHT;
  const inputFocusGap = useSharedValue(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasPlannedTrip, setHasPlannedTrip] = useState(false);
  const [isInTripScheduleView, setIsInTripScheduleView] = useState(false);
  const [nearbyTrip, setNearbyTrip] = useState<NearbyScheduleData | null>(null);
  const [recommendedPlaces, setRecommendedPlaces] = useState<RecommendedPlace[]>([]);
  const [hasNotification, setHasNotification] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatInputText, setChatInputText] = useState('');
  const chatSessionId = useRef(`${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`);
  const chatScrollRef = useRef<ScrollView>(null);

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

  useFocusEffect(
    useCallback(() => {
      return () => {
        translateY.value = SNAP_MIN;
        setIsChatOpen(false);
        setChatMessages([]);
        setChatInputText('');
        setIsChatLoading(false);
        chatSessionId.current = `${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`;
      };
    }, [translateY, SNAP_MIN]),
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
    translateY.value = withTiming(0, { duration: 350 });
  }, [translateY]);

   const handleCloseChat = useCallback(() => {
    translateY.value = withTiming(SNAP_MIN, { duration: 300 });
    setChatMessages([]);
    setChatInputText('');
    setIsChatLoading(false);
    chatSessionId.current = `${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`;
  }, [translateY, SNAP_MIN]);

  const handleSendChat = useCallback(async () => {
    const text = chatInputText.trim();
    if (!text || isChatLoading) return;

    setChatMessages((prev) => [...prev, { id: `user-${Date.now()}`, role: 'user', content: text }]);
    setChatInputText('');
    setIsChatLoading(true);
    setTimeout(() => chatScrollRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const result = await postChatMessage({ session_id: chatSessionId.current, message: text });
      setChatMessages((prev) => [...prev, { id: `bot-${Date.now()}`, role: 'bot', content: result.answer }]);
    } catch {
      setChatMessages((prev) => [...prev, { id: `bot-err-${Date.now()}`, role: 'bot', content: '죄송합니다. 오류가 발생했습니다.' }]);
    } finally {
      setIsChatLoading(false);
      setTimeout(() => chatScrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [chatInputText, isChatLoading]);

  const backdropStyle = useAnimatedStyle(() => {
    const opacity = interpolate(translateY.value, [0, SNAP_MIN], [0.3, 0]);
    return { opacity };
  }, [translateY, SNAP_MIN]);

  const handleInputFocus = useCallback(() => {
    inputFocusGap.value = withTiming(CHAT_INPUT_KEYBOARD_GAP, { duration: 200 });
  }, [inputFocusGap]);

  const handleInputBlur = useCallback(() => {
    inputFocusGap.value = withTiming(0, { duration: 200 });
  }, [inputFocusGap]);

  const inputRowAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -inputFocusGap.value }],
  }));

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
            backgroundColor: COLORS.dimOverlay,
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

        {recommendedPlaces.length > 0 && (
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
                <RecommendedPlaceCard key={item.placeId} place={item} />
              ))}
            </ScrollView>
          </View>
        )}
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
          <ScrollView
            ref={chatScrollRef}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingTop: 12, paddingBottom: CHAT_INPUT_BOTTOM_SPACING + 60 }}
            showsVerticalScrollIndicator={false}>
            {chatMessages.map((msg) => (
              <ChatMessageBubble key={msg.id} message={msg} />
            ))}
            {isChatLoading && (
              <View className="flex-row items-start px-4 mb-3">
                <View className="rounded-full bg-chatHeaderCircleBackground items-center justify-center" style={{ width: 28, height: 28, marginTop: 2 }}>
                  <RobotIcon width={14} height={14} />
                </View>
                <View className="ml-2 bg-chatHeaderCircleBackground px-4 py-3" style={{ borderRadius: 16 }}>
                  <ActivityIndicator size="small" color={COLORS.main} />
                </View>
              </View>
            )}
          </ScrollView>

          <Animated.View
            className="absolute left-0 right-0 flex-row items-center px-4"
            style={[{ bottom: CHAT_INPUT_BOTTOM_SPACING }, inputRowAnimatedStyle]}>
            <TextInput
              value={chatInputText}
              onChangeText={setChatInputText}
              onSubmitEditing={() => { void handleSendChat(); }}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder="AI에게 질문해보세요"
              placeholderTextColor={COLORS.gray}
              returnKeyType="send"
              editable={!isChatLoading}
              className="h-12 flex-1 border border-borderGray px-4 text-p1 text-black"
              style={{ borderRadius: CHAT_INPUT_RADIUS }}
            />
            <TouchableOpacity
              onPress={handleSendChat}
              disabled={!chatInputText.trim() || isChatLoading}
              className="ml-3 items-center justify-center rounded-full"
              style={{
                width: CHAT_SEND_BUTTON_SIZE,
                height: CHAT_SEND_BUTTON_SIZE,
                backgroundColor: chatInputText.trim() && !isChatLoading ? COLORS.main : COLORS.buttonDisabled,
              }}>
              <SendIcon width={24} height={24} />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </CustomBottomSheet>
    </SafeAreaView>
  );
};

export default HomeScreen;
export { HomeScreen };
