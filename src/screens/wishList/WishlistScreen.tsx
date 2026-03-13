import React, { useCallback, useRef } from 'react';
import { View, Image, TextInput, TouchableOpacity, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SearchArrowIcon, SearchingIcon, VectorIcon, PlaceIcon, HeartIcon, ActiveHeartIcon } from '@/assets/icons';
import BottomSheet from '@gorhom/bottom-sheet';
import CustomBottomSheet from '@/components/ui/CustomBottomSheet';
import { ContentContainer, SearchContainer } from '@/components/ui';

import type { RootStackParamList } from '@/navigation/types';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { useState } from "react";


import { CategoryChip } from '@/screens/wishList/components';
// ============ Types ============
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// ============ Component ============
const WishlistScreen: React.FC = () => {

  // 파생 값
  const tabs = React.useMemo(
    () => [
      { id: 'trending', label: '실시간 추천' },
      { id: 'saved', label: '저장된 장소' },
      { id: 'wishlist', label: '위시 리스트' },
    ],
    [],
  );
  const [isLiked, setIsLiked] = useState(false);
  const navigation = useNavigation<NavigationProp>();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>('trending');
  // 1. Hooks
  // Hooks
  const [activeTab, setActiveTab] = React.useState('info');

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleExpand = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);


  const handleCollapse = useCallback(() => {
    bottomSheetRef.current?.collapse();
  }, []);
  //바텀시트 안에 콘텐츠  
  const renderContent = () => {
    switch (selectedCategory) {
      case 'trending':
        return (
          <><View ><Text className="text-h2 font-semibold">현재 핫한 장소</Text></View>
            <View className="mt-4 ">
              <View className="mb-3 mr-[1px]">
                <ContentContainer >
                  <View className="flex-row items-center">
                    <View className="w-28 h-28 rounded-l-lg overflow-hidden shrink-0">
                      <Image
                        source={require('@/assets/images/thumnail.png')}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    </View>
                    <View className="flex-1  ml-3 pr-5">
                      <Text className="text-h3 text-black font-semibold">센소지 아사쿠사</Text>
                      <View className="mt-[2px]"><Text className="text-p text-gray" numberOfLines={2}>도쿄는 일본의 수도이자 전통과 현대가 조화를 이루는 매력적인 도시입니다.</Text></View>
                      <View className="mt-[6px]  flex-row">
                        <CategoryChip label="관광지" className="mr-2 px-2 py-[2px] " />
                        <CategoryChip label="문화" className="mr-2 px-2 py-[2px] " />
                        <CategoryChip label="역사" className=" px-2 py-[2px] " />
                      </View>
                    </View>
                    <TouchableOpacity className="mr-4" onPress={() => setIsLiked(!isLiked)}>
                      <VectorIcon></VectorIcon>
                    </TouchableOpacity>
                  </View>
                </ContentContainer>
              </View>
              <View className="mb-3 mr-[1px]">
                <ContentContainer>
                  <View className="flex-row items-center">
                    <View className="w-28 h-28 rounded-l-lg overflow-hidden shrink-0">
                      <Image
                        source={require('@/assets/images/thumnail.png')}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    </View>
                    <View className="flex-1  ml-3 pr-5">
                      <Text className="text-h3 text-black font-semibold">센소지 아사쿠사</Text>
                      <View className="mt-[2px]"><Text className="text-p text-gray" numberOfLines={2}>도쿄는 일본의 수도이자 전통과 현대가 조화를 이루는 매력적인 도시입니다.</Text></View>
                      <View className="mt-[6px]  flex-row">
                        <CategoryChip label="관광지" className="mr-2 px-2 py-[2px] " />
                        <CategoryChip label="문화" className="mr-2 px-2 py-[2px] " />
                        <CategoryChip label="역사" className=" px-2 py-[2px] " />
                      </View>
                    </View>
                    <TouchableOpacity className="mr-4" onPress={() => setIsLiked(!isLiked)}>
                      <VectorIcon></VectorIcon>
                    </TouchableOpacity>
                  </View>
                </ContentContainer>
              </View>
            </View>
          </>
        );
      case 'saved':
        return (
          <View className="py-4 mr-[1px]">
            <ContentContainer>
              <View className="flex-row items-center">
                <View className="w-28 h-28 rounded-l-lg overflow-hidden shrink-0">
                  <Image
                    source={require('@/assets/images/thumnail.png')}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>
                <View className="flex-1 ml-3 pr-5">
                  <Text className="text-h3 text-black font-semibold">센소지 아사쿠사</Text>
                  <View className="flex-row mt-1"><PlaceIcon /><Text className="text-p text-gray">도쿄, 일본</Text></View>
                  <View className="mt-2"><Text className="text-p text-gray" numberOfLines={2}>도쿄는 일본의 수도이자 전통과 현대가 조화를 이루는...</Text></View>
                </View>
                <TouchableOpacity className="mr-4 self-start mt-4 shrink-0" onPress={() => setIsLiked(!isLiked)}>
                  {isLiked ? <ActiveHeartIcon /> : <HeartIcon />}
                </TouchableOpacity>
              </View>
            </ContentContainer></View>
        );
      case 'wishlist':
        return (
          <View className="py-4 mr-[1px]">
            <ContentContainer>
              <View className="flex-row items-center">
                <View className="w-28 h-28 rounded-l-lg overflow-hidden shrink-0">
                  <Image
                    source={require('@/assets/images/thumnail.png')}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>
                <View className="flex-1 ml-3 pr-5">
                  <Text className="text-h3 text-black font-semibold">센소지 아사쿠사</Text>
                  <View className="flex-row mt-1"><PlaceIcon /><Text className="text-p text-gray">도쿄, 일본</Text></View>
                  <View className="mt-2"><Text className="text-p text-gray" numberOfLines={2}>도쿄는 일본의 수도이자 전통과 현대가 조화를 이루는...</Text></View>
                </View>
                <TouchableOpacity className="mr-4 self-start mt-4 shrink-0" onPress={() => setIsLiked(!isLiked)}>
                  {isLiked ? <ActiveHeartIcon /> : <HeartIcon />}
                </TouchableOpacity>
              </View>
            </ContentContainer></View>
        );
      default:
        return null;
    }
  };

  // 2. 렌더링
  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <View className="flex-1">
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          //임시로 봉천동
          initialRegion={{
            latitude: 37.482476,
            longitude: 126.941574,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}></MapView>

        <View className="absolute top-[5px] left-4 right-4 z-10">
          <SearchContainer>
            {/* 왼쪽: 뒤로가기 버튼 */}
            <TouchableOpacity onPress={handleGoBack} className="ml-4 mr-2">
              <SearchArrowIcon />
            </TouchableOpacity>
            {/* 2. 검색 입력창 */}

            <TextInput
              className="flex-1  text-h3 font-regular pr-12 text-black"
              placeholder="희망하는 관광지를 검색하세요"
              placeholderTextColor="#8C7B73"
            />

            {/* 3. 검색 아이콘 */}
            <TouchableOpacity className="absolute right-4">
              <SearchingIcon />
            </TouchableOpacity>
          </SearchContainer>
        </View>
        <CustomBottomSheet>


          <View className="mt-2 px-4 flex-row">
            {tabs.map((tab) => (
              <CategoryChip
                key={tab.id}
                label={tab.label}
                // ✨ 클릭 시 tab.id를 저장
                onPress={() => setSelectedCategory(tab.id)}
                // ✨ 비교도 tab.id로 수행
                isSelected={selectedCategory === tab.id}
                className={`mr-2 px-4 py-2 ${selectedCategory === tab.id ? "bg-main" : "bg-chip"}`}
              />
            ))}
          </View>


          <View className="mx-4 mt-2">
            <ScrollView>
              {renderContent()}
            </ScrollView>
          </View>

        </CustomBottomSheet>
      </View>
    </SafeAreaView>
  );
};

WishlistScreen.displayName = 'WishlistScreen';

export default WishlistScreen;
export { WishlistScreen };
