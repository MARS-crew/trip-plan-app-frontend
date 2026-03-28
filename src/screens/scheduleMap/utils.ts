import { COLORS, TRIP_DAY_COLOR_PALETTE } from '@/constants/colors';
import type { DayGroup, RoutePoint } from './types';

export const groupRoutePointsByDay = (points: RoutePoint[]): DayGroup[] => {
  const grouped = points.reduce<Record<number, RoutePoint[]>>((acc, point) => {
    if (!acc[point.day]) {
      acc[point.day] = [];
    }
    acc[point.day].push(point);
    return acc;
  }, {});

  return Object.entries(grouped)
    .map(([day, dayPoints]) => ({
      day: Number(day),
      points: [...dayPoints].sort((a, b) => a.order - b.order),
    }))
    .sort((a, b) => a.day - b.day);
};

export const createDayColorMap = (dayGroups: DayGroup[]): Record<number, string> => {
  const shuffledPalette = [...TRIP_DAY_COLOR_PALETTE];

  for (let index = shuffledPalette.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledPalette[index], shuffledPalette[randomIndex]] = [
      shuffledPalette[randomIndex],
      shuffledPalette[index],
    ];
  }

  return dayGroups.reduce<Record<number, string>>((acc, dayGroup, index) => {
    acc[dayGroup.day] = shuffledPalette[index % shuffledPalette.length] ?? COLORS.main;
    return acc;
  }, {});
};

export const getSelectedDayColor = (
  selectedDay: DayGroup | undefined,
  dayColorMap: Record<number, string>,
): string => {
  if (!selectedDay) {
    return COLORS.main;
  }

  return dayColorMap[selectedDay.day] ?? COLORS.main;
};

export const getPreviewPoint = (
  dayPoints: RoutePoint[],
  selectedItemIndex: number,
  groupedDays: DayGroup[],
  selectedDayIndex: number,
  currentPoint: RoutePoint | undefined,
): RoutePoint | undefined => {
  const nextItem = dayPoints[selectedItemIndex + 1] ?? dayPoints[selectedItemIndex - 1];
  const nextDayItem =
    groupedDays[selectedDayIndex + 1]?.points[0] ?? groupedDays[selectedDayIndex - 1]?.points[0];

  return nextItem ?? nextDayItem ?? currentPoint;
};

export const canShowTravelLogAction = (point: RoutePoint | undefined): boolean => {
  return point?.day === 1 && point?.order === 1;
};
