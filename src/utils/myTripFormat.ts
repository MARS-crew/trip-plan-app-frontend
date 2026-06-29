import type {
  MyTripItem,
  TripCardStatus,
  TripCardViewModel,
  TripFilter,
  TripSchedulesByDateData,
  TripTimelineItem,
} from '@/types/myTrip.types';

export const formatDateText = (startDate: string, endDate: string): string =>
  `${startDate.replaceAll('-', '.')} - ${endDate.replaceAll('-', '.')}`;

export const mapTripStatus = (status: MyTripItem['tripStatus']): TripCardStatus => {
  if (status === 'ONGOING') return 'traveling';
  if (status === 'COMPLETED' || status === 'PAST') return 'completed';
  return 'scheduled';
};

export const mapTripToCardViewModel = (trip: MyTripItem): TripCardViewModel => ({
  id: trip.tripId,
  city: trip.title,
  startDate: trip.startDate,
  dateText: formatDateText(trip.startDate, trip.endDate),
  scheduleText: String(trip.scheduleCount),
  scheduleCountText: String(trip.tripDayCount),
  imageSource: trip.imageUrl ? { uri: trip.imageUrl } : require('@/assets/images/place_default.png'),
  status: mapTripStatus(trip.tripStatus),
});

export const filterTripsByChip = (trips: MyTripItem[], chip: TripFilter): MyTripItem[] => {
  if (chip === '전체') return trips;
  if (chip === '예정된 여행') {
    return trips.filter((trip) => trip.tripStatus === 'PLANNED' || trip.tripStatus === 'UPCOMING');
  }
  return trips.filter((trip) => trip.tripStatus === 'COMPLETED' || trip.tripStatus === 'PAST');
};

export const mapSchedulesToTimelineItems = (
  schedules: TripSchedulesByDateData['schedules'],
): TripTimelineItem[] =>
  schedules.map((schedule) => ({
    id: String(schedule.tripScheduleId),
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    title: schedule.title,
    location: schedule.placeName || schedule.address,
    description: schedule.memo,
    imageUrl: schedule.imageUrl,
  }));
