import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';

import { BackArrowGray, InputSearchIcon, MapMarker } from '@/assets/icons';
import { COLORS } from '@/constants';
import { fetchKoreanAddress, fetchNearestKoreanPlaceName } from '@/services';

// 기본 지도 위치
const DEFAULT_REGION: Region = {
  latitude: 37.5665, // 서울
  longitude: 126.978,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

interface PlaceMarker {
  latitude: number;
  longitude: number;
  title: string;
  address: string;
  categories?: string[];
  photoUrl?: string | null;
}

type AddCalendarMapNavigation = NativeStackNavigationProp<RootStackParamList>;

const AddCalendarMapScreen: React.FC = () => {
  const navigation = useNavigation<AddCalendarMapNavigation>();
  const route = useRoute<RouteProp<RootStackParamList, 'AddCalendarMapScreen'>>();
  const params = route.params;
  const mapRef = useRef<MapView>(null);
  const insets = useSafeAreaInsets();

  const [keyword, setKeyword] = useState('');

  // 마커
  const [selectedPlace, setSelectedPlace] = useState<PlaceMarker | null>(null);
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
    }> => {
      const result = await fetchNearestKoreanPlaceName(latitude, longitude);
      if (result.error) {
        console.warn('Places API 오류:', result.error);
      }
      return {
        name: result.name,
        types: result.types,
        photoUrl: result.photoUrl ?? null,
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

        const place: PlaceMarker = {
          latitude,
          longitude,
          title: titleOverride || placeInfo.name || '선택한 위치',
          address,
          categories: placeInfo.types ?? [],
          photoUrl: placeInfo.photoUrl ?? null,
        };

        setSelectedPlace(place);

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

  const handlePressMap = useCallback(
    async (event: { nativeEvent: { coordinate: { latitude: number; longitude: number } } }) => {
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

  // 등록 버튼
  // PLI-21 머지 후 navigation 연결 예정
  const handleRegister = useCallback(() => {
    if (!selectedPlace || !params?.tripId) return;
    navigation.replace('AddSchedule', {
      mode: params?.tripScheduleId ? 'edit' : 'create',
      tripId: params.tripId,
      tripTitle: params?.tripTitle ?? '',
      tripScheduleId: params?.tripScheduleId,
      date: params?.date ?? '',
      title: params?.title ?? '',
      startTime: params?.startTime,
      endTime: params?.endTime,
      memo: params?.memo ?? '',
      placeName: selectedPlace.title,
      address: selectedPlace.address,
      latitude: selectedPlace.latitude,
      longitude: selectedPlace.longitude,
    });
  }, [navigation, params?.date, params?.endTime, params?.memo, params?.startTime, params?.title, params?.tripId, params?.tripScheduleId, params?.tripTitle, selectedPlace]);

  return (
    <SafeAreaView className="flex-1">
      {/* 지도 */}
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={DEFAULT_REGION}
        onPress={handlePressMap}
        onPoiClick={handlePoiClick}>
        {selectedPlace && (
          <Marker
            coordinate={{
              latitude: selectedPlace.latitude,
              longitude: selectedPlace.longitude,
            }}
            title={selectedPlace.title}
            description={selectedPlace.address}>
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

      {selectedPlace && !isLoadingPlace && (
        <View
          className="absolute bottom-0 left-0 right-0 z-10 border-t border-borderGray bg-white"
          style={{ paddingBottom: insets.bottom, bottom: insets.bottom + 110 }}>
          <View className="px-4 py-3">
            {selectedPlace.photoUrl ? (
              <Image
                source={{ uri: selectedPlace.photoUrl }}
                className="mb-2 h-[140px] w-full rounded-[8px]"
                resizeMode="cover"
              />
            ) : null}
            <Text className="font-pretendardBold text-h3 text-black">{selectedPlace.title}</Text>
            <Text className="mt-1 text-p text-gray">{selectedPlace.address}</Text>
            {selectedPlace.categories?.length ? (
              <Text className="mt-1 text-p text-gray">{selectedPlace.categories.join(', ')}</Text>
            ) : null}
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
            onChangeText={setKeyword}
            placeholder="희망하는 관광지를 검색하세요"
            placeholderTextColor={COLORS.gray}
            className="ml-2 flex-1 text-black"
          />

          <TouchableOpacity activeOpacity={0.8}>
            <InputSearchIcon />
          </TouchableOpacity>
        </View>
      </View>

      {/* 등록 버튼 */}
      <View className="absolute left-4 right-4 z-10" style={{ bottom: insets.bottom + 52 }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleRegister}
          disabled={!selectedPlace}
          className="h-[44px] items-center justify-center rounded-[8px] bg-main">
          <Text className="font-pretendardSemiBold text-white">등록하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

AddCalendarMapScreen.displayName = 'AddCalendarMapScreen';

export default AddCalendarMapScreen;
export { AddCalendarMapScreen };
