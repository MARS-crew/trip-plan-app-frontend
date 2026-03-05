import Geolocation from '@react-native-community/geolocation';
import React, { useCallback, useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  FlatList,
  PermissionsAndroid,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getPlaceDetail, searchNearbyPlaces } from '../services';
import { usePlaceSearchStore } from '../store';
import type { PlaceSummary } from '../types';

const INITIAL_DELTA = {
  latitudeDelta: 0.06,
  longitudeDelta: 0.04,
};

const C = {
  white: '#fff',
  text: '#111827',
  textSub: '#374151',
  textMuted: '#6B7280',
  textSoft: '#4B5563',
  border: '#E5E7EB',
  dangerBg: '#FEE2E2',
  danger: '#B91C1C',
};

const PANEL_RADIUS = 16;

const requestLocationPermission = async () => {
  if (Platform.OS !== 'android') {
    return true;
  }

  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  return result === PermissionsAndroid.RESULTS.GRANTED;
};

const getCurrentPositionAsync = () =>
  new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      reject,
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  });

const MapSearchScreen = () => {
  const didInitialSearch = useRef(false);

  const {
    center,
    radiusMeter,
    places,
    selectedPlaceDetail,
    isSearching,
    isLoadingDetail,
    error,
    setCenter,
    setPlaces,
    setSelectedPlaceDetail,
    setIsSearching,
    setIsLoadingDetail,
    setError,
  } = usePlaceSearchStore();

  const currentRegion = {
    latitude: center.latitude,
    longitude: center.longitude,
    ...INITIAL_DELTA,
  };

  const initialCenterRef = useRef(currentRegion);

  const fetchPlaces = useCallback(async (targetCenter: { latitude: number; longitude: number }) => {
    setIsSearching(true);

    try {
      const data = await searchNearbyPlaces(targetCenter, radiusMeter);
      setPlaces(data);
      setError(null);
    } catch {
      setError('검색에 실패했습니다.');
    } finally {
      setIsSearching(false);
    }
  }, [radiusMeter, setError, setIsSearching, setPlaces]);

  const runSearch = () => fetchPlaces(center);

  const onPressPlace = async (place: PlaceSummary) => {
    setIsLoadingDetail(true);

    try {
      const detail = await getPlaceDetail(place.id);
      setSelectedPlaceDetail(detail);
      setError(null);
    } catch {
      setError('상세 조회에 실패했습니다.');
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const renderPlaceCard = ({ item }: { item: PlaceSummary }) => (
    <Pressable style={styles.card} onPress={() => onPressPlace(item)}>
      <Text style={styles.cardTitle} numberOfLines={1}>
        {item.displayName}
      </Text>
      <Text style={styles.cardSub} numberOfLines={1}>
        {item.formattedAddress ?? '주소 정보 없음'}
      </Text>
      <Text style={styles.cardMeta}>
        평점 {item.rating ?? '-'} ({item.userRatingCount ?? 0})
      </Text>
    </Pressable>
  );

  const renderReviews = () => {
    if (isLoadingDetail) {
      return <ActivityIndicator size="small" />;
    }

    if (!selectedPlaceDetail?.reviews.length) {
      return <Text style={styles.emptyReview}>리뷰가 없습니다.</Text>;
    }

    return selectedPlaceDetail.reviews.slice(0, 3).map((review, index) => (
      <View key={`${review.name ?? 'review'}-${index}`} style={styles.reviewItem}>
        <Text style={styles.reviewName}>{review.name ?? '사용자'}</Text>
        <Text style={styles.reviewText} numberOfLines={2}>
          {review.text ?? '리뷰 내용 없음'}
        </Text>
      </View>
    ));
  };

  useEffect(() => {
    const initializeLocation = async () => {
      const runInitialSearchOnce = async (targetCenter: { latitude: number; longitude: number }) => {
        if (didInitialSearch.current) {
          return;
        }
        didInitialSearch.current = true;
        await fetchPlaces(targetCenter);
      };

      try {
        const granted = await requestLocationPermission();

        if (!granted) {
          setError('위치 권한이 필요합니다.');
          await runInitialSearchOnce({
            latitude: initialCenterRef.current.latitude,
            longitude: initialCenterRef.current.longitude,
          });
          return;
        }

        const nextCenter = await getCurrentPositionAsync();
        setCenter(nextCenter);
        await runInitialSearchOnce(nextCenter);
      } catch {
        setError('현재 위치를 가져오지 못했습니다.');
        await runInitialSearchOnce({
          latitude: initialCenterRef.current.latitude,
          longitude: initialCenterRef.current.longitude,
        });
      }
    };

    initializeLocation();
  }, [fetchPlaces, setCenter, setError]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={currentRegion}
        region={currentRegion}
        onRegionChangeComplete={region => {
          setCenter({ latitude: region.latitude, longitude: region.longitude });
        }}
        showsUserLocation
      >
        {places.map(place => (
          <Marker
            key={place.id}
            coordinate={place.location}
            title={place.displayName}
            description={place.formattedAddress}
            onPress={() => onPressPlace(place)}
          />
        ))}
      </MapView>

      <Pressable style={styles.searchButton} onPress={runSearch}>
        <Text style={styles.searchButtonText}>이 지역 재검색</Text>
      </Pressable>

      <View style={styles.listPanel}>
        {isSearching ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="small" />
            <Text style={styles.loadingText}>주변 여행지를 검색 중...</Text>
          </View>
        ) : (
          <FlatList
            data={places}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            renderItem={renderPlaceCard}
          />
        )}
      </View>

      {!!error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {selectedPlaceDetail && (
        <View style={styles.detailPanel}>
          <Text style={styles.detailTitle}>{selectedPlaceDetail.displayName}</Text>
          <Text style={styles.detailMeta}>
            평점 {selectedPlaceDetail.rating ?? '-'} ({selectedPlaceDetail.userRatingCount ?? 0})
          </Text>
          <Text style={styles.detailAddress} numberOfLines={2}>
            {selectedPlaceDetail.formattedAddress ?? '주소 정보 없음'}
          </Text>
          <Text style={styles.detailSummary} numberOfLines={2}>
            {selectedPlaceDetail.editorialSummary ?? '장소 요약 정보 없음'}
          </Text>

          <Text style={styles.reviewHeader}>리뷰</Text>
          {renderReviews()}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.white },
  map: { flex: 1 },
  searchButton: {
    position: 'absolute',
    top: 56,
    alignSelf: 'center',
    backgroundColor: C.text,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  searchButtonText: { color: C.white, fontWeight: '700' },
  listPanel: {
    position: 'absolute',
    bottom: 220,
    width: '100%',
  },
  listContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  card: {
    width: 260,
    backgroundColor: C.white,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: C.border,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: C.text },
  cardSub: { marginTop: 4, fontSize: 12, color: C.textMuted },
  cardMeta: { marginTop: 8, fontSize: 12, color: C.textSub },
  detailPanel: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: C.white,
    borderTopLeftRadius: PANEL_RADIUS,
    borderTopRightRadius: PANEL_RADIUS,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    maxHeight: 220,
  },
  detailTitle: { fontSize: 16, fontWeight: '700', color: C.text },
  detailMeta: { marginTop: 4, fontSize: 12, color: C.textSub },
  detailAddress: { marginTop: 6, fontSize: 12, color: C.textMuted },
  detailSummary: { marginTop: 6, fontSize: 12, color: C.textSoft },
  reviewHeader: { marginTop: 10, fontSize: 13, fontWeight: '700', color: C.text },
  reviewItem: { marginTop: 6 },
  reviewName: { fontSize: 12, fontWeight: '600', color: '#1F2937' },
  reviewText: { fontSize: 12, color: C.textSub },
  emptyReview: { marginTop: 4, fontSize: 12, color: C.textMuted },
  loadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: C.white,
    marginHorizontal: 12,
    borderRadius: 12,
  },
  loadingText: { fontSize: 12, color: C.textSub },
  errorBox: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    backgroundColor: C.dangerBg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  errorText: { color: C.danger, fontSize: 12 },
});

export default MapSearchScreen;
