import React, { useCallback, useRef, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, Pressable, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SearchArrowIcon, SearchingIcon, MyLocation, WishStar } from '@/assets/icons';
import { SearchContainer } from '@/components/ui';
import { WishModal } from './wishList/components/WishModal';
import type { RootStackParamList } from '@/navigation/types';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { useState } from "react";
import { RouteIcon, AlertIcon } from '@/assets/icons';
import { COLORS } from '@/constants';
import { BackHandler } from 'react-native';
import { CategoryChip, PlaceCard, PlaceCardProps, WishTabSave, WishTabTrending, WishTabWishlist, WishlistBottomSheet } from '@/screens/wishList/components';
import type { WishlistBottomSheetTabId } from '@/screens/wishList/components';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedReaction,
  interpolate,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Shadow } from 'react-native-shadow-2';

// ============ Types ============
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type TabId = WishlistBottomSheetTabId;
type LikeTabId = Exclude<TabId, 'trending'>;
//더미 데이터 - 실제 API 연동 시 제거 예정
const TRENDING_PLACES: PlaceCardProps['place'][] = [
  {
    id: 'place_1',
    title: '센소지 아사쿠사',
    location: '도쿄, 일본',
    description: '도쿄는 일본의 수도이자 전통과 현대가 조화를 이루는 매력적인 도시입니다.',
    categories: ['관광지', '문화', '역사'],
    image: require('@/assets/images/thumnail.png'),
  },
];

const SAVED_PLACES: PlaceCardProps['place'][] = [
  {
    id: 'placeS_1',
    title: '센소지 아사쿠사',
    location: '도쿄, 일본',
    description: '도쿄는 일본의 수도이자 전통과 현대가 조화를 이루는 매력적인 도시입니다.',
    categories: ['관광지', '문화', '역사'],
    image: require('@/assets/images/thumnail.png'),
  },
  {
    id: 'placeS_2',
    title: '센소지 아사쿠사',
    location: '도쿄, 일본',
    description: '도쿄는 일본의 수도이자 전통과 현대가 조화를 이루는 매력적인 도시입니다.',
    categories: ['관광지', '문화', '역사'],
    image: require('@/assets/images/thumnail.png'),
  },
];

const WISHLIST_PLACES: PlaceCardProps['place'][] = [
  {
    id: 'placeW_1',
    title: '센소지 아사쿠사',
    location: '도쿄, 일본',
    description: '도쿄는 일본의 수도이자 전통과 현대가 조화를 이루는 매력적인 도시입니다.',
    categories: ['관광지', '문화', '역사'],
    image: require('@/assets/images/thumnail.png'),
  },
  {
    id: 'placeW_2',
    title: '센소지 아사쿠사',
    location: '도쿄, 일본',
    description: '도쿄는 일본의 수도이자 전통과 현대가 조화를 이루는 매력적인 도시입니다.',
    categories: ['관광지', '문화', '역사'],
    image: require('@/assets/images/thumnail.png'),
  },
  {
    id: 'placeW_3',
    title: '센소지 아사쿠사',
    location: '도쿄, 일본',
    description: '도쿄는 일본의 수도이자 전통과 현대가 조화를 이루는 매력적인 도시입니다.',
    categories: ['관광지', '문화', '역사'],
    image: require('@/assets/images/thumnail.png'),
  },
  {
    id: 'placeW_4',
    title: '센소지 아사쿠사',
    location: '도쿄, 일본',
    description: '도쿄는 일본의 수도이자 전통과 현대가 조화를 이루는 매력적인 도시입니다.',
    categories: ['관광지', '문화', '역사'],
    image: require('@/assets/images/thumnail.png'),
  },
  {
    id: 'placeW_5',
    title: '센소지 아사쿠사',
    location: '도쿄, 일본',
    description: '도쿄는 일본의 수도이자 전통과 현대가 조화를 이루는 매력적인 도시입니다.',
    categories: ['관광지', '문화', '역사'],
    image: require('@/assets/images/thumnail.png'),
  },
  {
    id: 'placeW_6',
    title: '센소지 아사쿠사',
    location: '도쿄, 일본',
    description: '도쿄는 일본의 수도이자 전통과 현대가 조화를 이루는 매력적인 도시입니다.',
    categories: ['관광지', '문화', '역사'],
    image: require('@/assets/images/thumnail.png'),
  },
];

const SEARCH_PLACES: PlaceCardProps['place'][] = [
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
];

const TABS: { id: TabId; label: string }[] = [
  { id: 'trending', label: '실시간 추천' },
  { id: 'saved', label: '저장된 장소' },
  { id: 'wishlist', label: '위시 리스트' },
];

// 바텀시트 스냅 포인트
const WishlistScreen: React.FC = () => {
  const BOTTOM_SHEET_MIN_HEIGHT = 28;
  const SHEET_HEIGHT = 654;
  const SECOND_SNAP_VISIBLE_HEIGHT = 310;
  const INITIAL_CATEGORY: TabId = 'trending';
  const SNAP_LOW = SHEET_HEIGHT - 28;
  const SNAP_FULL = 0;
  const SNAP_TRENDING = SHEET_HEIGHT - SECOND_SNAP_VISIBLE_HEIGHT;
  const SEARCH_BUTTON_BOTTOM = BOTTOM_SHEET_MIN_HEIGHT + 10;

  const translateY = useSharedValue(SNAP_LOW);
  const isTrendingTabSV = useSharedValue(INITIAL_CATEGORY === 'trending');

  const [likedIdsByTab, setLikedIdsByTab] = useState<Record<LikeTabId, Set<string>>>(() => ({
    saved: new Set<string>(),
    wishlist: new Set(WISHLIST_PLACES.map((place) => place.id)),
  }));

  const toggleLike = useCallback((tab: LikeTabId, id: string) => {
    setLikedIdsByTab((prev) => {
      const next = new Set(prev[tab]);
      next.has(id) ? next.delete(id) : next.add(id);
      return { ...prev, [tab]: next };
    });
  }, []);

  const isLikedInTab = useCallback(
    (tab: LikeTabId, id: string) => likedIdsByTab[tab].has(id),
    [likedIdsByTab],
  );

  const navigation = useNavigation<NavigationProp>();
  const [selectedCategory, setSelectedCategory] = useState<TabId>(INITIAL_CATEGORY);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [isSheetExpanded, setIsSheetExpanded] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<TextInput>(null);
  const isInitialTabEffect = useRef(true);
  const showAddModalRef = useRef(false);
  const showExitModalRef = useRef(false);

  useEffect(() => { showAddModalRef.current = showAddModal; }, [showAddModal]);
  useEffect(() => { showExitModalRef.current = showExitModal; }, [showExitModal]);
  useEffect(() => {
    isTrendingTabSV.value = selectedCategory === 'trending';
  }, [isTrendingTabSV, selectedCategory]);
  // 바텀시트 애니메이션 함수
  const animateSheetTo = useCallback((targetY: number) => {
    const currentY = translateY.value;
    const distance = Math.abs(targetY - currentY);
    const isMovingDown = targetY > currentY;

    if (isMovingDown) {
      const duration = Math.max(260, Math.min(620, distance * 0.95));
      translateY.value = withTiming(targetY, { duration, easing: Easing.out(Easing.cubic) });
    } else {
      const duration = Math.max(240, Math.min(700, distance * 1.02));
      translateY.value = withTiming(targetY, { duration, easing: Easing.out(Easing.cubic) });
    }
    setIsSheetExpanded(targetY !== SNAP_LOW);
  }, [SNAP_LOW, translateY]);
  // 바텀시트 상태 변화 핸들러
  const handleSheetChange = useCallback((expanded: boolean) => {
    setIsSheetExpanded(expanded);
  }, []);
  // 검색 입력창에 포커스 주기
  const focusSearchInput = useCallback(() => {
    searchInputRef.current?.focus();
  }, []);
  // 검색 입력창에 포커스 될 때 → 검색어 상태 업데이트 + 키보드 올리기
  const handleSearchFocus = useCallback(() => setIsSearchFocused(true), []);
  // 검색 입력창에서 포커스 벗어날 때 → 검색어 초기화 + 키보드 내리기
  const handleSearchBlur = useCallback(() => {
    setIsSearchFocused(false);
    Keyboard.dismiss();
  }, []);
  // 뒤로가기 버튼 핸들러 → 모달 열기
  const handleGoBack = useCallback(() => setShowExitModal(true), []);
  // AI 추천 일정짜기 버튼 핸들러 → TripDetail로 이동 + 모달 닫기
  const handleAiPlan = useCallback(() => {
    navigation.navigate('TripDetail');
    setShowAddModal(false);
  }, [navigation]);
  // 직접 일정짜기 버튼 핸들러 → TripDetail로 이동 + 모달 닫기
  const handleManualPlan = useCallback(() => {
    navigation.navigate('TripDetail');
    setShowAddModal(false);
  }, [navigation]);
  // 완료 버튼 핸들러 → 모달 열기
  const handleComplete = useCallback(() => setShowAddModal(true), []);
  // 지도 영역 누르면 바텀시트 내려가기
  const handleMapPress = useCallback(() => {
    if (isSheetExpanded) animateSheetTo(SNAP_LOW);
  }, [animateSheetTo, isSheetExpanded, SNAP_LOW]);

  // 좋아요 토글 핸들러 + 상태 조회 함수 (탭별)
  const handleToggleSaved = useCallback(
    (id: string) => toggleLike('saved', id),
    [toggleLike],
  );
  const handleToggleWishlist = useCallback(
    (id: string) => toggleLike('wishlist', id),
    [toggleLike],
  );
  const isSavedLiked = useCallback(
    (id: string) => isLikedInTab('saved', id),
    [isLikedInTab],
  );
  const isWishlistLiked = useCallback(
    (id: string) => isLikedInTab('wishlist', id),
    [isLikedInTab],
  );
  // 탭 변경 시 바텀시트 애니메이션
  useEffect(() => {
    if (isInitialTabEffect.current) {
      isInitialTabEffect.current = false;
      return;
    }
    const targetY = selectedCategory === 'trending' ? SNAP_TRENDING : SNAP_FULL;
    animateSheetTo(targetY);
  }, [selectedCategory, animateSheetTo, SNAP_TRENDING, SNAP_FULL]);

  useAnimatedReaction(
    () => ({ y: translateY.value, isTrending: isTrendingTabSV.value }),
    ({ y, isTrending }, prev) => {
      const isMovingUp = y < (prev?.y ?? y);
      if (isTrending && isMovingUp && y < SNAP_TRENDING) {
        translateY.value = SNAP_TRENDING;
      }
    },
  );
  // 바텀시트 애니메이션 스타일
  const mapUIAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    const opacity = interpolate(
      translateY.value,
      [SNAP_LOW - 5, SNAP_LOW],
      [0, 1],
      'clamp',
    );
    return { opacity, pointerEvents: opacity < 0.1 ? 'none' : 'auto' };
  });
  //  뒤로가기 버튼 핸들링 + 모달 상태 초기화
  useFocusEffect(
    useCallback(() => {
      setShowAddModal(false);
      setShowExitModal(false);

      if (selectedCategory === 'trending' && translateY.value < SNAP_TRENDING) {
        animateSheetTo(SNAP_TRENDING);
      }

      const backAction = () => {
        if (showExitModalRef.current || showAddModalRef.current) return true;
        setShowExitModal(true);
        return true;
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
      return () => backHandler.remove();
    }, [selectedCategory, SNAP_TRENDING, animateSheetTo, translateY]),
  );

  //탭 컨텐츠
  const renderTabContent = () => {
    switch (selectedCategory) {
      case 'trending':
        return <WishTabTrending places={TRENDING_PLACES} />;
      case 'saved':
        return (
          <WishTabSave
            places={SAVED_PLACES}
            isLiked={isSavedLiked}
            onToggleLike={handleToggleSaved}
          />
        );
      case 'wishlist':
        return (
          <WishTabWishlist
            places={WISHLIST_PLACES}
            isLiked={isWishlistLiked}
            onToggleLike={handleToggleWishlist}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top', 'bottom']}>
      <View className="flex-1">
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          initialRegion={{
            latitude: 37.482476,
            longitude: 126.941574,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />

        {/* 지도 영역 누르면 바텀시트 내려가기 */}
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

        <Pressable className="absolute top-[5px] left-4 right-4 z-50" onPress={focusSearchInput}>
          <SearchContainer>
            <TouchableOpacity onPress={handleGoBack} className="ml-4 mr-2">
              <SearchArrowIcon />
            </TouchableOpacity>
            <TextInput
              ref={searchInputRef}
              className="flex-1 text-h3 font-pretendardRegular pr-12 text-black"
              placeholder="희망하는 관광지를 검색하세요"
              placeholderTextColor={COLORS.gray}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
            />
            <TouchableOpacity className="absolute right-4">
              <SearchingIcon />
            </TouchableOpacity>
          </SearchContainer>
        </Pressable>

        <Animated.View
          style={[
            mapUIAnimatedStyle,
            { position: 'absolute', bottom: SEARCH_BUTTON_BOTTOM, left: 0, right: 0, zIndex: 20 },
          ]}
        >
          <View className="items-center">
            <CategoryChip
              label="현 지도에서 검색"
              isSelected={true}
              textClassName="text-p1"
              className="px-[29px] py-[10px] rounded-full"
            />
          </View>
          <View className="absolute right-4 bottom-2">
            <Shadow distance={4} startColor="#00000015" offset={[0, 2]} style={{ borderRadius: 100 }}>
              <TouchableOpacity className="items-center justify-center w-7 h-7 bg-white rounded-full">
                <MyLocation />
              </TouchableOpacity>
            </Shadow>
          </View>
        </Animated.View>

        <WishlistBottomSheet
          translateY={translateY}
          onStateChange={handleSheetChange}
          maxTopSnap={selectedCategory === 'trending' ? SNAP_TRENDING : 0}
          tabs={TABS}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onPressComplete={handleComplete}
          renderTabContent={renderTabContent}
        />

        {/* 검색 포커스 오버레이 */}
        {isSearchFocused && (
          <View
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 40 }}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={handleSearchBlur}
              style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'white',
              }}
            />
            <View className="px-4">
              <View className="h-14 mb-3" />
              {SEARCH_PLACES.map((place) => (
                <PlaceCard
                  key={`${selectedCategory}-${place.id}`}
                  place={place}
                  isLiked={selectedCategory === 'trending' ? false : isLikedInTab(selectedCategory, place.id)}
                  onToggleLike={(id) => {
                    if (selectedCategory !== 'trending') toggleLike(selectedCategory, id);
                  }}
                />
              ))}
            </View>
          </View>
        )}

        {/* 완료 모달 */}
        <WishModal
          isVisible={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="위시리스트의 장소를 추가할까요?"
          showCloseButton={true}
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
          secondaryBtnClass="w-full py-3 border border-main"
          secondaryTextClass="text-main"
          onPrimaryPress={handleAiPlan}
          onSecondaryPress={handleManualPlan}
        />

        {/* 뒤로가기 모달 */}
        <WishModal
          isVisible={showExitModal}
          onClose={() => setShowExitModal(false)}
          title={`현재 페이지를 나가면\n작성한 내용이 사라집니다.\n정말 나가시겠습니까?`}
          showCloseButton={false}
          icon={<AlertIcon />}
          buttonContainerClass="flex-row-reverse gap-x-3"
          primaryLabel="머무르기"
          ModalIcon="mb-4"
          ModalContainer="p-4"
          primaryTitleTextClass="mb-4"
          primaryBtnClass="flex-1 bg-main py-3"
          primaryTextClass="text-white"
          secondaryLabel="나가기"
          secondaryBtnClass="flex-1 bg-chip py-3"
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