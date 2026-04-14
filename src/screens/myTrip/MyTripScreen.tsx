import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { PlusIcon } from '@/assets/icons';
import { Chip } from '@/components/ui';
import type { RootStackParamList } from '@/navigation/types';
import EmptyMapScreen from './EmptyMapScreen';
import TripCard from '@/screens/myTrip/components/TripCard';
import TripTimeline from '@/screens/myTrip/components/TripTimeline';
import type {
  MyTripItem,
  TripFilterStatus,
  TripCardStatus,
  TripCardViewModel,
  TripFilter,
  TripSchedulesByDateData,
  TripTimelineDateOption,
  TripTimelineItem,
} from '@/types/myTrip.types';
import {
  getMyTrips,
  getTripSchedulesByDate,
} from '@/services';

type MyTripNavigation = NativeStackNavigationProp<RootStackParamList>;

const TRIP_FILTERS: TripFilter[] = ['전체', '예정된 여행', '지난 여행'];
const CHIP_TO_FILTER_STATUS: Record<TripFilter, TripFilterStatus> = {
  전체: 'ALL',
  '예정된 여행': 'UPCOMING',
  '지난 여행': 'PAST',
};

const mapTripStatus = (status: MyTripItem['tripStatus']): TripCardStatus => {
  if (status === 'ONGOING') return 'traveling';
  if (status === 'COMPLETED' || status === 'PAST') return 'completed';
  return 'scheduled';
};

const formatDateText = (startDate: string, endDate: string): string =>
  `${startDate.replaceAll('-', '.')} - ${endDate.replaceAll('-', '.')}`;

const mapTripToCardViewModel = (trip: MyTripItem): TripCardViewModel => ({
  id: trip.tripId,
  city: trip.title,
  startDate: trip.startDate,
  dateText: formatDateText(trip.startDate, trip.endDate),
  scheduleText: String(trip.scheduleCount),
  scheduleCountText: String(trip.tripDayCount),
  imageSource: trip.imageUrl ? { uri: trip.imageUrl } : require('@/assets/images/thumnail2.png'),
  status: mapTripStatus(trip.tripStatus),
});

const filterTripsByChip = (trips: MyTripItem[], chip: TripFilter): MyTripItem[] => {
  if (chip === '전체') return trips;
  if (chip === '예정된 여행') {
    return trips.filter((trip) => trip.tripStatus === 'PLANNED' || trip.tripStatus === 'UPCOMING');
  }
  return trips.filter((trip) => trip.tripStatus === 'COMPLETED' || trip.tripStatus === 'PAST');
};

type TripTimelineStateItem = {
  selectedDate: string;
  dateOptions: TripTimelineDateOption[];
  items: TripTimelineItem[];
  isLoading: boolean;
};

const mapSchedulesToTimelineItems = (
  schedules: TripSchedulesByDateData['schedules'],
): TripTimelineItem[] =>
  schedules.map((schedule) => ({
    id: String(schedule.tripScheduleId),
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    title: schedule.title,
    location: schedule.placeName || schedule.address,
    description: schedule.memo,
  }));

const MyTripScreen: React.FC = () => {
  const [selectedChip, setSelectedChip] = useState<TripFilter>('전체');
  const [openCardId, setOpenCardId] = useState<number | null>(null);
  const [tripCardItems, setTripCardItems] = useState<TripCardViewModel[]>([]);
  const [tripTimelineByCardId, setTripTimelineByCardId] = useState<
    Record<number, TripTimelineStateItem>
  >({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigation = useNavigation<MyTripNavigation>();
  const timelineAbortControllerRef = useRef<AbortController | null>(null);

  const fetchMyTrips = useCallback(
    async (signal?: AbortSignal): Promise<void> => {
      setIsLoading(true);
      const result = await getMyTrips({
        filterStatus: CHIP_TO_FILTER_STATUS[selectedChip],
        signal,
      });
      if (signal?.aborted || result.error === 'REQUEST_ABORTED') return;
      if (result.error) {
        setIsLoading(false);
        return;
      }
      const filteredTrips = filterTripsByChip(result.data, selectedChip);
      setTripCardItems(filteredTrips.map(mapTripToCardViewModel));
      setOpenCardId(null);
      setIsLoading(false);
    },
    [selectedChip],
  );

  const fetchTripTimeline = useCallback(
    async (tripId: number, targetDate: string): Promise<void> => {
      timelineAbortControllerRef.current?.abort();
      const abortController = new AbortController();
      timelineAbortControllerRef.current = abortController;

      setTripTimelineByCardId((prev) => {
        const current = prev[tripId];
        return {
          ...prev,
          [tripId]: {
            selectedDate: targetDate,
            dateOptions: current?.dateOptions ?? [],
            items: current?.items ?? [],
            isLoading: true,
          },
        };
      });

      const result = await getTripSchedulesByDate({
        tripId,
        targetDate,
        signal: abortController.signal,
      });
      if (abortController.signal.aborted || result.error === 'REQUEST_ABORTED') return;
      if (result.error || !result.data) {
        setTripTimelineByCardId((prev) => ({
          ...prev,
          [tripId]: {
            selectedDate: targetDate,
            dateOptions: prev[tripId]?.dateOptions ?? [],
            items: [],
            isLoading: false,
          },
        }));
        return;
      }
      const scheduleData = result.data;

      setTripTimelineByCardId((prev) => ({
        ...prev,
        [tripId]: {
          selectedDate: scheduleData.selectedDate,
          dateOptions: scheduleData.dateOptions,
          items: mapSchedulesToTimelineItems(scheduleData.schedules),
          isLoading: false,
        },
      }));
    },
    [],
  );

  const handleToggleTripCard = useCallback(
    (tripCardItem: TripCardViewModel) => {
      const isAlreadyOpen = openCardId === tripCardItem.id;
      if (isAlreadyOpen) {
        setOpenCardId(null);
        return;
      }

      setOpenCardId(tripCardItem.id);
      const timelineState = tripTimelineByCardId[tripCardItem.id];
      const targetDate = timelineState?.selectedDate || tripCardItem.startDate;
      fetchTripTimeline(tripCardItem.id, targetDate);
    },
    [fetchTripTimeline, openCardId, tripTimelineByCardId],
  );

  const handleSelectTimelineDate = useCallback(
    (tripId: number, targetDate: string) => {
      fetchTripTimeline(tripId, targetDate);
    },
    [fetchTripTimeline],
  );

  useEffect(() => {
    const abortController = new AbortController();
    fetchMyTrips(abortController.signal);

    return () => {
      abortController.abort();
      timelineAbortControllerRef.current?.abort();
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
              <Text className="text-p text-gray">{tripCardItems.length}개의 여행이 있어요</Text>
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
          {!isLoading && tripCardItems.length === 0 ? (
            <View className="mt-4">
              <EmptyMapScreen />
            </View>
          ) : (
            tripCardItems.map((tripCardItem) => (
              <View key={tripCardItem.id}>
                <TripCard
                  city={tripCardItem.city}
                  dateText={tripCardItem.dateText}
                  scheduleText={tripCardItem.scheduleText}
                  scheduleCountText={tripCardItem.scheduleCountText}
                  imageSource={tripCardItem.imageSource}
                  status={tripCardItem.status}
                  isOpen={openCardId === tripCardItem.id}
                  onImagePress={() => navigation.navigate('TripDetail', { tripId: tripCardItem.id })}
                  onToggle={() => handleToggleTripCard(tripCardItem)}>
                  <TripTimeline
                    dateOptions={tripTimelineByCardId[tripCardItem.id]?.dateOptions ?? []}
                    selectedDate={
                      tripTimelineByCardId[tripCardItem.id]?.selectedDate ?? tripCardItem.startDate
                    }
                    onSelectDate={(targetDate) =>
                      handleSelectTimelineDate(tripCardItem.id, targetDate)
                    }
                    items={tripTimelineByCardId[tripCardItem.id]?.items ?? []}
                    isLoading={tripTimelineByCardId[tripCardItem.id]?.isLoading ?? false}
                  />
                </TripCard>
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
