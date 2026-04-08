import React from 'react';
import { MainTripCardEmpty } from './MainTripCardEmpty';
import { MainTripCardPlanned } from './MainTripCardPlanned';
import { MainTripCardInProgress } from './MainTripCardInProgress';

interface MainTripCardProps {
  hasPlannedTrip: boolean;
  isInTripScheduleView: boolean;
  onAddTrip: () => void;
  onOpenTripSchedule: () => void;
  onViewAllSchedule: () => void;
}

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
