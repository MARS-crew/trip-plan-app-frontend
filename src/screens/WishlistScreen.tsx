import React, { useCallback, useRef, useEffect, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Keyboard,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MyLocation, WishStar } from '@/assets/icons';
import { WishModal } from './wishList/components/WishModal';
import type { RootStackParamList } from '@/navigation/types';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { RouteIcon, AlertIcon } from '@/assets/icons';
import { BackHandler } from 'react-native';
import {
  CategoryChip,
  PlaceCard,
  PlaceCardProps,
  WishTabSave,
  WishTabTrending,
  WishTabWishlist,
  WishlistBottomSheet,
  WishlistSearchBar,
  WishlistSearchOverlay,
} from '@/screens/wishList/components';
import type { WishlistBottomSheetTabId } from '@/screens/wishList/components';
import type { LikedIdsByTab, LikeTabId, LocationCoords, WishlistTabConfig } from '@/types/wishlist';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Shadow } from 'react-native-shadow-2';

// ============ Types ============
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type TabId = WishlistBottomSheetTabId;
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

const TABS: WishlistTabConfig[] = [
  { id: 'trending', label: '실시간 추천' },
  { id: 'saved', label: '저장된 장소' },
  { id: 'wishlist', label: '위시 리스트' },
];

// 바텀시트 스냅 포인트
const WishlistScreen: React.FC = (): React.JSX.Element => {
  const BOTTOM_SHEET_MIN_HEIGHT = 28;
  const SHEET_HEIGHT = 654;
  const SECOND_SNAP_VISIBLE_HEIGHT = 310;
  const INITIAL_CATEGORY: TabId = 'trending';
  const SNAP_LOW = SHEET_HEIGHT - 28;
  const SNAP_FULL = 35;
  const SNAP_TRENDING = SHEET_HEIGHT - SECOND_SNAP_VISIBLE_HEIGHT;
  const SEARCH_BUTTON_BOTTOM = BOTTOM_SHEET_MIN_HEIGHT + 10;

  const translateY = useSharedValue(SNAP_LOW);

  const [likedIdsByTab, setLikedIdsByTab] = useState<LikedIdsByTab>(() => ({
    saved: new Set<string>(),
    wishlist: new Set(WISHLIST_PLACES.map((place) => place.id)),
  }));

  const toggleLike = useCallback((tab: LikeTabId, id: string): void => {
    setLikedIdsByTab((prev) => {
      const next = new Set(prev[tab]);
      next.has(id) ? next.delete(id) : next.add(id);
      return { ...prev, [tab]: next };
    });
  }, []);

  const isLikedInTab = useCallback(
    (tab: LikeTabId, id: string): boolean => likedIdsByTab[tab].has(id),
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
  const refocusRafRef = useRef<number | null>(null);
  const isSearchFocusedRef = useRef(false);
  const isKeyboardVisibleRef = useRef(false);
  const isInitialTabEffect = useRef(true);
  const showAddModalRef = useRef(false);
  const showExitModalRef = useRef(false);
  const mapRef = useRef<MapView>(null);
  const currentLocationRef = useRef<LocationCoords | null>(null);
  useEffect(() => {
    showAddModalRef.current = showAddModal;
  }, [showAddModal]);
  useEffect(() => {
    showExitModalRef.current = showExitModal;
  }, [showExitModal]);

  useEffect(() => {
    isSearchFocusedRef.current = isSearchFocused;
  }, [isSearchFocused]);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => {
      isKeyboardVisibleRef.current = true;
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      isKeyboardVisibleRef.current = false;
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const clearPendingRefocus = useCallback((): void => {
    if (refocusRafRef.current !== null) {
      cancelAnimationFrame(refocusRafRef.current);
      refocusRafRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearPendingRefocus();
  }, [clearPendingRefocus]); // 바텀시트 애니메이션 함수
  const animateSheetTo = useCallback(
    (targetY: number): void => {
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
    },
    [SNAP_LOW, translateY],
  ); // 바텀시트 상태 변화 핸들러
  const handleSheetChange = useCallback((expanded: boolean): void => {
    setIsSheetExpanded(expanded);
  }, []); // 검색 입력창에 포커스 주기
  const focusSearchInput = useCallback((): void => {
    const input = searchInputRef.current;
    if (!input) return;

    clearPendingRefocus();

    if (Platform.OS === 'android' && input.isFocused()) {
      if (isKeyboardVisibleRef.current) return;
      input.blur();
      refocusRafRef.current = requestAnimationFrame(() => {
        refocusRafRef.current = null;
        if (!isSearchFocusedRef.current) return;
        input.focus();
      });
      return;
    }

    input.focus();
  }, [clearPendingRefocus]); // 검색 입력창에 포커스 될 때 → 검색어 상태 업데이트 + 키보드 올리기
  const handleSearchFocus = useCallback((): void => {
    isSearchFocusedRef.current = true;
    setIsSearchFocused(true);
  }, []); // 검색 입력창에서 포커스 벗어날 때 → 검색어 초기화 + 키보드 내리기
  const handleSearchBlur = useCallback((): void => {
    clearPendingRefocus();
    isSearchFocusedRef.current = false;
    isKeyboardVisibleRef.current = false;
    searchInputRef.current?.blur();
    setIsSearchFocused(false);
    Keyboard.dismiss();
  }, [clearPendingRefocus]);
  const handleSearchInputBlur = useCallback((): void => {
    // Intentionally keep search mode active; only hide keyboard on blur.
  }, []); // 뒤로가기 버튼 핸들러: 검색 중이면 검색 종료, 그 외에는 모달 열기
  const handleGoBack = useCallback((): void => {
    if (isSearchFocused) {
      handleSearchBlur();
      return;
    }
    setShowExitModal(true);
  }, [isSearchFocused, handleSearchBlur]); // AI 추천 일정짜기 버튼 핸들러 → TripDetail로 이동 + 모달 닫기
  const handleAiPlan = useCallback((): void => {
    navigation.navigate('TripDetail');
    setShowAddModal(false);
  }, [navigation]); // 직접 일정짜기 버튼 핸들러 → TripDetail로 이동 + 모달 닫기
  const handleManualPlan = useCallback((): void => {
    navigation.navigate('TripDetail');
    setShowAddModal(false);
  }, [navigation]); // 완료 버튼 핸들러 → 모달 열기
  const handleComplete = useCallback((): void => setShowAddModal(true), []); // 지도 영역 누르면 바텀시트 내려가기
  const handleMapPress = useCallback((): void => {
    if (isSheetExpanded) animateSheetTo(SNAP_LOW);
  }, [animateSheetTo, isSheetExpanded, SNAP_LOW]); // 좋아요 토글 핸들러 + 상태 조회 함수 (탭별)

  const handleToggleSaved = useCallback(
    (id: string): void => toggleLike('saved', id),
    [toggleLike],
  );
  const handleToggleWishlist = useCallback(
    (id: string): void => toggleLike('wishlist', id),
    [toggleLike],
  );
  const isSavedLiked = useCallback(
    (id: string): boolean => isLikedInTab('saved', id),
    [isLikedInTab],
  );
  const isWishlistLiked = useCallback(
    (id: string): boolean => isLikedInTab('wishlist', id),
    [isLikedInTab],
  ); // 탭 변경 시 바텀시트 애니메이션
  useEffect(() => {
    if (isInitialTabEffect.current) {
      isInitialTabEffect.current = false;
      return;
    }
    const targetY = selectedCategory === 'trending' ? SNAP_TRENDING : SNAP_FULL;
    animateSheetTo(targetY);
  }, [selectedCategory, animateSheetTo, SNAP_TRENDING, SNAP_FULL]); // 바텀시트 애니메이션 스타일
  const mapUIAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    const opacity = interpolate(translateY.value, [SNAP_LOW - 5, SNAP_LOW], [0, 1], 'clamp');
    return { opacity, pointerEvents: opacity < 0.1 ? 'none' : 'auto' };
  }); //  뒤로가기 버튼 핸들링 + 모달 상태 초기화
  useFocusEffect(
    useCallback(() => {
      setShowAddModal(false);
      setShowExitModal(false);

      if (selectedCategory === 'trending' && translateY.value < SNAP_TRENDING) {
        animateSheetTo(SNAP_TRENDING);
      }

      const backAction = (): boolean => {
        if (showExitModalRef.current || showAddModalRef.current) return true;
        if (isSearchFocused) {
          handleSearchBlur();
          return true;
        }
        setShowExitModal(true);
        return true;
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
      return () => backHandler.remove();
    }, [
      selectedCategory,
      SNAP_TRENDING,
      animateSheetTo,
      translateY,
      isSearchFocused,
      handleSearchBlur,
    ]),
  );
  const handleUserLocationChange: NonNullable<
    React.ComponentProps<typeof MapView>['onUserLocationChange']
  > = useCallback((event) => {
    const coords = event.nativeEvent.coordinate;
    if (!coords) return;
    currentLocationRef.current = {
      latitude: coords.latitude,
      longitude: coords.longitude,
    };
  }, []);

  const moveToCurrentLocation = async (): Promise<void> => {
    // 1. 안드로이드 권한 확인 및 요청
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('위치 권한 거부됨');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    } // 2. 이미 지도가 파악한 위치(currentLocation)가 있다면 해당 위치로 이동

   if (currentLocationRef.current) {
      mapRef.current?.animateToRegion(
        {
          latitude: currentLocationRef.current.latitude,
          longitude: currentLocationRef.current.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000,
      );
    } else {
      Alert.alert('위치 확인 중', '현재 위치를 수신하고 있습니다. 잠시 후 다시 시도해주세요.');
    }
  }; //탭 컨텐츠
  const renderTabContent = (): React.ReactNode => {
    switch (selectedCategory) {
      case 'trending':
        return (
          <WishTabTrending
            places={TRENDING_PLACES}
            onToggleLike={(id) => toggleLike('wishlist', id)}
          />
        );
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
          ref={mapRef} // 2. ref 연결
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          showsUserLocation={true} // 내 위치 파란 점 표시
          showsMyLocationButton={false} // 구글 기본 버튼은 숨김 (커스텀 버튼 사용)
          onUserLocationChange={handleUserLocationChange}
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
        <WishlistSearchBar
          searchInputRef={searchInputRef}
          searchQuery={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={handleSearchFocus}
          onBlur={handleSearchInputBlur}
          onFocusInput={focusSearchInput}
          onPressBack={handleGoBack}
        />
        <Animated.View
          style={[
            mapUIAnimatedStyle,
            { position: 'absolute', bottom: SEARCH_BUTTON_BOTTOM, left: 0, right: 0, zIndex: 20 },
          ]}>
          <View className="items-center">
            <CategoryChip
              label="현 지도에서 검색"
              isSelected={true}
              textClassName="text-p1"
              className="rounded-full px-[29px] py-[10px]"
            />
          </View>
          <View className="absolute bottom-2 right-4">
            <Shadow
              distance={4}
              startColor="#00000015"
              offset={[0, 2]}
              style={{ borderRadius: 100 }}>
              <TouchableOpacity
                className="h-7 w-7 items-center justify-center rounded-full bg-white"
                onPress={moveToCurrentLocation}>
                <MyLocation />
              </TouchableOpacity>
            </Shadow>
          </View>
        </Animated.View>

        {!isSearchFocused && (
          <WishlistBottomSheet
            translateY={translateY}
            onStateChange={handleSheetChange}
            maxTopSnap={selectedCategory === 'trending' ? SNAP_TRENDING : SNAP_FULL}
            tabs={TABS}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onPressComplete={handleComplete}
            renderTabContent={renderTabContent}
          />
        )}

        {isSearchFocused && (
          <WishlistSearchOverlay
            isVisible={isSearchFocused}
            selectedCategory={selectedCategory}
            places={SEARCH_PLACES}
            isLiked={(id) =>
              isLikedInTab(selectedCategory === 'trending' ? 'wishlist' : selectedCategory, id)
            }
            onToggleLike={(id) =>
              toggleLike(selectedCategory === 'trending' ? 'wishlist' : selectedCategory, id)
            }
          />
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
