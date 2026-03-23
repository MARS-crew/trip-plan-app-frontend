import React, { useCallback, useRef, useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { BackArrowGray, InputSearchIcon, MapMarker } from '@/assets/icons';
import { COLORS } from '@/constants'

// 기본 지도 위치
const DEFAULT_REGION: Region = {
  latitude: 37.5665, // 서울
  longitude: 126.9780,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

interface PlaceMarker {
  latitude: number;
  longitude: number;
  title: string;
  address: string;
}

const AddCalendarMapScreen: React.FC = () => {
  const navigation = useNavigation<AddCalendarMapNavigation>();
  const mapRef = useRef<MapView>(null);
  const insets = useSafeAreaInsets();

  const [keyword, setKeyword] = useState('');

  // 마커
  const [selectedPlace, setSelectedPlace] = useState<PlaceMarker | null>(null);

  // 지도 클릭 → 마커
  const handlePressMap = useCallback(
    (event: { nativeEvent: { coordinate: { latitude: number; longitude: number } } }) => {
      Keyboard.dismiss();

      const { latitude, longitude } = event.nativeEvent.coordinate;

      const place: PlaceMarker = {
        latitude,
        longitude,
        title: '선택한 위치',
        address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
      };

      setSelectedPlace(place);

      // 지도 이동
      mapRef.current?.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        300,
      );
    },
    [],
  );

  // 등록 버튼
  // PLI-21 머지 후 navigation 연결 예쩡
  const handleRegister = useCallback(() => {
    if (!selectedPlace) return;
    navigation.goBack();
  }, [navigation, selectedPlace]);

  return (
    <SafeAreaView className="flex-1">
      {/* 지도 */}
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={DEFAULT_REGION}
        onPress={handlePressMap}
      >
        {selectedPlace && (
          <Marker
            coordinate={{
              latitude: selectedPlace.latitude,
              longitude: selectedPlace.longitude,
            }}
            title={selectedPlace.title}
            description={selectedPlace.address}
          >
            <MapMarker />
          </Marker>
        )}
      </MapView>

      {/* 검색 */}
      <View
        className="absolute left-4 right-4 z-10"
        style={{ top: insets.top + 5 }}
      >
        <View className="h-[46px] w-full flex-row items-center rounded-[12px] border border-borderGray bg-white px-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <BackArrowGray />
          </TouchableOpacity>

          <TextInput
            value={keyword}
            onChangeText={setKeyword}
            placeholder="희망하는 관광지를 검색하세요"
            placeholderTextColor= {COLORS.gray}
            className="ml-2 flex-1 text-black"
          />

          <TouchableOpacity activeOpacity={0.8}>
            <InputSearchIcon />
          </TouchableOpacity>
        </View>
      </View>

      {/* 등록 버튼 */}
      <View
        className="absolute left-4 right-4 z-10"
        style={{ bottom: insets.bottom + 52 }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleRegister}
          disabled={!selectedPlace}
          className="h-[44px] items-center justify-center rounded-[8px] bg-main"
        >
          <Text className="text-white font-semibold">등록하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

AddCalendarMapScreen.displayName = 'AddCalendarMapScreen';

export default AddCalendarMapScreen;
export { AddCalendarMapScreen };