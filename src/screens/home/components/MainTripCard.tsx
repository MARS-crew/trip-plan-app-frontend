import React from 'react';
import type { MainTripCardProps } from '@/types/home';
import { MainTripCardEmpty } from './MainTripCardEmpty';
import { MainTripCardPlanned } from './MainTripCardPlanned';
import { MainTripCardInProgress } from './MainTripCardInProgress';

const MainTripCard: React.FC<MainTripCardProps> = ({
  hasPlannedTrip,
  isInTripScheduleView,
  onAddTrip,
  onOpenTripSchedule,
  onViewAllSchedule,
  nearbyTrip = null,
}) => {
  if (!hasPlannedTrip) {
    return <MainTripCardEmpty onAddTrip={onAddTrip} />;
  }

  if (!isInTripScheduleView) {
    return (
      <MainTripCardPlanned
        onOpenTripSchedule={onOpenTripSchedule}
        {...(nearbyTrip
          ? {
              tripTitle: nearbyTrip.tripTitle,
              startDate: nearbyTrip.startDate,
              endDate: nearbyTrip.endDate,
              scheduleCount: nearbyTrip.scheduleCount,
              daysUntilTrip: nearbyTrip.daysUntilTrip,
              tripDayCount: nearbyTrip.tripDayCount,
              progressRate: nearbyTrip.progressRate,
            }
          : {})}
      />
    );
  }

  return (
    <MainTripCardInProgress
      onViewAllSchedule={onViewAllSchedule}
      {...(nearbyTrip
        ? { tripTitle: nearbyTrip.tripTitle, nextSchedules: nearbyTrip.nextSchedules }
        : {})}
    />
  );
};

export default MainTripCard;
export { MainTripCard };
