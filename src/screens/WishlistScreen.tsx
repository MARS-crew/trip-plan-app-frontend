import React, { useCallback, useRef, useEffect, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Platform,
  PermissionsAndroid,
  ToastAndroid,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MyLocation, WishStar } from '@/assets/icons';
import { WishModal } from '@/screens/wishList/components/WishModal';
import type { RootStackParamList } from '@/navigation/types';
import { LoadingView } from '@/components/ui';
import MapView, { PROVIDER_GOOGLE, Marker, type Region } from 'react-native-maps';
import { RouteIcon, AlertIcon } from '@/assets/icons';
import { BackHandler } from 'react-native';
import {
  CategoryChip,
  PlaceCard,
  PlaceCardProps,
  WishTabSave,
  WishTabWishlist,
  WishlistBottomSheet,
  WishlistSearchBar,
  WishlistSearchOverlay,
} from '@/screens/wishList/components';
import type { WishlistBottomSheetTabId } from '@/types/wishlist';
import type {
  LikedIdsByTab,
  LikeTabId,
  LocationCoords,
  WishlistTabConfig,
  WishPlace,
} from '@/types/wishlist';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Shadow } from 'react-native-shadow-2';
import {
  addWishlistPlace,
  createSchedule,
  deleteWishlistPlace,
  generateTripSchedules,
  getTripSchedules,
  getWishlistRecommendations,
} from '@/services';
import { getPlaceSelection, getSearchResults } from '@/services/searchService';
import { searchNearbyPlaces, type NearbyPlace } from '@/services/mapPlaceService';
import type { PlaceSelectionPlace } from '@/types/wishlist';
import type { WishlistRecommendationPlace } from '@/services/wishList';
import type { GenerateTripSchedulesData } from '@/types/tripDetail.types';
import type { CreateScheduleRequest } from '@/types/myTrip.types';
import type { SearchWishPlace } from '@/screens/wishList/components/WishlistSearchOverlay';

// ============ Types ============
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type TabId = WishlistBottomSheetTabId;
const SCHEDULE_TITLE_MAX_LENGTH = 10;

const convertPlaceDataToWishPlace = (place: PlaceSelectionPlace): PlaceCardProps['place'] => ({
  id: place.placeId.toString(),
  title: place.name,
  location: `${place.cityName}, ${place.countryName}`,
  description: place.address,
  categories: [place.placeType],
  image: { uri: place.imageUrl },
});

const convertRecommendationToWishPlace = (
  place: WishlistRecommendationPlace,
): PlaceCardProps['place'] => ({
  id: place.placeId.toString(),
  title: place.name,
  location: [place.cityName, place.countryName].filter(Boolean).join(', '),
  description: place.address || place.description || '',
  categories: place.tags?.length ? place.tags : place.placeType ? [place.placeType] : undefined,
  image: place.imageUrl ? { uri: place.imageUrl } : undefined,
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const toStringValue = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
};

const toNumberValue = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value !== 'string') return undefined;
  const parsed = Number(value.trim());
  return Number.isFinite(parsed) ? parsed : undefined;
};

const getVisibleCharacters = (value: string): string[] => Array.from(value.normalize('NFC'));

const limitVisibleCharacters = (value: string, maxLength: number): string =>
  getVisibleCharacters(value).slice(0, maxLength).join('');

const getScheduleTitleFromPlace = (place: WishPlace): string =>
  limitVisibleCharacters(place.title.trim(), SCHEDULE_TITLE_MAX_LENGTH) || '일정';

const getManualScheduleTime = (index: number): { startTime: string; endTime: string } => {
  const startHour = Math.min(9 + index * 2, 22);
  const endHour = Math.min(startHour + 1, 23);
  return {
    startTime: `${String(startHour).padStart(2, '0')}:00`,
    endTime: `${String(endHour).padStart(2, '0')}:00`,
  };
};

const buildGeneratedSchedulePayloads = (
  generatedTrip: GenerateTripSchedulesData,
): CreateScheduleRequest[] =>
  generatedTrip.dailySchedules.flatMap((dayGroup) => {
    if (!isRecord(dayGroup)) return [];

    const scheduleDate = toStringValue(dayGroup.scheduleDate);
    const schedules = Array.isArray(dayGroup.schedules) ? dayGroup.schedules : [];

    return schedules.flatMap((schedule) => {
      if (!isRecord(schedule)) return [];

      const title =
        toStringValue(schedule.title) ??
        toStringValue(schedule.placeName) ??
        toStringValue(schedule.address);
      const resolvedScheduleDate = toStringValue(schedule.scheduleDate) ?? scheduleDate;
      if (!title || !resolvedScheduleDate) return [];

      return [
        {
          title,
          scheduleDate: resolvedScheduleDate,
          startTime: toStringValue(schedule.startTime),
          endTime: toStringValue(schedule.endTime),
          placeId: toNumberValue(schedule.placeId),
          placeName: toStringValue(schedule.placeName),
          address: toStringValue(schedule.address),
          memo: toStringValue(schedule.memo),
        },
      ];
    });
  });

const saveGeneratedSchedules = async (
  tripId: number,
  generatedTrip: GenerateTripSchedulesData,
): Promise<boolean> => {
  const schedulePayloads = buildGeneratedSchedulePayloads(generatedTrip);
  if (!schedulePayloads.length) return false;

  const results = await Promise.all(
    schedulePayloads.map((payload) => createSchedule({ tripId, payload })),
  );
  return results.every((result) => !result.error);
};
//더미 데이터 - 실제 API 연동 시 제거 예정
const TABS: WishlistTabConfig[] = [
  { id: 'realtime', label: '실시간 추천' },
  { id: 'saved', label: '저장된 장소' },
  { id: 'wishlist', label: '위시 리스트' },
];

const GOOGLE_HQ_REGION = {
  latitude: 37.4220936,
  longitude: -122.083922,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

// 바텀시트 스냅 포인트
const BOTTOM_SHEET_MIN_HEIGHT = 28;
const SHEET_HEIGHT = 654;
const SECOND_SNAP_VISIBLE_HEIGHT = 310;
const INITIAL_CATEGORY: TabId = 'saved';
const SNAP_LOW = SHEET_HEIGHT - 28;
const SNAP_FULL = 35;
const SNAP_TRENDING = SHEET_HEIGHT - SECOND_SNAP_VISIBLE_HEIGHT;
const SEARCH_BUTTON_BOTTOM = BOTTOM_SHEET_MIN_HEIGHT + 10;
const RECOMMENDATION_LIMIT = 10;

const getRegionRadiusMeters = (region: Region): number =>
  Math.min(Math.max(Math.round((region.latitudeDelta / 2) * 111000), 500), 50000);

const hasRegionChanged = (a: Region, b: Region): boolean => {
  const threshold = 0.000001;
  return (
    Math.abs(a.latitude - b.latitude) > threshold ||
    Math.abs(a.longitude - b.longitude) > threshold ||
    Math.abs(a.latitudeDelta - b.latitudeDelta) > threshold ||
    Math.abs(a.longitudeDelta - b.longitudeDelta) > threshold
  );
};

const WishlistScreen: React.FC = (): React.JSX.Element => {
  const route = useRoute();
  const navigation = useNavigation<NavigationProp>();
  const translateY = useSharedValue(SNAP_LOW);
  const tripId = (route.params as { tripId?: number })?.tripId;

  const [savedPlaces, setSavedPlaces] = useState<PlaceCardProps['place'][]>([]);
  const [wishlistPlaces, setWishlistPlaces] = useState<PlaceCardProps['place'][]>([]);
  const [recommendedPlaces, setRecommendedPlaces] = useState<PlaceCardProps['place'][]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [recommendationEmptyMessage, setRecommendationEmptyMessage] =
    useState('추천 장소가 없습니다.');
  const [wishlistPlaceIdMap, setWishlistPlaceIdMap] = useState<Record<string, number>>({});
  const [tripDay1Date, setTripDay1Date] = useState<string | null>(null);

  const [likedIdsByTab, setLikedIdsByTab] = useState<LikedIdsByTab>(() => ({
    realtime: new Set<string>(),
    saved: new Set<string>(),
    wishlist: new Set<string>(),
  }));
  useEffect(() => {
    const loadPlaceSelection = async () => {
      if (typeof tripId !== 'number') {
        setSavedPlaces([]);
        setWishlistPlaces([]);
        setRecommendedPlaces([]);
        setWishlistPlaceIdMap({});
        setTripDay1Date(null);
        setLikedIdsByTab({
          realtime: new Set<string>(),
          saved: new Set<string>(),
          wishlist: new Set<string>(),
        });
        return;
      }

      try {
        const [response, tripResult] = await Promise.all([
          getPlaceSelection(tripId),
          getTripSchedules({ tripId }),
        ]);

        const tripData = tripResult.data as { startDate?: string } | null;
        setTripDay1Date(tripData?.startDate ?? null);

        const convertedSavedPlaces = response.data.savedPlaces.map(convertPlaceDataToWishPlace);
        const convertedWishlistPlaces = response.data.wishlistPlaces.map(
          convertPlaceDataToWishPlace,
        );

        const idMap: Record<string, number> = {};
        response.data.wishlistPlaces.forEach((place) => {
          idMap[place.placeId.toString()] = place.selectionId;
        });

        setSavedPlaces(convertedSavedPlaces);
        setWishlistPlaces(convertedWishlistPlaces);
        setWishlistPlaceIdMap(idMap);
        setLikedIdsByTab({
          realtime: new Set<string>(),
          saved: new Set<string>(),
          wishlist: new Set(convertedWishlistPlaces.map((place) => place.id)),
        });
      } catch {
        setSavedPlaces([]);
        setWishlistPlaces([]);
        setRecommendedPlaces([]);
        setWishlistPlaceIdMap({});
        setTripDay1Date(null);
        setLikedIdsByTab({
          realtime: new Set<string>(),
          saved: new Set<string>(),
          wishlist: new Set<string>(),
        });
      }
    };

    loadPlaceSelection();
  }, [tripId]);

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

  const addWishlistPlaceById = useCallback(
    async (tab: LikeTabId, id: string): Promise<boolean> => {
      if (typeof tripId !== 'number') {
        return false;
      }

      const placeId = Number(id);
      if (!Number.isInteger(placeId)) {
        return false;
      }

      const sourceType = tab === 'saved' ? 'SAVED' : 'RECOMMEND';

      try {
        const result = await addWishlistPlace(tripId, { placeId, sourceType });
        if (result.added && result.wishlistPlaceId != null) {
          setWishlistPlaceIdMap((prev) => ({ ...prev, [id]: result.wishlistPlaceId! }));
        }
        return result.added;
      } catch {
        return false;
      }
    },
    [tripId],
  );

  const handleToggleLikeWithApi = useCallback(
    (tab: LikeTabId, id: string, placeData?: WishPlace): void => {
      const currentlyLiked = isLikedInTab(tab, id);
      const wasWishlistLiked = isLikedInTab('wishlist', id);

      if (currentlyLiked) {
        if (tab === 'saved' || tab === 'realtime') {
          const removedPlace = wishlistPlaces.find((place) => place.id === id);
          const wishlistPlaceId = wishlistPlaceIdMap[id];

          setLikedIdsByTab((prev) => {
            const nextRealtime = new Set(prev.realtime);
            const nextSaved = new Set(prev.saved);
            const nextWishlist = new Set(prev.wishlist);

            nextRealtime.delete(id);
            nextSaved.delete(id);
            nextWishlist.delete(id);

            return {
              ...prev,
              realtime: nextRealtime,
              saved: nextSaved,
              wishlist: nextWishlist,
            };
          });
          setWishlistPlaces((prev) => prev.filter((place) => place.id !== id));

          if (typeof tripId === 'number' && wishlistPlaceId != null) {
            void deleteWishlistPlace(tripId, wishlistPlaceId).catch(() => {
              setLikedIdsByTab((prev) => ({
                ...prev,
                realtime: tab === 'realtime' ? new Set([...prev.realtime, id]) : prev.realtime,
                saved: tab === 'saved' ? new Set([...prev.saved, id]) : prev.saved,
                wishlist: new Set([...prev.wishlist, id]),
              }));
              if (removedPlace) {
                setWishlistPlaces((prev) => [removedPlace, ...prev]);
              }
            });
          }
          return;
        }

        if (tab === 'wishlist') {
          const removedPlace = wishlistPlaces.find((place) => place.id === id);
          const wishlistPlaceId = wishlistPlaceIdMap[id];

          setLikedIdsByTab((prev) => {
            const nextWishlist = new Set(prev.wishlist);
            const nextSaved = new Set(prev.saved);
            const nextRealtime = new Set(prev.realtime);

            nextWishlist.delete(id);
            nextSaved.delete(id);
            nextRealtime.delete(id);

            return {
              ...prev,
              wishlist: nextWishlist,
              saved: nextSaved,
              realtime: nextRealtime,
            };
          });
          setWishlistPlaces((prev) => prev.filter((place) => place.id !== id));

          if (typeof tripId === 'number' && wishlistPlaceId != null) {
            void deleteWishlistPlace(tripId, wishlistPlaceId).catch(() => {
              setLikedIdsByTab((prev) => ({
                ...prev,
                wishlist: new Set([...prev.wishlist, id]),
                saved: new Set([...prev.saved, id]),
                realtime: recommendedPlaces.some((place) => place.id === id)
                  ? new Set([...prev.realtime, id])
                  : prev.realtime,
              }));
              if (removedPlace) {
                setWishlistPlaces((prev) => [removedPlace, ...prev]);
              }
            });
          }
          return;
        }

        toggleLike(tab, id);
        return;
      }

      if (!Number.isInteger(Number(id))) {
        // 더미 데이터(place_1 등)는 API 대신 로컬 토글만 수행
        toggleLike(tab, id);
        return;
      }

      // 낙관적 업데이트: 클릭 즉시 UI 반영
      toggleLike(tab, id);

      if ((tab === 'saved' || tab === 'wishlist' || tab === 'realtime') && !wasWishlistLiked) {
        setLikedIdsByTab((prev) => {
          if (prev.wishlist.has(id)) {
            return prev;
          }

          const nextWishlist = new Set(prev.wishlist);
          nextWishlist.add(id);
          return { ...prev, wishlist: nextWishlist };
        });

        setWishlistPlaces((prev) => {
          if (prev.some((place) => place.id === id)) {
            return prev;
          }

          const matchedPlace =
            savedPlaces.find((place) => place.id === id) ??
            recommendedPlaces.find((place) => place.id === id) ??
            placeData;
          if (!matchedPlace) {
            return prev;
          }

          return [matchedPlace, ...prev];
        });
      }

      void (async () => {
        const added = await addWishlistPlaceById(tab, id);
        if (!added) {
          // 서버 반영 실패 시 원상복구
          toggleLike(tab, id);

          if ((tab === 'saved' || tab === 'wishlist' || tab === 'realtime') && !wasWishlistLiked) {
            setLikedIdsByTab((prev) => {
              if (!prev.wishlist.has(id)) {
                return prev;
              }

              const nextWishlist = new Set(prev.wishlist);
              nextWishlist.delete(id);
              return { ...prev, wishlist: nextWishlist };
            });

            setWishlistPlaces((prev) => prev.filter((place) => place.id !== id));
          }

          return;
        }

        if (tab === 'saved' || tab === 'wishlist' || tab === 'realtime') {
          setLikedIdsByTab((prev) => {
            if (prev.wishlist.has(id)) {
              return prev;
            }

            const nextWishlist = new Set(prev.wishlist);
            nextWishlist.add(id);
            return { ...prev, wishlist: nextWishlist };
          });
        }
      })();
    },
    [
      addWishlistPlaceById,
      isLikedInTab,
      recommendedPlaces,
      savedPlaces,
      toggleLike,
      wishlistPlaceIdMap,
      wishlistPlaces,
      tripId,
    ],
  );

  const [selectedCategory, setSelectedCategory] = useState<TabId>(INITIAL_CATEGORY);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [isGeneratingAiPlan, setIsGeneratingAiPlan] = useState(false);
  const [isSheetExpanded, setIsSheetExpanded] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSearchPlace, setSelectedSearchPlace] = useState<SearchWishPlace | null>(null);
  const [searchMarkers, setSearchMarkers] = useState<SearchWishPlace[]>([]);
  const [regionMarkers, setRegionMarkers] = useState<NearbyPlace[]>([]);
  const [searchTrigger, setSearchTrigger] = useState(0);
  const [recommendationRefreshKey, setRecommendationRefreshKey] = useState(0);
  const [isRegionSearchEnabled, setIsRegionSearchEnabled] = useState(false);
  const currentRegionRef = useRef<Region>(GOOGLE_HQ_REGION);
  const lastRegionSearchRef = useRef<Region>(GOOGLE_HQ_REGION);
  const searchInputRef = useRef<TextInput>(null);
  const refocusRafRef = useRef<number | null>(null);
  const isSearchFocusedRef = useRef(false);
  const isKeyboardVisibleRef = useRef(false);
  const isInitialTabEffect = useRef(true);
  const showAddModalRef = useRef(false);
  const showExitModalRef = useRef(false);
  const selectedSearchPlaceRef = useRef<SearchWishPlace | null>(null);
  const mapRef = useRef<MapView>(null);
  const currentLocationRef = useRef<LocationCoords | null>(null);
  const hasAutoCenteredOnLocationRef = useRef(false);
  useEffect(() => {
    showAddModalRef.current = showAddModal;
  }, [showAddModal]);
  useEffect(() => {
    showExitModalRef.current = showExitModal;
  }, [showExitModal]);
  useEffect(() => {
    selectedSearchPlaceRef.current = selectedSearchPlace;
  }, [selectedSearchPlace]);

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
    [translateY],
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
    setSearchTrigger(0);
    Keyboard.dismiss();
  }, [clearPendingRefocus]);
  const handleSearchInputBlur = useCallback((): void => {
    // Intentionally keep search mode active; only hide keyboard on blur.
  }, []);

  const handleSearchInRegion = useCallback(async (): Promise<void> => {
    const region = currentRegionRef.current;
    if (!isRegionSearchEnabled) return;

    lastRegionSearchRef.current = region;
    setIsRegionSearchEnabled(false);

    const minLat = region.latitude - region.latitudeDelta / 2;
    const maxLat = region.latitude + region.latitudeDelta / 2;
    const minLng = region.longitude - region.longitudeDelta / 2;
    const maxLng = region.longitude + region.longitudeDelta / 2;

    setRegionMarkers([]);
    setSearchMarkers([]);
    setSelectedSearchPlace(null);

    const keyword = searchQuery.trim();

    if (keyword) {
      try {
        const results = await getSearchResults(keyword);
        const markers: SearchWishPlace[] = results
          .filter(
            (item) =>
              item.latitude >= minLat &&
              item.latitude <= maxLat &&
              item.longitude >= minLng &&
              item.longitude <= maxLng,
          )
          .map((item, index) => ({
            id: String(item.placeId ?? `search-${index}`),
            title: item.name,
            location: `${item.cityName}, ${item.countryName}`,
            description: item.description,
            image: item.imageUrl ? { uri: item.imageUrl } : undefined,
            categories: item.tags,
            latitude: item.latitude,
            longitude: item.longitude,
          }));
        setSearchMarkers(markers);
      } catch {
        // 검색 실패 시 마커 없음
      }
    } else {
      const radiusMeters = getRegionRadiusMeters(region);
      const places = await searchNearbyPlaces(region.latitude, region.longitude, radiusMeters);
      setRegionMarkers(places);
    }
  }, [isRegionSearchEnabled, searchQuery]);

  const handlePressSearch = useCallback((): void => {
    if (!searchQuery.trim()) return;
    setSearchTrigger((prev) => prev + 1);
  }, [searchQuery]);

  const handlePressSearchPlace = useCallback(
    (place: SearchWishPlace): void => {
      handleSearchBlur();
      navigation.navigate('DestinationDetail', { destinationId: place.id });
    },
    [handleSearchBlur, navigation],
  );

  // 뒤로가기 버튼 핸들러: 검색 중이면 검색 종료, 상세 카드면 닫기, 그 외에는 모달 열기
  const handleGoBack = useCallback((): void => {
    if (isSearchFocused) {
      handleSearchBlur();
      setSearchMarkers([]);
      return;
    }
    if (selectedSearchPlace) {
      setSelectedSearchPlace(null);
      setSearchMarkers([]);
      return;
    }
    setShowExitModal(true);
  }, [isSearchFocused, handleSearchBlur, selectedSearchPlace]);

  const handleAiPlan = useCallback(async (): Promise<void> => {
    if (isGeneratingAiPlan) return;
    if (typeof tripId !== 'number') {
      ToastAndroid.show('AI 추천 일정을 생성하지 못했습니다.', ToastAndroid.SHORT);
      return;
    }

    setIsGeneratingAiPlan(true);
    ToastAndroid.show('일정을 짜는 중입니다. 잠시 기다려주세요.', ToastAndroid.SHORT);
    const result = await generateTripSchedules({ tripId });

    if (result.error || !result.data) {
      setIsGeneratingAiPlan(false);
      ToastAndroid.show(
        result.error?.message || 'AI 추천 일정을 생성하지 못했습니다.',
        ToastAndroid.SHORT,
      );
      return;
    }

    const isSaved = await saveGeneratedSchedules(result.data.tripId, result.data);
    if (!isSaved) {
      setIsGeneratingAiPlan(false);
      ToastAndroid.show('AI 추천 일정을 저장하지 못했습니다.', ToastAndroid.SHORT);
      return;
    }

    setIsGeneratingAiPlan(false);
    setShowAddModal(false);
    navigation.replace('TripDetail', { tripId: result.data.tripId });
  }, [isGeneratingAiPlan, navigation, tripId]);

  const handleManualPlan = useCallback(async (): Promise<void> => {
    if (typeof tripId !== 'number') {
      navigation.navigate('TripDetail');
      setShowAddModal(false);
      return;
    }

    let scheduleDate = tripDay1Date;

    if (!scheduleDate) {
      const result = await getTripSchedules({ tripId });
      const tripData = result.data as { startDate?: string } | null;
      scheduleDate = tripData?.startDate ?? null;
    }

    if (!scheduleDate) {
      ToastAndroid.show('여행 시작일을 불러오지 못했습니다.', ToastAndroid.SHORT);
      return;
    }

    if (wishlistPlaces.length > 0) {
      const results = await Promise.all(
        wishlistPlaces.map((place, index) => {
          const { startTime, endTime } = getManualScheduleTime(index);
          return createSchedule({
            tripId,
            payload: {
              title: getScheduleTitleFromPlace(place),
              scheduleDate,
              startTime,
              endTime,
              placeId: Number.isInteger(Number(place.id)) ? Number(place.id) : undefined,
              placeName: place.title,
              address: place.description,
            },
          });
        }),
      );

      const failedIndex = results.findIndex((result) => result.error);
      if (failedIndex >= 0) {
        const failedError = results[failedIndex].error;
        ToastAndroid.show(
          failedError?.message?.trim() || '위시리스트 일정을 생성하지 못했습니다.',
          ToastAndroid.SHORT,
        );
        return;
      }
    }

    navigation.replace('TripDetail', { tripId });
    setShowAddModal(false);
  }, [navigation, tripId, wishlistPlaces, tripDay1Date]);

  const handleComplete = useCallback((): void => setShowAddModal(true), []);

  const handleMapPress = useCallback((): void => {
    if (isSheetExpanded) animateSheetTo(SNAP_LOW);
  }, [animateSheetTo, isSheetExpanded]); // 좋아요 토글 핸들러 + 상태 조회 함수 (탭별)

  const handleToggleSaved = useCallback(
    (id: string): void => handleToggleLikeWithApi('saved', id),
    [handleToggleLikeWithApi],
  );
  const handleToggleWishlist = useCallback(
    (id: string): void => handleToggleLikeWithApi('wishlist', id),
    [handleToggleLikeWithApi],
  );
  const handleToggleRealtime = useCallback(
    (id: string): void => {
      const place = recommendedPlaces.find((item) => item.id === id);
      handleToggleLikeWithApi('realtime', id, place);
    },
    [handleToggleLikeWithApi, recommendedPlaces],
  );
  const isRealtimeLiked = useCallback(
    (id: string): boolean => isLikedInTab('realtime', id) || isLikedInTab('wishlist', id),
    [isLikedInTab],
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
    animateSheetTo(SNAP_FULL);
  }, [selectedCategory, animateSheetTo]); // 바텀시트 애니메이션 스타일
  const mapUIAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    const opacity = interpolate(translateY.value, [SNAP_LOW - 5, SNAP_LOW], [0, 1], 'clamp');
    return { opacity, pointerEvents: opacity < 0.1 ? 'none' : 'auto' };
  }); //  뒤로가기 버튼 핸들링 + 모달 상태 초기화

  useEffect(() => {
    const timer = setTimeout(() => {
      requestLocationPermission();
    }, 500); // 화면 먼저 뜨고 요청

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (selectedCategory !== 'realtime') return;
    if (typeof tripId !== 'number') {
      setRecommendedPlaces([]);
      return;
    }

    let isActive = true;
    const region = currentRegionRef.current;

    const timer = setTimeout(() => {
      if (!isActive) return;

      setIsLoadingRecommendations(true);
      getWishlistRecommendations(tripId, {
        latitude: region.latitude,
        longitude: region.longitude,
        radiusMeters: getRegionRadiusMeters(region),
        limit: RECOMMENDATION_LIMIT,
      })
        .then((data) => {
          if (!isActive) return;

          const places = (data?.recommendedPlaces || []).map(convertRecommendationToWishPlace);
          setRecommendedPlaces(places);
          setRecommendationEmptyMessage(
            data?.recommendedPlaceEmptyMessage || '추천 장소가 없습니다.',
          );
          setLikedIdsByTab((prev) => {
            const nextRealtime = new Set(prev.realtime);
            places.forEach((place) => {
              if (prev.wishlist.has(place.id)) {
                nextRealtime.add(place.id);
              }
            });
            return { ...prev, realtime: nextRealtime };
          });
        })
        .catch(() => {
          if (!isActive) return;
          setRecommendedPlaces([]);
          setRecommendationEmptyMessage('실시간 추천 장소를 불러오지 못했습니다.');
        })
        .finally(() => {
          if (isActive) setIsLoadingRecommendations(false);
        });
    }, 500);

    return () => {
      isActive = false;
      clearTimeout(timer);
    };
  }, [selectedCategory, tripId, recommendationRefreshKey]);

  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };
  useFocusEffect(
    useCallback(() => {
      setShowAddModal(false);
      setShowExitModal(false);

      const backAction = (): boolean => {
        if (showExitModalRef.current || showAddModalRef.current) return true;
        if (isSearchFocused) {
          handleSearchBlur();
          return true;
        }
        if (selectedSearchPlaceRef.current) {
          setSelectedSearchPlace(null);
          return true;
        }
        setShowExitModal(true);
        return true;
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
      return () => backHandler.remove();
    }, [selectedCategory, animateSheetTo, translateY, isSearchFocused, handleSearchBlur]),
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

    if (hasAutoCenteredOnLocationRef.current) return;

    hasAutoCenteredOnLocationRef.current = true;
    mapRef.current?.animateToRegion(
      {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      900,
    );
  }, []);

  const moveToCurrentLocation = async (): Promise<void> => {
    // 1. 안드로이드 권한 확인 및 요청
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          return;
        }
      } catch {
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
    }
  }; //탭 컨텐츠
  const renderTabContent = (): React.ReactNode => {
    if (selectedSearchPlace) {
      return (
        <View className="pb-4">
          <Text className="mb-3 font-pretendardSemiBold text-h2">검색 결과</Text>
          <PlaceCard
            place={selectedSearchPlace}
            isLiked={isLikedInTab('wishlist', selectedSearchPlace.id)}
            onToggleLike={(id) => handleToggleLikeWithApi('wishlist', id, selectedSearchPlace)}
          />
        </View>
      );
    }

    switch (selectedCategory) {
      case 'realtime':
        if (isLoadingRecommendations) {
          return (
            <LoadingView
              message="추천 장소를 불러오는 중입니다."
              size="small"
              edges={[]}
              className="bg-transparent py-10"
            />
          );
        }

        if (recommendedPlaces.length === 0) {
          return (
            <View className="mx-[1px] items-center py-4">
              <Text className="mt-20 font-pretendardSemiBold text-h2">
                {recommendationEmptyMessage}
              </Text>
            </View>
          );
        }

        return (
          <View className="mx-[1px] py-4">
            {recommendedPlaces.map((place) => (
              <PlaceCard
                key={`realtime-${place.id}`}
                place={place}
                isLiked={isRealtimeLiked(place.id)}
                onToggleLike={handleToggleRealtime}
              />
            ))}
          </View>
        );
      case 'saved':
        return (
          <WishTabSave
            places={savedPlaces}
            isLiked={isSavedLiked}
            onToggleLike={handleToggleSaved}
          />
        );
      case 'wishlist':
        return (
          <WishTabWishlist
            places={wishlistPlaces}
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
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          showsUserLocation={true}
          showsMyLocationButton={false}
          onUserLocationChange={handleUserLocationChange}
          initialRegion={GOOGLE_HQ_REGION}
          onRegionChangeComplete={(region) => {
            currentRegionRef.current = region;
            setIsRegionSearchEnabled(hasRegionChanged(region, lastRegionSearchRef.current));
            if (selectedCategory === 'realtime') {
              setRecommendationRefreshKey((prev) => prev + 1);
            }
          }}>
          {searchMarkers.map((place) => (
            <Marker
              key={`search-marker-${place.id}`}
              coordinate={{ latitude: place.latitude, longitude: place.longitude }}
              title={place.title}
              onPress={() => {
                setSelectedSearchPlace(place);
                animateSheetTo(SNAP_TRENDING);
              }}
            />
          ))}
          {selectedSearchPlace && searchMarkers.length === 0 && regionMarkers.length === 0 && (
            <Marker
              coordinate={{
                latitude: selectedSearchPlace.latitude,
                longitude: selectedSearchPlace.longitude,
              }}
              title={selectedSearchPlace.title}
            />
          )}
          {regionMarkers.map((place) => (
            <Marker
              key={`region-marker-${place.id}`}
              coordinate={{ latitude: place.latitude, longitude: place.longitude }}
              title={place.title}
            />
          ))}
        </MapView>
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
          onChangeText={(text) => {
            setSearchQuery(text);
            if (searchMarkers.length > 0) setSearchMarkers([]);
          }}
          onFocus={handleSearchFocus}
          onBlur={handleSearchInputBlur}
          onFocusInput={focusSearchInput}
          onPressBack={handleGoBack}
          onPressSearch={handlePressSearch}
          onSubmitSearch={handlePressSearch}
        />
        <Animated.View
          style={[
            mapUIAnimatedStyle,
            { position: 'absolute', bottom: SEARCH_BUTTON_BOTTOM, left: 0, right: 0, zIndex: 20 },
          ]}>
          <View className="items-center">
            <CategoryChip
              label="현 지도에서 검색"
              isSelected={isRegionSearchEnabled}
              onPress={isRegionSearchEnabled ? handleSearchInRegion : undefined}
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
            maxTopSnap={selectedSearchPlace ? SNAP_TRENDING : SNAP_FULL}
            tabs={TABS}
            selectedCategory={selectedSearchPlace ? null : selectedCategory}
            onSelectCategory={(tabId) => {
              setSelectedSearchPlace(null);
              setSelectedCategory(tabId);
            }}
            onPressComplete={handleComplete}
            renderTabContent={renderTabContent}
          />
        )}

        {isSearchFocused && (
          <WishlistSearchOverlay
            isVisible={isSearchFocused}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            searchTrigger={searchTrigger}
            isLiked={(id) => isLikedInTab(selectedCategory, id)}
            onToggleLike={(id, place) => handleToggleLikeWithApi(selectedCategory, id, place)}
            onPressPlace={handlePressSearchPlace}
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
          primaryDisabled={wishlistPlaces.length === 0}
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
