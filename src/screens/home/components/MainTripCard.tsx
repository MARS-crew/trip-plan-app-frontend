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
}) => {
  if (!hasPlannedTrip) {
    return <MainTripCardEmpty onAddTrip={onAddTrip} />;
  }

  if (!isInTripScheduleView) {
    return <MainTripCardPlanned onOpenTripSchedule={onOpenTripSchedule} />;
  }

  return <MainTripCardInProgress onViewAllSchedule={onViewAllSchedule} />;
};

export default MainTripCard;
export { MainTripCard };
