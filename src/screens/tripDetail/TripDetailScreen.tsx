import React, { useCallback, useRef, useState } from 'react';
import { Image, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';

import TripDetailCard from '@/components/ui/TripDetailCard';
import {
  WishIcon,
  LeftArrowIcon,
  KebabMenuIcon,
  CalendarIcon,
  Map2Icon,
  PlusIcon,
  KebabEditIcon,
  KebabCalIcon,
  KebabShareIcon,
  KebabTrashIcon,
  KebabMapIcon,
} from '@/assets/icons';

type TripDetailNavigation = NativeStackNavigationProp<
  RootStackParamList,
  'TripDetailScreen'
>;

type TripCardItem = {
  id: number;
  order: number;
  title: string;
  location: string;
  description: string;
  startTime: string;
  endTime: string;
  isCurrentSchedule?: boolean;
};

const KEBAB_SHEET_HEIGHT = 257;
const KEBAB_ANIMATION_DURATION = 250;
const CARD_MENU_ANIMATION_DURATION = 220;

const day1Cards: TripCardItem[] = [
  {
    id: 1,
    order: 1,
    title: '아사쿠사 센소지',
    location: '아사쿠사, 도쿄',
    description: '도쿄에서 가장 오래된 사원 방문',
    startTime: '09:00',
    endTime: '11:00',
    isCurrentSchedule: true,
  },
  {
    id: 2,
    order: 2,
    title: '츠키지 시장 점심',
    location: '츠키지, 도쿄',
    description: '신선한 스시와 해산물 즐기기',
    startTime: '12:00',
    endTime: '12:30',
  },
];

const TripDetailScreen: React.FC = () => {
  const navigation = useNavigation<TripDetailNavigation>();
  const kebabTranslateY = useSharedValue(KEBAB_SHEET_HEIGHT);
  const cardMenuOpacity = useSharedValue(0);
  const cardMenuTranslateY = useSharedValue(12);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isKebabMenuVisible, setIsKebabMenuVisible] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

  const selectedCard =
    selectedCardId !== null ? day1Cards.find((card) => card.id === selectedCardId) ?? null : null;

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleOpenKebabMenu = useCallback(() => {
    clearCloseTimer();
    setSelectedCardId(null);
    setIsKebabMenuVisible(true);
    kebabTranslateY.value = KEBAB_SHEET_HEIGHT;
    kebabTranslateY.value = withTiming(0, { duration: KEBAB_ANIMATION_DURATION });
  }, [clearCloseTimer, kebabTranslateY]);

  const handleCloseKebabMenu = useCallback(() => {
    clearCloseTimer();
    kebabTranslateY.value = withTiming(KEBAB_SHEET_HEIGHT, {
      duration: KEBAB_ANIMATION_DURATION,
    });
    closeTimerRef.current = setTimeout(() => {
      setIsKebabMenuVisible(false);
      closeTimerRef.current = null;
    }, KEBAB_ANIMATION_DURATION);
  }, [clearCloseTimer, kebabTranslateY]);

  const handleOpenCardMenu = useCallback(
    (cardId: number) => {
      clearCloseTimer();
      setIsKebabMenuVisible(false);
      setSelectedCardId(cardId);
      cardMenuOpacity.value = 0;
      cardMenuTranslateY.value = 12;
      cardMenuOpacity.value = withTiming(1, { duration: CARD_MENU_ANIMATION_DURATION });
      cardMenuTranslateY.value = withTiming(0, { duration: CARD_MENU_ANIMATION_DURATION });
    },
    [cardMenuOpacity, cardMenuTranslateY, clearCloseTimer],
  );

  const handleCloseCardMenu = useCallback(() => {
    clearCloseTimer();
    cardMenuOpacity.value = withTiming(0, { duration: CARD_MENU_ANIMATION_DURATION });
    cardMenuTranslateY.value = withTiming(12, { duration: CARD_MENU_ANIMATION_DURATION });
    closeTimerRef.current = setTimeout(() => {
      setSelectedCardId(null);
      closeTimerRef.current = null;
    }, CARD_MENU_ANIMATION_DURATION);
  }, [cardMenuOpacity, cardMenuTranslateY, clearCloseTimer]);

  const kebabBackdropStyle = useAnimatedStyle(() => {
    const opacity = interpolate(kebabTranslateY.value, [0, KEBAB_SHEET_HEIGHT], [1, 0]);
    return { opacity };
  });

  const bottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: kebabTranslateY.value }],
    };
  });

  const cardBackdropStyle = useAnimatedStyle(() => {
    return {
      opacity: cardMenuOpacity.value,
    };
  });

  const cardMenuStyle = useAnimatedStyle(() => {
    return {
      opacity: cardMenuOpacity.value,
      transform: [{ translateY: cardMenuTranslateY.value }],
    };
  });

  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="relative w-full">
          <Image
            source={require('@/assets/images/thumnail.png')}
            className="h-[181px] w-full"
            resizeMode="cover"
          />

          <View className="absolute left-4 right-4 top-4 z-50 flex-row items-center justify-between">
            <TouchableOpacity
              onPress={handleGoBack}
              activeOpacity={0.8}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              className="h-[36px] w-[36px] items-center justify-center rounded-full bg-[#FFFFFF4C]">
              <LeftArrowIcon />
            </TouchableOpacity>

            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => navigation.navigate('WishlistScreen')}
                activeOpacity={0.8}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                className="mr-2 h-[36px] w-[36px] items-center justify-center rounded-full bg-[#FFFFFF4C]">
                <WishIcon />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleOpenKebabMenu}
                activeOpacity={0.8}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                className="h-[36px] w-[36px] items-center justify-center rounded-full bg-[#FFFFFF4C]">
                <KebabMenuIcon />
              </TouchableOpacity>
            </View>
          </View>

          <View className="absolute left-4 bottom-[19px]">
            <Text className="mb-[6px] text-title font-bold text-white">도쿄 여행</Text>
            <View className="flex-row items-center">
              <CalendarIcon width={16} height={16} />
              <Text className="ml-[6px] text-p text-white">2026.02.28 - 2026.03.03</Text>
            </View>
          </View>
        </View>

        <View className="bg-screenBackground pt-[19px]">
          <View className="flex-row items-center justify-between px-4">
            <Text className="text-h3 font-semibold">1일차 / 02/28</Text>
            <Map2Icon width={20} height={20} />
          </View>

          <View className="mt-[18px] border-t border-borderGray" />

          {day1Cards.map((card) => (
            <View key={card.id} className="mt-[12px] px-4">
              <TripDetailCard
                {...card}
                onPressAction={() => {
                  // 방문지 저장 버튼
                }}
                onPressCard={() => handleOpenCardMenu(card.id)}
              />
            </View>
          ))}

          <View className="mt-[12px] px-4 mb-[32px]">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('AddSchedule')}
              className="h-[50px] w-full flex-row items-center justify-center rounded-[8px] border border-dashed border-borderGray">
              <PlusIcon />
              <Text className="ml-2 text-p1 text-gray">일정 추가하기</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="bg-screenBackground">
          <View className="flex-row items-center justify-between px-4">
            <Text className="text-h3 font-semibold">2일차 / 03/01</Text>
          </View>

          <View className="mt-[18px] border-t border-borderGray" />

          <View className="mt-[12px] px-4 pb-8">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('AddSchedule')}
              className="h-[50px] w-[370px] flex-row items-center justify-center rounded-[8px] border border-dashed border-borderGray">
              <PlusIcon />
              <Text className="ml-2 text-p1 text-gray">일정 추가하기</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="bg-screenBackground">
          <View className="flex-row items-center justify-between px-4">
            <Text className="text-h3 font-semibold">3일차 / 03/02</Text>
          </View>

          <View className="mt-[18px] border-t border-borderGray" />

          <View className="mt-[12px] px-4 pb-8">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('AddSchedule')}
              className="h-[50px] w-[370px] flex-row items-center justify-center rounded-[8px] border border-dashed border-borderGray">
              <PlusIcon />
              <Text className="ml-2 text-p1 text-gray">일정 추가하기</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="bg-screenBackground pb-10">
          <View className="flex-row items-center justify-between px-4">
            <Text className="text-h3 font-semibold">4일차 / 03/03</Text>
          </View>

          <View className="mt-[18px] border-t border-borderGray" />

          <View className="mt-[12px] items-center pb-8">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('AddSchedule')}
              className="h-[50px] w-[370px] flex-row items-center justify-center rounded-[8px] border border-dashed border-borderGray">
              <PlusIcon />
              <Text className="ml-2 text-p1 text-gray">일정 추가하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {selectedCard !== null ? (
        <>
          <Animated.View
            pointerEvents="auto"
            style={[
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
              },
              cardBackdropStyle,
            ]}>
            <Pressable style={{ flex: 1 }} onPress={handleCloseCardMenu} />
          </Animated.View>

          <Animated.View
            pointerEvents="box-none"
            className="absolute left-0 right-0 z-50 items-center"
            style={[
              cardMenuStyle,
              {
                top: selectedCard.id === 1 ? 258 : 368,
              },
            ]}>
            <View className="w-[370px]">
              <TripDetailCard
                {...selectedCard}
                onPressAction={() => {
                  // 방문지 저장 버튼
                }}
                onPressCard={handleCloseCardMenu}
              />

              <View className="mt-3 rounded-[8px] bg-white px-4 py-4">
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleCloseCardMenu}
                  className="flex-row items-center px-2 py-3">
                  <View className="mr-3 h-[32px] w-[32px] items-center justify-center rounded-[8px] bg-chip">
                    <KebabEditIcon />
                  </View>
                  <Text className="text-h3 font-semibold text-black">편집</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleCloseCardMenu}
                  className="flex-row items-center px-2 py-3">
                  <View className="mr-3 h-[32px] w-[32px] items-center justify-center rounded-[8px] bg-chip">
                    <KebabMapIcon />
                  </View>
                  <Text className="text-h3 font-semibold text-black">길찾기</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleCloseCardMenu}
                  className="flex-row items-center px-2 py-3">
                  <View className="mr-3 h-[32px] w-[32px] items-center justify-center rounded-[8px] bg-chip">
                    <KebabTrashIcon />
                  </View>
                  <Text className="text-h3 font-semibold text-black">삭제</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </>
      ) : null}

      {isKebabMenuVisible ? (
        <Animated.View
          pointerEvents="auto"
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            },
            kebabBackdropStyle,
          ]}>
          <Pressable style={{ flex: 1 }} onPress={handleCloseKebabMenu} />
        </Animated.View>
      ) : null}

      {isKebabMenuVisible ? (
        <Animated.View
          className="absolute bottom-0 left-0 right-0 z-50 items-center"
          style={bottomSheetStyle}>
          <View
            className="w-full rounded-t-[12px] bg-white px-5 pt-[28px] pb-[28px]">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleCloseKebabMenu}
              className="pl-4 pr-4 py-3 flex-row items-center">
              <View className="mr-3">
                <KebabEditIcon />
              </View>
              <Text className="text-h3 font-semibold text-black">제목 변경</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleCloseKebabMenu}
              className="pl-4 pr-4 py-3 flex-row items-center">
              <View className="mr-3">
                <KebabCalIcon />
              </View>
              <Text className="text-h3 font-semibold text-black">날짜 변경</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleCloseKebabMenu}
              className="pl-4 pr-4 py-3 flex-row items-center">
              <View className="mr-3">
                <KebabShareIcon />
              </View>
              <Text className="text-h3 font-semibold text-black">공유</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleCloseKebabMenu}
              className="pl-4 pr-4 py-3 flex-row items-center">
              <View className="mr-3">
                <KebabTrashIcon />
              </View>
              <Text className="text-h3 font-semibold text-black">삭제</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      ) : null}
    </SafeAreaView>
  );
};

TripDetailScreen.displayName = 'TripDetailScreen';

export default TripDetailScreen;
export { TripDetailScreen };