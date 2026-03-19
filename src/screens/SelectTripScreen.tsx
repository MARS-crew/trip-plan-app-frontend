import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Animated, Easing, type NativeSyntheticEvent, type NativeScrollEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Shadow } from 'react-native-shadow-2';
import LinearGradient from 'react-native-linear-gradient';

import { ScheduleIcon, MarkerGrayIcon, VectorGrayIcon } from '@/assets/icons';
import { COLORS } from '@/constants';
import { TripStatusChip } from '@/components/ui';
import type { SearchStackParamList } from '@/navigation/types';

// ============ Types ============
type NavigationProp = NativeStackNavigationProp<SearchStackParamList>;

// ============ Component ============
const SelectTripScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  // Hooks
  const [expandedCardIndex, setExpandedCardIndex] = useState<number | null>(null);
  const [scrollPositions, setScrollPositions] = useState<{ [key: number]: number }>({ 0: 0, 1: 0 });
  const [selectedDates, setSelectedDates] = useState<{ [key: number]: number | null }>({ 0: null, 1: null });
  
  // 애니메이션 값
  const animatedHeights = useRef<{ [key: number]: Animated.Value }>({
    0: new Animated.Value(0),
    1: new Animated.Value(0),
  }).current;
  
  const animatedOpacities = useRef<{ [key: number]: Animated.Value }>({
    0: new Animated.Value(0),
    1: new Animated.Value(0),
  }).current;

  useEffect(() => {
    [0, 1].forEach((index) => {
      const isExpanded = expandedCardIndex === index;
      Animated.parallel([
        Animated.timing(animatedHeights[index], {
          toValue: isExpanded ? 64 : 0,
          duration: 300,
          useNativeDriver: false,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(animatedOpacities[index], {
          toValue: isExpanded ? 1 : 0,
          duration: 300,
          useNativeDriver: false,
          easing: Easing.inOut(Easing.ease),
        }),
      ]).start();
    });
  }, [expandedCardIndex, animatedHeights, animatedOpacities]);

  const handleCardPress = useCallback((index: number) => {
    setExpandedCardIndex(expandedCardIndex === index ? null : index);
  }, [expandedCardIndex]);

  const handleScroll = useCallback((index: number, event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    setScrollPositions((prev) => ({ ...prev, [index]: offsetX }));
  }, []);

  const handleDatePress = useCallback((cardIndex: number, dateIndex: number) => {
    setSelectedDates((prev) => ({
      ...prev,
      [cardIndex]: prev[cardIndex] === dateIndex ? null : dateIndex,
    }));
  }, []);

  // 파생 값
  const dates = React.useMemo(
    () => [
      { date: '2/28', day: '토' },
      { date: '3/1', day: '일' },
      { date: '3/2', day: '월' },
      { date: '3/3', day: '화' },
      { date: '3/4', day: '수' },
      { date: '3/5', day: '목' },
      { date: '3/6', day: '금' },
    ],
    [],
  );

  // 렌더링
  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <View className="mt-[6px] ml-4">
        <Text className="text-h text-black font-bold">추가할 여행 선택</Text>
        <Text className="text-p text-gray font-regular">2개의 여행이 있어요</Text>
        
        {/* 여행 정보 카드 */}
        <View className="mt-4 mr-4">
          <View className="bg-white overflow-hidden" style={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => handleCardPress(0)}>
              {/* 이미지 영역 */}
              <View
                className="overflow-hidden relative"
                style={{
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                }}>
                <Image
                  source={require('@/assets/images/thumnail2.png')}
                  className="w-full"
                  resizeMode="cover"
                />
                
                {/* 여행 중 버튼 */}
                <View className="absolute top-[13px] left-[15px]">
                  <TripStatusChip status="traveling" />
                </View>
                
                {/* 여행지 + 스케줄 아이콘 + 일정 + 날짜 */}
                <View className="absolute bottom-[14px] left-3">
                  {/* 도쿄 텍스트 */}
                  <Text className="text-h1 text-white font-bold mb-1">도쿄</Text>
                  
                  {/* 스케줄 아이콘 + 일정 + 날짜 */}
                  <View className="flex-row items-center">
                    <ScheduleIcon width={12} height={12} />
                    <Text className="text-p text-white font-regular ml-1">일정</Text>
                    <Text className="text-p text-white font-regular ml-[2px]">2026.02.28 ~ 2026.03.03</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          
          <Shadow
            distance={2}
            startColor="#00000025"
            endColor="#00000000"
            offset={[0, 0]}
            paintInside={false}
            containerStyle={{ width: '100%', alignSelf: 'stretch' }}
            style={{
              borderRadius: 8,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
              width: '100%',
            }}>
            <View
              className="bg-white overflow-hidden"
              style={{
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
              }}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => handleCardPress(0)}>
                {/* 정보 영역 */}
                <View className={`${expandedCardIndex === 0 ? 'border-b border-chip' : 'rounded-b-lg'}`}>
                  <View className="p-4 flex-row items-center">
                    {/* 마커 아이콘 + 일정 개수 + 기간 */}
                    <MarkerGrayIcon />
                    <Text className="text-p text-gray font-regular ml-1">5개의 일정</Text>
                    <Text className="text-p text-gray font-regular ml-3">4일간</Text>
                  </View>
                </View>
              </TouchableOpacity>
            
              {/* 날짜 선택 영역 */}
              <Animated.View
                className="bg-white flex-row items-center relative overflow-hidden rounded-b-lg"
                style={{
                  height: animatedHeights[0],
                  opacity: animatedOpacities[0],
                }}>
                  {/* 왼쪽 아이콘 + 리니어 그라디언트 */}
                  <View className="absolute left-0 top-0 bottom-0 flex-row items-center z-10" pointerEvents="none">
                    {/* 흰색 배경 + 아이콘 */}
                    <View className="w-10 h-full bg-white justify-center items-center" style={{ zIndex: 2 }}>
                      <View style={{ transform: [{ rotate: '180deg' }] }}>
                        <VectorGrayIcon />
                      </View>
                    </View>
                    {/* 리니어 그라디언트 */}
                    {scrollPositions[0] > 0 && (
                      <LinearGradient
                        colors={[
                          'rgba(255,255,255,1)',
                          'rgba(255,255,255,0.9)',
                          'rgba(255,255,255,0.2)',
                          'rgba(255,255,255,0)',
                        ]}
                        locations={[0, 0.13, 0.61, 1]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ width: 12, height: '100%', zIndex: 1 }}
                      />
                    )}
                  </View>

                  {/* 날짜 스크롤 영역 */}
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingLeft: 40, paddingRight: 16, gap: 8, alignItems: 'center', paddingVertical: 13 }}
                    style={{ flex: 1, height: 64 }}
                    nestedScrollEnabled={true}
                    scrollEventThrottle={16}
                    onScroll={(e) => handleScroll(0, e)}>
                    {dates.map((item, index) => {
                      const isSelected = selectedDates[0] === index;
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() => handleDatePress(0, index)}
                          className={`w-[85px] h-[38px] rounded-lg items-center justify-center ${
                            isSelected ? 'border' : 'border border-borderGray'
                          }`}
                          style={{
                            borderColor: isSelected ? COLORS.main : undefined,
                            backgroundColor: isSelected ? 'rgba(223, 108, 32, 0.102)' : 'transparent',
                          }}>
                          <Text
                            className="text-p1 font-medium"
                            style={{ color: isSelected ? COLORS.main : COLORS.gray }}>
                            {item.date}({item.day})
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>

                  {/* 오른쪽 리니어 그라디언트 + 아이콘 */}
                  <View className="absolute right-0 top-0 bottom-0 flex-row items-center z-10" pointerEvents="none">
                    {/* 리니어 그라디언트 */}
                    <LinearGradient
                      colors={[
                        'rgba(255,255,255,0)',
                        'rgba(255,255,255,0.2)',
                        'rgba(255,255,255,0.9)',
                        'rgba(255,255,255,1)',
                      ]}
                      locations={[0, 0.39, 0.87, 1]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{ width: 12, height: '100%', zIndex: 1 }}
                    />
                    {/* 흰색 배경 + 아이콘 */}
                    <View className="w-10 h-full bg-white justify-center items-center" style={{ zIndex: 2 }}>
                      <VectorGrayIcon />
                    </View>
                  </View>
              </Animated.View>
            </View>
          </Shadow>
        </View>
        
        {/* 여행 정보 카드 2 */}
        <View className="mt-4 mr-4">
          <View className="bg-white overflow-hidden" style={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => handleCardPress(1)}>
              {/* 이미지 영역 */}
              <View
                className="overflow-hidden relative"
                style={{
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                }}>
                <Image
                  source={require('@/assets/images/thumnail2.png')}
                  className="w-full"
                  resizeMode="cover"
                />
                
                {/* 여행지 + 스케줄 아이콘 + 일정 개수 + 기간 */}
                <View className="absolute bottom-[14px] left-3">
                  {/* 여행지 */}
                  <Text className="text-h1 text-white font-bold mb-1">도쿄</Text>
                  
                  {/* 스케줄 아이콘 + 일정 개수 + 기간 */}
                  <View className="flex-row items-center">
                    <ScheduleIcon width={12} height={12} />
                    <Text className="text-p text-white font-regular ml-1">일정</Text>
                    <Text className="text-p text-white font-regular ml-[2px]">2026.02.28 ~ 2026.03.03</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          
          <Shadow
            distance={2}
            startColor="#00000025"
            endColor="#00000000"
            offset={[0, 0]}
            paintInside={false}
            containerStyle={{ width: '100%', alignSelf: 'stretch' }}
            style={{
              borderRadius: 8,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
              width: '100%',
            }}>
            <View
              className="bg-white overflow-hidden"
              style={{
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
              }}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => handleCardPress(1)}>
                {/* 정보 영역 */}
                <View className={`${expandedCardIndex === 1 ? 'border-b border-chip' : 'rounded-b-lg'}`}>
                  <View className="p-4 flex-row items-center">
                    {/* 마커 아이콘 + 일정 개수 + 기간 */}
                    <MarkerGrayIcon />
                    <Text className="text-p text-gray font-regular ml-1">5개의 일정</Text>
                    <Text className="text-p text-gray font-regular ml-3">4일간</Text>
                  </View>
                </View>
              </TouchableOpacity>
            
              {/* 날짜 선택 영역 */}
              <Animated.View
                className="bg-white flex-row items-center relative overflow-hidden rounded-b-lg"
                style={{
                  height: animatedHeights[1],
                  opacity: animatedOpacities[1],
                }}>
                  {/* 왼쪽 아이콘 + 리니어 그라디언트 */}
                  <View className="absolute left-0 top-0 bottom-0 flex-row items-center z-10" pointerEvents="none">
                    {/* 흰색 배경 + 아이콘 */}
                    <View className="w-10 h-full bg-white justify-center items-center" style={{ zIndex: 2 }}>
                      <View style={{ transform: [{ rotate: '180deg' }] }}>
                        <VectorGrayIcon />
                      </View>
                    </View>
                    {/* 리니어 그라디언트 */}
                    {scrollPositions[1] > 0 && (
                      <LinearGradient
                        colors={[
                          'rgba(255,255,255,1)',
                          'rgba(255,255,255,0.9)',
                          'rgba(255,255,255,0.2)',
                          'rgba(255,255,255,0)',
                        ]}
                        locations={[0, 0.13, 0.61, 1]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ width: 12, height: '100%', zIndex: 1 }}
                      />
                    )}
                  </View>

                  {/* 날짜 스크롤 영역 */}
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingLeft: 40, paddingRight: 16, gap: 8, alignItems: 'center', paddingVertical: 13 }}
                    style={{ flex: 1, height: 64 }}
                    nestedScrollEnabled={true}
                    scrollEventThrottle={16}
                    onScroll={(e) => handleScroll(1, e)}>
                    {dates.map((item, index) => {
                      const isSelected = selectedDates[1] === index;
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() => handleDatePress(1, index)}
                          className={`w-[85px] h-[38px] rounded-lg items-center justify-center ${
                            isSelected ? 'border' : 'border border-borderGray'
                          }`}
                          style={{
                            borderColor: isSelected ? COLORS.main : undefined,
                            backgroundColor: isSelected ? 'rgba(223, 108, 32, 0.102)' : 'transparent',
                          }}>
                          <Text
                            className="text-p1 font-medium"
                            style={{ color: isSelected ? COLORS.main : COLORS.gray }}>
                            {item.date}({item.day})
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>

                  {/* 오른쪽 리니어 그라디언트 + 아이콘 */}
                  <View className="absolute right-0 top-0 bottom-0 flex-row items-center z-10" pointerEvents="none">
                    {/* 리니어 그라디언트 */}
                    <LinearGradient
                      colors={[
                        'rgba(255,255,255,0)',
                        'rgba(255,255,255,0.2)',
                        'rgba(255,255,255,0.9)',
                        'rgba(255,255,255,1)',
                      ]}
                      locations={[0, 0.39, 0.87, 1]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{ width: 12, height: '100%', zIndex: 1 }}
                    />
                    {/* 흰색 배경 + 아이콘 */}
                    <View className="w-10 h-full bg-white justify-center items-center" style={{ zIndex: 2 }}>
                      <VectorGrayIcon />
                    </View>
                  </View>
              </Animated.View>
            </View>
          </Shadow>
        </View>
      </View>
    </SafeAreaView>
  );
};

SelectTripScreen.displayName = 'SelectTripScreen';

export default SelectTripScreen;
export { SelectTripScreen };