import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackActions, useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';

import { BackArrowGray, InputSearchIcon, MapMarker } from '@/assets/icons';
import { COLORS } from '@/constants';
import { fetchKoreanAddress, fetchNearestKoreanPlaceName, getSearchResults } from '@/services';
import MapPlaceCard from '@/screens/scheduleMap/components/MapPlaceCard';
import type { RoutePoint } from '@/screens/scheduleMap/types';
import type { SearchResult } from '@/types/search';

// 기본 지도 위치
const DEFAULT_REGION: Region = {
  latitude: 37.5665, // 서울
  longitude: 126.978,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

type AddCalendarMapNavigation = NativeStackNavigationProp<RootStackParamList>;

const createPointFromSearchResult = (item: SearchResult): RoutePoint => ({
  id: String(item.placeId),
  placeId: item.placeId,
  day: 0,
  order: 0,
  latitude: item.latitude,
  longitude: item.longitude,
  title: item.name,
  location: [item.cityName, item.countryName].filter(Boolean).join(', '),
  description: item.description,
  placeCardDescription: item.description,
  startTime: '',
  endTime: '',
  image: item.imageUrl ? { uri: item.imageUrl } : null,
  imageText: item.imageUrl ? undefined : '이미지 준비 중',
  categories: item.tags,
});

const AddCalendarMapScreen: React.FC = () => {
  const navigation = useNavigation<AddCalendarMapNavigation>();
  const route = useRoute<RouteProp<RootStackParamList, 'AddCalendarMapScreen'>>();
  const params = route.params;
  const mapRef = useRef<MapView>(null);
  const ignoreNextMapPressRef = useRef(false);
  const insets = useSafeAreaInsets();

  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // 마커
  const [selectedPlace, setSelectedPlace] = useState<RoutePoint | null>(null);
  const [isPlaceSheetVisible, setIsPlaceSheetVisible] = useState(false);
  const [isLoadingPlace, setIsLoadingPlace] = useState(false);

  const fetchAddress = useCallback(async (latitude: number, longitude: number): Promise<string> => {
    const result = await fetchKoreanAddress(latitude, longitude);
    if (result.error) {
      console.warn('Geocoding API 오류:', result.error);
    }
    return result.address;
  }, []);

  const fetchNearbyPlace = useCallback(
    async (
      latitude: number,
      longitude: number,
    ): Promise<{
      name: string;
      types: string[];
      photoUrl: string | null;
      summary: string | null;
    }> => {
      const result = await fetchNearestKoreanPlaceName(latitude, longitude);
      if (result.error) {
        console.warn('Places API 오류:', result.error);
      }
      return {
        name: result.name,
        types: result.types,
        photoUrl: result.photoUrl ?? null,
        summary: result.summary ?? null,
      };
    },
    [],
  );

  // 지도 클릭 → 마커
  const handleSelectLocation = useCallback(
    async (latitude: number, longitude: number, titleOverride?: string) => {
      setIsLoadingPlace(true);

      try {
        const [address, placeInfo] = await Promise.all([
          fetchAddress(latitude, longitude),
          fetchNearbyPlace(latitude, longitude),
        ]);

        const place: RoutePoint = {
          id: `${titleOverride ? 'poi' : 'map'}-${Date.now()}`,
          day: 0,
          order: 0,
          latitude,
          longitude,
          title: titleOverride || placeInfo.name || '선택한 위치',
          location: address,
          description: '',
          placeCardDescription: placeInfo.summary ?? address,
          startTime: '',
          endTime: '',
          categories: placeInfo.types ?? [],
          image: placeInfo.photoUrl ? { uri: placeInfo.photoUrl } : null,
          imageText: placeInfo.photoUrl ? undefined : '이미지 준비 중',
        };

        setSelectedPlace(place);
        setIsPlaceSheetVisible(false);
        setSearchResults([]);
        setHasSearched(false);

        mapRef.current?.animateToRegion(
          {
            latitude,
            longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          },
          300,
        );
      } finally {
        setIsLoadingPlace(false);
      }
    },
    [fetchAddress, fetchNearbyPlace],
  );

  const handleSearch = useCallback(async () => {
    const nextKeyword = keyword.trim();
    Keyboard.dismiss();

    if (!nextKeyword || isSearching) return;

    setIsSearching(true);
    setHasSearched(true);

    try {
      const results = await getSearchResults(nextKeyword);
      setSearchResults(results);
    } catch (error) {
      console.error('장소 검색 오류:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [isSearching, keyword]);

  const handleSelectSearchResult = useCallback((item: SearchResult) => {
    const point = createPointFromSearchResult(item);

    Keyboard.dismiss();
    setSelectedPlace(point);
    setIsPlaceSheetVisible(false);
    setSearchResults([]);
    setHasSearched(false);

    mapRef.current?.animateToRegion(
      {
        latitude: point.latitude,
        longitude: point.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      300,
    );
  }, []);

  const handlePressMap = useCallback(
    async (event: { nativeEvent: { coordinate: { latitude: number; longitude: number } } }) => {
      if (ignoreNextMapPressRef.current) {
        ignoreNextMapPressRef.current = false;
        return;
      }

      Keyboard.dismiss();

      const { latitude, longitude } = event.nativeEvent.coordinate;
      console.log('지도 탭됨:', { latitude, longitude });

      try {
        await handleSelectLocation(latitude, longitude);
      } catch (error) {
        console.error('지도 탭 처리 오류:', error);
      }
    },
    [handleSelectLocation],
  );

  const handlePoiClick = useCallback(
    async (event: {
      nativeEvent: { name: string; coordinate: { latitude: number; longitude: number } };
    }) => {
      Keyboard.dismiss();

      const { name, coordinate } = event.nativeEvent;
      const { latitude, longitude } = coordinate;

      console.log('POI 탭됨:', event.nativeEvent);

      try {
        await handleSelectLocation(latitude, longitude, name);
      } catch (error) {
        console.error('POI 탭 처리 오류:', error);
      }
    },
    [handleSelectLocation],
  );

  const handlePressMarker = useCallback(() => {
    if (!selectedPlace) return;
    ignoreNextMapPressRef.current = true;
    setIsPlaceSheetVisible(true);
  }, [selectedPlace]);

  // 등록 버튼
  // PLI-21 머지 후 navigation 연결 예정
  const handleRegister = useCallback(() => {
    if (!selectedPlace || !params?.tripId) return;
    navigation.dispatch(
      StackActions.popTo(
        'AddSchedule',
        {
          mode: params?.tripScheduleId ? 'edit' : 'create',
          tripId: params.tripId,
          tripTitle: params?.tripTitle ?? '',
          tripScheduleId: params?.tripScheduleId,
          date: params?.date ?? '',
          title: params?.title ?? '',
          startTime: params?.startTime,
          endTime: params?.endTime,
          memo: params?.memo ?? '',
          placeId: typeof selectedPlace.placeId === 'number' ? selectedPlace.placeId : undefined,
          placeName: selectedPlace.title,
          address: selectedPlace.location,
          latitude: selectedPlace.latitude,
          longitude: selectedPlace.longitude,
        },
        { merge: true },
      ),
    );
  }, [
    navigation,
    params?.date,
    params?.endTime,
    params?.memo,
    params?.startTime,
    params?.title,
    params?.tripId,
    params?.tripScheduleId,
    params?.tripTitle,
    selectedPlace,
  ]);

  return (
    <SafeAreaView className="flex-1">
      {/* 지도 */}
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={DEFAULT_REGION}
        onPress={handlePressMap}
        onMarkerPress={handlePressMarker}
        onPoiClick={handlePoiClick}>
        {selectedPlace && (
          <Marker
            coordinate={{
              latitude: selectedPlace.latitude,
              longitude: selectedPlace.longitude,
            }}
            title={selectedPlace.title}
            description={selectedPlace.location}
            stopPropagation
            onPress={handlePressMarker}>
            <MapMarker />
          </Marker>
        )}
      </MapView>

      {isLoadingPlace && (
        <View
          pointerEvents="none"
          className="absolute bottom-0 left-0 right-0 z-10 items-center justify-center"
          style={{ height: 64, paddingBottom: insets.bottom }}>
          <ActivityIndicator size="small" color={COLORS.main} />
        </View>
      )}

      {selectedPlace && isPlaceSheetVisible && !isLoadingPlace && (
        <View
          className="absolute bottom-0 left-0 right-0 z-10 border-t border-borderGray bg-white"
          style={{ paddingBottom: insets.bottom }}>
          <View className="h-[160px] w-full items-center px-4 py-6">
            <MapPlaceCard place={selectedPlace} onPressAction={handleRegister} />
          </View>
        </View>
      )}

      {/* 검색 */}
      <View className="absolute left-4 right-4 z-10" style={{ top: insets.top + 5 }}>
        <View className="h-[46px] w-full flex-row items-center rounded-[12px] border border-borderGray bg-white px-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <BackArrowGray />
          </TouchableOpacity>

          <TextInput
            value={keyword}
            onChangeText={(text) => {
              setKeyword(text);
              if (!text.trim()) {
                setSearchResults([]);
                setHasSearched(false);
              }
            }}
            onSubmitEditing={handleSearch}
            placeholder="희망하는 관광지를 검색하세요"
            placeholderTextColor={COLORS.gray}
            returnKeyType="search"
            className="ml-2 flex-1 text-black"
          />

          <TouchableOpacity activeOpacity={0.8} onPress={handleSearch}>
            <InputSearchIcon />
          </TouchableOpacity>
        </View>

        {(isSearching || hasSearched) && (
          <View className="mt-2 max-h-[260px] rounded-[12px] border border-borderGray bg-white px-3 py-2">
            {isSearching ? (
              <View className="items-center py-6">
                <ActivityIndicator size="small" color={COLORS.main} />
              </View>
            ) : searchResults.length > 0 ? (
              <ScrollView keyboardShouldPersistTaps="handled">
                {searchResults.map((item, index) => (
                  <TouchableOpacity
                    key={item.placeId}
                    activeOpacity={0.8}
                    onPress={() => handleSelectSearchResult(item)}
                    className={`py-3 ${
                      index < searchResults.length - 1 ? 'border-b border-borderGray' : ''
                    }`}>
                    <Text
                      className="font-pretendardSemiBold text-h3 text-black"
                      numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text className="mt-1 text-p text-gray" numberOfLines={1}>
                      {[item.cityName, item.countryName].filter(Boolean).join(', ')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <View className="items-center py-6">
                <Text className="text-p text-gray">검색 결과가 없습니다.</Text>
              </View>
            )}
          </View>
        )}
      </View>

      {!isPlaceSheetVisible && (
        <View className="absolute left-4 right-4 z-10" style={{ bottom: insets.bottom + 52 }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleRegister}
            disabled={!selectedPlace}
            className="h-[44px] items-center justify-center rounded-[8px] bg-main">
            <Text className="font-pretendardSemiBold text-white">등록하기</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

AddCalendarMapScreen.displayName = 'AddCalendarMapScreen';

export default AddCalendarMapScreen;
export { AddCalendarMapScreen };
