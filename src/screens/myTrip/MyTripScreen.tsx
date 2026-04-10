import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { PlusIcon } from '@/assets/icons';
import { Chip } from '@/components/ui';
import type { RootStackParamList } from '@/navigation/types';
import { EmptyMapScreen } from '@/screens/myTrip';
import TripCard from '@/screens/myTrip/components/TripCard';
import type { TripCardStatus, TripCardViewModel, TripFilter } from '@/screens/myTrip/type';
import { getMyTrips, type MyTripItem } from '@/services';

type MyTripNavigation = NativeStackNavigationProp<RootStackParamList>;

const TRIP_FILTERS: TripFilter[] = ['전체', '예정된 여행', '지난 여행'];

const mapTripStatus = (status: MyTripItem['tripStatus']): TripCardStatus => {
  if (status === 'ONGOING') return 'traveling';
  if (status === 'COMPLETED') return 'completed';
  return 'scheduled';
};

const formatDateText = (startDate: string, endDate: string): string =>
  `${startDate.replaceAll('-', '.')} - ${endDate.replaceAll('-', '.')}`;

const mapTripToCardViewModel = (trip: MyTripItem): TripCardViewModel => ({
  id: trip.tripId,
  city: trip.title,
  dateText: formatDateText(trip.startDate, trip.endDate),
  scheduleText: String(trip.scheduleCount),
  scheduleCountText: String(trip.tripDayCount),
  imageSource: trip.imageUrl ? { uri: trip.imageUrl } : require('@/assets/images/thumnail2.png'),
  status: mapTripStatus(trip.tripStatus),
});

const MyTripScreen: React.FC = () => {
  const [selectedChip, setSelectedChip] = useState<TripFilter>('전체');
  const [openCardId, setOpenCardId] = useState<number | null>(null);
  const [tripCardItems, setTripCardItems] = useState<TripCardViewModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigation = useNavigation<MyTripNavigation>();

  const filteredTripCardItems = useMemo(() => {
    if (selectedChip === '전체') {
      return tripCardItems;
    }

    if (selectedChip === '예정된 여행') {
      return tripCardItems.filter((tripCardItem) => tripCardItem.status === 'scheduled');
    }

    return tripCardItems.filter((tripCardItem) => tripCardItem.status === 'completed');
  }, [selectedChip, tripCardItems]);

  const fetchMyTrips = useCallback(async (signal?: AbortSignal): Promise<void> => {
    setIsLoading(true);
    const result = await getMyTrips({ signal });
    if (signal?.aborted || result.error === 'REQUEST_ABORTED') return;
    if (result.error) {
      setIsLoading(false);
      return;
    }
    setTripCardItems(result.data.map(mapTripToCardViewModel));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    fetchMyTrips(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, [fetchMyTrips]);

  // Hooks
  const handleNavigateToDetail = useCallback(() => {
    navigation.navigate('AddTripScreen');
  }, [navigation]);

  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      <ScrollView className="flex-1 bg-screenBackground" showsVerticalScrollIndicator={false}>
        <View className="flex-1 bg-screenBackground px-5 py-6">
          <View className="flex-row items-start justify-between">
            <View>
              <Text className="font-pretendardBold text-h text-black">내여행</Text>
              <Text className="text-p text-gray">
                {filteredTripCardItems.length}개의 여행이 있어요
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleNavigateToDetail}
              activeOpacity={0.8}
              className="h-[36px] w-[71px] flex-row items-center justify-center rounded-[6px] bg-main">
              <PlusIcon />
              <Text className="ml-[6px] text-p1 text-white">추가</Text>
            </TouchableOpacity>
          </View>

          {/* Chip */}
          <View className="mt-4 flex-row">
            {TRIP_FILTERS.map((filter) => (
              <Chip
                key={filter}
                label={filter}
                onPress={() => setSelectedChip(filter)}
                isSelected={selectedChip === filter}
                className="mr-2 px-4 py-2"
              />
            ))}
          </View>

          {/* TripCard */}
          {!isLoading && filteredTripCardItems.length === 0 ? (
            <View className="mt-4">
              <EmptyMapScreen />
            </View>
          ) : (
            filteredTripCardItems.map((tripCardItem) => (
              <View key={tripCardItem.id}>
                <TripCard
                  city={tripCardItem.city}
                  dateText={tripCardItem.dateText}
                  scheduleText={tripCardItem.scheduleText}
                  scheduleCountText={tripCardItem.scheduleCountText}
                  imageSource={tripCardItem.imageSource}
                  status={tripCardItem.status}
                  isOpen={openCardId === tripCardItem.id}
                  onImagePress={() => navigation.navigate('TripDetail')}
                  onToggle={() =>
                    setOpenCardId((prev) => (prev === tripCardItem.id ? null : tripCardItem.id))
                  }
                />
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

MyTripScreen.displayName = 'MyTripScreen';

export default MyTripScreen;
export { MyTripScreen };
