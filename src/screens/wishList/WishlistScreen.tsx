import React, { useCallback, useRef, useEffect } from 'react';
import { View, Image, TextInput, TouchableOpacity, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SearchArrowIcon, SearchingIcon, VectorIcon, PlaceIcon, HeartIcon, ActiveHeartIcon, MyLocation, EmptyLocation, EmptyWish, WishStar } from '@/assets/icons';
import BottomSheet from '@gorhom/bottom-sheet';
import CustomBottomSheet from '@/components/ui/CustomBottomSheet';
import { ContentContainer, SearchContainer } from '@/components/ui';
import { WishModal } from './components/WishModal';
import type { RootStackParamList } from '@/navigation/types';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { useState } from "react";
import { RouteIcon, AlertIcon } from '@/assets/icons';

import { BackHandler } from 'react-native';
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [activeTab, setActiveTab] = React.useState('info');
  const [isSheetExpanded, setIsSheetExpanded] = useState<boolean>(false);

  const handleSheetChange = useCallback((expanded: boolean) => {
    setIsSheetExpanded(expanded);
  }, []);

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

  const handleGoBack = useCallback(() => {

    setShowExitModal(true);
  }, []);

  const handleExpand = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);


  const handleCollapse = useCallback(() => {
    bottomSheetRef.current?.collapse();
  }, []);
  const handleAiPlan = useCallback(() => {
    console.log('AI 추천 일정 실행');
    setShowAddModal(false);
    // 여기에 AI 일정 생성 페이지로 이동하는 로직 추가
  }, []);

  const handleManualPlan = useCallback(() => {
    console.log('직접 일정 짜기 실행');
    setShowAddModal(false);
    // 여기에 직접 작성 페이지로 이동하는 로직 추가
  }, []);

  const handleComplete = useCallback(() => {
    setShowAddModal(true);
  }, []);

  useEffect(() => {
    const backAction = () => {
      //모달이 떠 있으면 동작 막기
      if (showExitModal || showAddModal) return true;

      // 모달 띄우기
      setShowExitModal(true);

      return true;
    };

    // 핸들러 등록
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [showExitModal, showAddModal]);
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
            </ContentContainer>
          </View>
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
                  <ActiveHeartIcon />
                </TouchableOpacity>
              </View>
            </ContentContainer>
          </View>
        );
      default:
        return null;
    }
  };
  const renderEmptyContent = () => {

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
          <View className="py-4 mr-[1px] items-center">
            <View className=" mt-20"><EmptyLocation /></View>
            <View className=" mt-4"><Text className="text-h2 font-semibold">저장한 장소가 없어요</Text></View>
            <View className=" mt-1"><Text className="text-p1 text-gray font-medium ">마음에 드는 장소를 저장해주세요.</Text></View>
          </View>
        );
      case 'wishlist':
        return (
          <View className="py-4 mr-[1px] items-center">
            <View className=" mt-20"><EmptyWish /></View>
            <View className=" mt-4"><Text className="text-h2 font-semibold">위시리스트에 장소가 없어요</Text></View>
            <View className=" mt-1"><Text className="text-p1 text-gray font-medium ">가고싶은 장소를 위시리스트에 추가해주세요.</Text></View>
          </View>
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

        {!isSheetExpanded && (
          <>
            <View className="absolute bottom-14 left-0 right-0 items-center z-20">
              <CategoryChip
                label="현 지도에서 검색"
                onPress={() => console.log('검색')}
                isSelected={true}
                textClassName="text-p1"
                className="px-[29px] py-[10px] rounded-full"
              /></View>
            <TouchableOpacity className="absolute bottom-14 right-4 z-20">
              <MyLocation />
            </TouchableOpacity>
          </>
        )}
        <CustomBottomSheet
          onStateChange={handleSheetChange}// 상태 변경 감지
        >



          <View className="mt-2 px-4 flex-row items-center justify-between">
            {/* 왼쪽: 탭 메뉴들 */}
            <View className="flex-row">
              {tabs.map((tab) => (
                <CategoryChip
                  key={tab.id}
                  label={tab.label}
                  onPress={() => setSelectedCategory(tab.id)}
                  isSelected={selectedCategory === tab.id}
                  className={`mr-2 px-4 py-2 rounded-2xl ${selectedCategory === tab.id ? "bg-main" : "bg-chip"
                    }`}
                />
              ))}
            </View>

            {/* 오른쪽: 완료 버튼 (혼자 우측 정렬) */}
            <CategoryChip
              label="완료"
              onPress={handleComplete}
              isSelected={true}
              className="px-4 py-2 bg-main rounded-2xl"
            />
          </View>


          <View className="mx-4 mt-2">
            <ScrollView>
              {renderContent()}
            </ScrollView>
          </View>

        </CustomBottomSheet>
        {/* 1. 완료 모 */}
        <WishModal
          isVisible={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="위시리스트의 장소를 추가할까요?"
          icon={<RouteIcon />}
          buttonContainerClass="flex-col space-y-3"
          primaryLabel="AI 추천 일정짜기"
          primaryIcon={<WishStar />}
          ModalIcon="mb-6 mt-[21px]"
          ModalContainer="p-[22px]"
          primaryTitleTextClass="mb-[43px]"
          primaryBtnClass="bg-main w-full py-3"
          primaryTextClass="text-white"
          secondaryLabel="직접 일정짜기"
          secondaryBtnClass="border border-main w-full py-3"
          secondaryTextClass="text-main"
          onPrimaryPress={handleAiPlan}
          onSecondaryPress={handleManualPlan}
        />

        {/* 2. 뒤로가기 모달*/}
        <WishModal
          isVisible={showExitModal}
          onClose={() => setShowExitModal(false)}
          title={`현재 페이지를 나가면\n작성한 내용이 사라집니다.\n정말 나가시겠습니까?`}
          icon={<AlertIcon />}
          buttonContainerClass="flex-row-reverse gap-x-3"
          primaryLabel="머무르기"
          ModalIcon="mb-4"
          ModalContainer="p-4"
          primaryTitleTextClass="mb-4"
          primaryBtnClass="bg-main flex-1 py-3"
          primaryTextClass="text-white"
          secondaryLabel="나가기"
          secondaryBtnClass="bg-chip flex-1 py-3"
          secondaryTextClass="text-gray"
          onPrimaryPress={() => setShowExitModal(false)}
          onSecondaryPress={() => navigation.goBack()}
        />
      </View>
    </SafeAreaView>
  );
};

WishlistScreen.displayName = 'WishlistScreen';

export default WishlistScreen;
export { WishlistScreen };
