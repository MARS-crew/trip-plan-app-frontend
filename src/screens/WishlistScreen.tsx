import React, { useCallback, useRef, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SearchArrowIcon, SearchingIcon, MyLocation, EmptyLocation, EmptyWish, WishStar } from '@/assets/icons';
import BottomSheet from '@gorhom/bottom-sheet';
import CustomBottomSheet from '@/components/ui/CustomBottomSheet';
import { SearchContainer } from '@/components/ui';
import { WishModal } from './wishList/components/WishModal';
import type { RootStackParamList } from '@/navigation/types';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { useState } from "react";
import { RouteIcon, AlertIcon } from '@/assets/icons';
import { COLORS } from '@/constants';
import { BackHandler } from 'react-native';
import { CategoryChip, PlaceCard, PlaceCardProps } from '@/screens/wishList/components';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { ScrollView } from 'react-native-gesture-handler';
import { Shadow } from 'react-native-shadow-2';
// ============ Types ============
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// ============ Component ============
const WishlistScreen: React.FC = () => {
  const BOTTOM_SHEET_MIN_HEIGHT = 28;   // 바텀시트 기본 높이
  const SHEET_HEIGHT = 654;
  const SNAP_LOW = SHEET_HEIGHT - 28;
  const translateY = useSharedValue(SHEET_HEIGHT - BOTTOM_SHEET_MIN_HEIGHT);
  const SEARCH_BUTTON_BOTTOM = BOTTOM_SHEET_MIN_HEIGHT + 10; // 바텀시트 위에 10px 여유
  // 파생 값
  const tabs = React.useMemo(
    () => [
      { id: 'trending', label: '실시간 추천' },
      { id: 'saved', label: '저장된 장소' },
      { id: 'wishlist', label: '위시 리스트' },
    ],
    [],
  );
  const TRENDING_PLACES: PlaceCardProps['place'][] = [
    {
      id: 'place_1',
      title: '센소지 아사쿠사',
      location: '도쿄, 일본',
      description: '도쿄는 일본의 수도이자 전통과 현대가 조화를 이루는 매력적인 도시입니다.',
      categories: ['관광지', '문화', '역사'],
      image: require('@/assets/images/thumnail.png'),
    },
  ]
  const SAVED_PLACES: PlaceCardProps['place'][] = [
    {
      id: 'place_1',
      title: '센소지 아사쿠사',
      location: '도쿄, 일본',
      description: '도쿄는 일본의 수도이자 전통과 현대가 조화를 이루는 매력적인 도시입니다.',
      categories: ['관광지', '문화', '역사'],
      image: require('@/assets/images/thumnail.png'),
    },
    {
      id: 'place_2',
      title: '센소지 아사쿠사',
      location: '도쿄, 일본',
      description: '도쿄는 일본의 수도이자 전통과 현대가 조화를 이루는 매력적인 도시입니다.',
      categories: ['관광지', '문화', '역사'],
      image: require('@/assets/images/thumnail.png'),
    },
  ]
  const WISHLIST_PLACES: PlaceCardProps['place'][] = [
    {
      id: 'place_1',
      title: '센소지 아사쿠사',
      location: '도쿄, 일본',
      description: '도쿄는 일본의 수도이자 전통과 현대가 조화를 이루는 매력적인 도시입니다.',
      categories: ['관광지', '문화', '역사'],
      image: require('@/assets/images/thumnail.png'),
    },
    {
      id: 'place_2',
      title: '센소지 아사쿠사',
      location: '도쿄, 일본',
      description: '도쿄는 일본의 수도이자 전통과 현대가 조화를 이루는 매력적인 도시입니다.',
      categories: ['관광지', '문화', '역사'],
      image: require('@/assets/images/thumnail.png'),
    },

    {
      id: 'place_3',
      title: '센소지 아사쿠사',
      location: '도쿄, 일본',
      description: '도쿄는 일본의 수도이자 전통과 현대가 조화를 이루는 매력적인 도시입니다.',
      categories: ['관광지', '문화', '역사'],
      image: require('@/assets/images/thumnail.png'),
    },
    {
      id: 'place_4',
      title: '센소지 아사쿠사',
      location: '도쿄, 일본',
      description: '도쿄는 일본의 수도이자 전통과 현대가 조화를 이루는 매력적인 도시입니다.',
      categories: ['관광지', '문화', '역사'],
      image: require('@/assets/images/thumnail.png'),
    },
    {
      id: 'place_5',
      title: '센소지 아사쿠사',
      location: '도쿄, 일본',
      description: '도쿄는 일본의 수도이자 전통과 현대가 조화를 이루는 매력적인 도시입니다.',
      categories: ['관광지', '문화', '역사'],
      image: require('@/assets/images/thumnail.png'),
    },


    {
      id: 'place_6',
      title: '센소지 아사쿠사',
      location: '도쿄, 일본',
      description: '도쿄는 일본의 수도이자 전통과 현대가 조화를 이루는 매력적인 도시입니다.',
      categories: ['관광지', '문화', '역사'],
      image: require('@/assets/images/thumnail.png'),
    },
  ]
  const search_places: PlaceCardProps['place'][] = [
    {
      id: 'place_6',
      title: '센소지 아사쿠사',
      location: '도쿄, 일본',
      description: '도쿄는 일본의 수도이자 전통과 현대가 조화를 이루는 매력적인 도시입니다.',
      categories: ['관광지', '문화', '역사'],
      image: require('@/assets/images/thumnail.png'),
    },
    {
      id: 'place_1',
      title: '센소지 아사쿠사',
      location: '도쿄, 일본',
      description: '도쿄는 일본의 수도이자 전통과 현대가 조화를 이루는 매력적인 도시입니다.',
      categories: ['관광지', '문화', '역사'],
      image: require('@/assets/images/thumnail.png'),
    },
  ]


  // 하트 다중 선택용 상태 관리
  const [likedItemIds, setLikedItemIds] = useState<Set<string>>(new Set());

  const toggleLike = useCallback((id: string) => {
    setLikedItemIds((prevIds) => {
      const newIds = new Set(prevIds);
      if (newIds.has(id)) {
        newIds.delete(id);
      } else {
        newIds.add(id);
      }
      return newIds;
    });
  }, []);
  const [isLiked, setIsLiked] = useState(false);
  const navigation = useNavigation<NavigationProp>();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>('trending');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [activeTab, setActiveTab] = React.useState('info');
  const [isSheetExpanded, setIsSheetExpanded] = useState<boolean>(false);
  const searchInputRef = useRef<TextInput>(null);
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
   navigation.navigate('TripDetail');
    setShowAddModal(false);
    // 여기에 AI 일정 생성 페이지로 이동하는 로직 추가
  }, []);

  const handleManualPlan = useCallback(() => {
 navigation.navigate('TripDetail');
    setShowAddModal(false);
    // 여기에 직접 작성 페이지로 이동하는 로직 추가
  }, []);

  const handleComplete = useCallback(() => {
    setShowAddModal(true);
  }, []);

  const handleMapPress = useCallback(() => {
    if (isSheetExpanded) {
      translateY.value = withTiming(SHEET_HEIGHT - 28, {
        duration: 400,
        easing: Easing.out(Easing.exp),
      });
      setIsSheetExpanded(false);
    }
  }, [isSheetExpanded, translateY]);

  const mapUIAnimatedStyle = useAnimatedStyle(() => {
    'worklet'
    const opacity = interpolate(
      translateY.value,
      [SNAP_LOW - 5, SNAP_LOW], // SNAP_LOW 지점에 가까워질 때만 나타남
      [0, 1],
      'clamp'
    );

    return {
      opacity,
      // 버튼의 기본 위치를 70 지점보다 살짝 위로 설정
      pointerEvents: opacity < 0.1 ? 'none' : 'auto',
    };
  });
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
  // 1. 데이터가 있을 때 나오는 화면 (리스트)
  const renderContent = (): React.ReactElement | null => {
    switch (selectedCategory) {
      case 'trending':
        return (
          <>
            <View><Text className="text-h2 font-pretendardSemiBold">현재 핫한 장소</Text></View>
            <View className="mt-4">
              {TRENDING_PLACES.map((place) => (
                <PlaceCard
                  key={`trending-${place.id}`}
                  place={place}
                  isLiked={likedItemIds.has(place.id)}
                  onToggleLike={toggleLike}
                  isTrending={true} // 트렌딩 디자인
                />
              ))}
            </View>
          </>
        );
      case 'saved':
        return (
          <View className="py-4 mr-[1px]">
            {SAVED_PLACES.map((place) => (
              <PlaceCard
                key={`saved-${place.id}`}
                place={place}
                isLiked={likedItemIds.has(place.id)}
                onToggleLike={toggleLike}
              />
            ))}
          </View>
        );
      case 'wishlist':
        return (
          <View className="py-4 mr-[1px]">
            {WISHLIST_PLACES.map((place) => (
              <PlaceCard
                key={`wishlist-${place.id}`}
                place={place}
                isLiked={likedItemIds.has(place.id)}
                onToggleLike={toggleLike}
              />
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  // 데이터가 없을 때 나오는 화면
  const renderEmptyContent = (): React.ReactElement | null => {
    switch (selectedCategory) {
      case 'trending':

        return (
          <>
            <View><Text className="text-h2 font-pretendardSemiBold">현재 핫한 장소</Text></View>
            <View className="mt-4">
              {TRENDING_PLACES.map((place) => (
                <PlaceCard
                  key={`empty-trending-${place.id}`}
                  place={place}
                  isLiked={likedItemIds.has(place.id)}
                  onToggleLike={toggleLike}
                  isTrending={true}
                />
              ))}
            </View>
          </>
        );
      //저장된 장소 데이터 없을 경우
      case 'saved':
        return (
          <View className="py-4 mr-[1px] items-center">
            <View className="mt-20"><EmptyLocation /></View>
            <View className="mt-4"><Text className="text-h2 font-pretendardSemiBold">저장한 장소가 없어요</Text></View>
            <View className="mt-1"><Text className="text-p1 text-gray font-pretendardMedium">마음에 드는 장소를 저장해주세요.</Text></View>
          </View>
        );
      //위시리스트 데이터 없을 경우
      case 'wishlist':
        return (
          <View className="py-4 mr-[1px] items-center">
            <View className="mt-20"><EmptyWish /></View>
            <View className="mt-4"><Text className="text-h2 font-pretendardSemiBold">위시리스트에 장소가 없어요</Text></View>
            <View className="mt-1"><Text className="text-p1 text-gray font-pretendardMedium">가고싶은 장소를 위시리스트에 추가해주세요.</Text></View>
          </View>
        );
      default:
        return null;
    }
  };

  // 2. 렌더링
  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top', 'bottom']}>
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
          }}
        ></MapView>

        {/* 지도 영역만 누르면 바텀시트 내려가기 */}
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 70,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: isSheetExpanded ? 'auto' : 'none',
          }}
          activeOpacity={1}
          onPress={handleMapPress}
        />

        <View className="absolute top-[5px] left-4 right-4 z-50">
          <SearchContainer>
            {/* 왼쪽: 뒤로가기 버튼 */}
            <TouchableOpacity onPress={handleGoBack} className="ml-4 mr-2">
              <SearchArrowIcon />
            </TouchableOpacity>
            {/* 2. 검색 입력창 */}

            <TextInput
              className="flex-1  text-h3 font-pretendardRegular pr-12 text-black"
              placeholder="희망하는 관광지를 검색하세요"
              placeholderTextColor={COLORS.gray}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />

            {/* 3. 검색 아이콘 */}
            <TouchableOpacity className="absolute right-4">
              <SearchingIcon />
            </TouchableOpacity>
          </SearchContainer>
        </View>

        {/* 3. 지도 위 UI를 Animated.View로 감싸고 mapUIAnimatedStyle 적용 */}
        <Animated.View style={[mapUIAnimatedStyle, { position: 'absolute', bottom: SEARCH_BUTTON_BOTTOM, left: 0, right: 0, zIndex: 20 }]}>
          <View className="items-center">
            <CategoryChip
              label="현 지도에서 검색"
              isSelected={true}
              textClassName="text-p1"
              className="px-[29px] py-[10px] rounded-full"
            />
          </View>
          <View className="absolute right-4 bottom-2">
            <Shadow
              distance={4}
              startColor="#00000015"
              offset={[0, 2]}
              style={{ borderRadius: 100 }}
            >
              <TouchableOpacity className="items-center justify-center w-7 h-7 bg-white rounded-full">
                <MyLocation />
              </TouchableOpacity>
            </Shadow>
          </View>
        </Animated.View>
        <CustomBottomSheet
          translateY={translateY}
          onStateChange={handleSheetChange}// 상태 변경 감지
        >

          <View className="flex-row items-center justify-between mt-5 px-4 ">
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


          <View className="mx-4 mt-3 flex-1">
            <ScrollView
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
            >
              {(() => {
                if (selectedCategory === 'trending') {
                  return renderContent();
                }


                const activeData = selectedCategory === 'saved' ? SAVED_PLACES : WISHLIST_PLACES;

                return activeData.length === 0
                  ? renderEmptyContent()
                  : renderContent();
              })()}
            </ScrollView>
          </View>

        </CustomBottomSheet>
        {/* 검색창이 포커스 되었을 때 */}
        {isSearchFocused && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 40,
            }}
          >

            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                setIsSearchFocused(false);


              }}
              onBlur={() => setIsSearchFocused(false)}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'white',
              }}
            />
            {/**검색바 공간 차지 */}
            <View className="px-4 ">
              <View className="h-14 mb-3"></View>
              {search_places.map((place) => (
                <PlaceCard
                  key={`${selectedCategory}-${place.id}`}
                  place={place}
                  isLiked={likedItemIds.has(place.id)}
                  onToggleLike={toggleLike}
                />))}
            </View>
          </View>
        )}
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
          primaryBtnClass="w-full py-3 bg-main"
          primaryTextClass="text-white"
          secondaryLabel="직접 일정짜기"
          secondaryBtnClass="w-full py-3 border border-main "
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
          primaryBtnClass="flex-1 bg-main py-3"
          primaryTextClass="text-white"
          secondaryLabel="나가기"
          secondaryBtnClass=" flex-1 bg-chip py-3"
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
