import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView } from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getTripSchedules } from '@/services';
import type { TripDetailHeader, TripDetailSection, TripShareRoute } from '@/types/tripDetail.types';
import { mergeSectionsWithDayFallback, normalizeTripDetailData } from '@/utils';
import { DaySection, Header } from '@/screens/tripDetail/components';

const TripShareScreen: React.FC = () => {
  const route = useRoute<TripShareRoute>();
  const tripId = route.params?.tripId;

  const [headerData, setHeaderData] = useState<TripDetailHeader>({
    title: '',
    dateText: '',
    tripDayCount: 1,
  });
  const [daySections, setDaySections] = useState<TripDetailSection[]>([]);

  const renderedSections = useMemo(
    () =>
      mergeSectionsWithDayFallback(daySections, headerData.tripDayCount ?? 1, headerData.startDate),
    [daySections, headerData.startDate, headerData.tripDayCount],
  );

  useFocusEffect(
    useCallback(() => {
      if (!tripId) {
        setDaySections([]);
        return () => {};
      }

      const abortController = new AbortController();
      const fetchTripDetailSchedules = async (): Promise<void> => {
        const result = await getTripSchedules({ tripId, signal: abortController.signal });
        if (abortController.signal.aborted || result.error?.code === 'REQUEST_ABORTED') return;
        if (result.error) {
          setDaySections([]);
          return;
        }
        const normalizedData = normalizeTripDetailData(result.data);
        setHeaderData(normalizedData.header);
        setDaySections(normalizedData.sections);
      };

      void fetchTripDetailSchedules();

      return () => {
        abortController.abort();
      };
    }, [tripId]),
  );

  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 48 }}>
        <Header
          isReadOnly
          tripId={tripId}
          title={headerData.title}
          dateText={headerData.dateText}
          imageUrl={headerData.imageUrl}
        />

        {renderedSections.map(({ dayNo, dayLabel, cards, showMapIcon }) => (
          <DaySection
            key={`${dayNo}-${dayLabel}`}
            isReadOnly
            dayNo={dayNo}
            dayLabel={dayLabel}
            cards={cards}
            showMapIcon={showMapIcon}
            tripId={tripId}
            tripTitle={headerData.title}
            onPressAction={() => {}}
            onPressCard={() => {}}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default TripShareScreen;
export { TripShareScreen };
