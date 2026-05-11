import type {
  TripDetailCardItem,
  TripDetailHeader,
  TripDetailSection,
} from '@/types/tripDetail.types';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const toStringValue = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
};

const toNumberValue = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
};

const toRecordArray = (value: unknown): Record<string, unknown>[] =>
  Array.isArray(value) ? value.filter(isRecord) : [];

const getScheduleListFromGroup = (group: Record<string, unknown>): Record<string, unknown>[] => {
  const scheduleListKeys = ['schedules', 'tripSchedules', 'scheduleList', 'items', 'cards'];
  for (const key of scheduleListKeys) {
    const list = toRecordArray(group[key]);
    if (list.length) return list;
  }
  return [];
};

const formatTripDateText = (startDate: string | null, endDate: string | null): string => {
  if (!startDate || !endDate) return '';
  return `${startDate.replaceAll('-', '.')} - ${endDate.replaceAll('-', '.')}`;
};

const formatDayLabel = (dayNo: number, scheduleDate: string | null): string => {
  if (!scheduleDate) return `${dayNo}일차`;
  const [yearString, monthString, dayString] = scheduleDate.split('-');
  const year = Number(yearString);
  const month = Number(monthString);
  const day = Number(dayString);
  if (!year || !month || !day) return `${dayNo}일차`;
  const monthText = String(month).padStart(2, '0');
  const dayText = String(day).padStart(2, '0');
  return `${dayNo}일차 / ${monthText}.${dayText}`;
};

const formatDateByOffset = (startDate: string, offset: number): string | null => {
  const [yearString, monthString, dayString] = startDate.split('-');
  const year = Number(yearString);
  const month = Number(monthString);
  const day = Number(dayString);
  if (!year || !month || !day) return null;
  const date = new Date(year, month - 1, day + offset);
  const monthText = String(date.getMonth() + 1).padStart(2, '0');
  const dayText = String(date.getDate()).padStart(2, '0');
  return `${monthText}.${dayText}`;
};

export const buildEmptyDaySections = (
  tripDayCount: number,
  startDate?: string,
): TripDetailSection[] => {
  const safeDayCount = Math.max(1, tripDayCount || 1);
  return Array.from({ length: safeDayCount }, (_, index) => {
    const dayNo = index + 1;
    const dateText = startDate ? formatDateByOffset(startDate, index) : null;
    return {
      dayNo,
      dayLabel: dateText ? `${dayNo}일차 / ${dateText}` : `${dayNo}일차`,
      cards: [],
      showMapIcon: dayNo === 1,
    };
  });
};

export const mergeSectionsWithDayFallback = (
  sections: TripDetailSection[],
  tripDayCount: number,
  startDate?: string,
): TripDetailSection[] => {
  const emptySections = buildEmptyDaySections(tripDayCount, startDate);
  if (!sections.length) return emptySections;

  const sectionMap = new Map<number, TripDetailSection>(
    sections.map((section) => [section.dayNo, section]),
  );
  return emptySections.map((emptySection) => sectionMap.get(emptySection.dayNo) ?? emptySection);
};

const formatScheduleTime = (time: string | null): string => {
  if (!time) return '';
  const matched = time.match(/^(\d{2}):(\d{2})/);
  if (!matched) return time;
  return `${matched[1]}:${matched[2]}`;
};

const mapScheduleToCardItem = (
  schedule: Record<string, unknown>,
  order: number,
  isCurrentSchedule: boolean,
): TripDetailCardItem => ({
  id: toNumberValue(schedule.tripScheduleId) ?? toNumberValue(schedule.id) ?? order,
  tripScheduleId: toNumberValue(schedule.tripScheduleId) ?? toNumberValue(schedule.id) ?? undefined,
  order,
  title: toStringValue(schedule.title) ?? '',
  location: toStringValue(schedule.placeName) ?? toStringValue(schedule.address) ?? '',
  description: toStringValue(schedule.memo) ?? '',
  startTime: formatScheduleTime(toStringValue(schedule.startTime)),
  endTime: formatScheduleTime(toStringValue(schedule.endTime)),
  isCurrentSchedule,
});

export const normalizeTripDetailData = (
  rawData: unknown,
): { header: TripDetailHeader; sections: TripDetailSection[] } => {
  if (Array.isArray(rawData)) {
    const flatSchedules = toRecordArray(rawData);
    const sections = flatSchedules.length
      ? [
          {
            dayNo: 1,
            dayLabel: '1일차',
            cards: flatSchedules.map((schedule, index) =>
              mapScheduleToCardItem(schedule, index + 1, index === 0),
            ),
            showMapIcon: true,
          },
        ]
      : [];
    return { header: { title: '', dateText: '', tripDayCount: 1 }, sections };
  }

  if (!isRecord(rawData)) {
    return { header: { title: '', dateText: '', tripDayCount: 1 }, sections: [] };
  }

  const title = toStringValue(rawData.tripTitle) ?? toStringValue(rawData.title) ?? '';
  const startDate = toStringValue(rawData.startDate) ?? undefined;
  const endDate = toStringValue(rawData.endDate);
  const tripDayCount =
    toNumberValue(rawData.tripDayCount) ??
    toNumberValue(rawData.dayCount) ??
    toNumberValue(rawData.totalDayCount) ??
    1;
  const dateText = formatTripDateText(startDate ?? null, endDate);
  const imageUrl = toStringValue(rawData.imageUrl) ?? undefined;

  const header: TripDetailHeader = {
    title,
    dateText,
    imageUrl,
    startDate,
    endDate: endDate ?? undefined,
    tripDayCount,
  };

  const dayGroupKeys = [
    'daySchedules',
    'schedulesByDate',
    'days',
    'scheduleGroups',
    'dailySchedules',
    'tripScheduleGroups',
  ];
  for (const key of dayGroupKeys) {
    const dayGroups = toRecordArray(rawData[key]);
    if (!dayGroups.length) continue;

    const sections = dayGroups.map((group, sectionIndex) => {
      const dayNo =
        toNumberValue(group.dayNo) ?? toNumberValue(group.selectedDayNo) ?? sectionIndex + 1;
      const scheduleDate = toStringValue(group.scheduleDate) ?? toStringValue(group.date);
      const selectedDayLabel = toStringValue(group.selectedDayLabel);
      const cards = getScheduleListFromGroup(group).map((schedule, cardIndex) =>
        mapScheduleToCardItem(schedule, cardIndex + 1, sectionIndex === 0 && cardIndex === 0),
      );
      return {
        dayNo,
        dayLabel: selectedDayLabel ?? formatDayLabel(dayNo, scheduleDate),
        cards,
        showMapIcon: sectionIndex === 0,
      };
    });

    return { header, sections: sections.filter((section) => section.cards.length > 0) };
  }

  const flatScheduleKeys = ['schedules', 'tripSchedules', 'scheduleList', 'items', 'cards'];
  let flatSchedules: Record<string, unknown>[] = [];
  for (const key of flatScheduleKeys) {
    const list = toRecordArray(rawData[key]);
    if (list.length) {
      flatSchedules = list;
      break;
    }
  }

  if (!flatSchedules.length) {
    return { header, sections: [] };
  }

  const grouped = new Map<
    string,
    { dayNo: number; scheduleDate: string | null; items: Record<string, unknown>[] }
  >();
  flatSchedules.forEach((schedule) => {
    const dayNo = toNumberValue(schedule.dayNo) ?? 1;
    const scheduleDate = toStringValue(schedule.scheduleDate) ?? null;
    const key = `${dayNo}-${scheduleDate ?? 'none'}`;
    const targetGroup = grouped.get(key);
    if (targetGroup) {
      targetGroup.items.push(schedule);
      return;
    }
    grouped.set(key, { dayNo, scheduleDate, items: [schedule] });
  });

  const sections = Array.from(grouped.values())
    .sort((a, b) => a.dayNo - b.dayNo)
    .map((group, sectionIndex) => ({
      dayNo: group.dayNo,
      dayLabel: formatDayLabel(group.dayNo, group.scheduleDate),
      cards: group.items.map((schedule, cardIndex) =>
        mapScheduleToCardItem(schedule, cardIndex + 1, sectionIndex === 0 && cardIndex === 0),
      ),
      showMapIcon: sectionIndex === 0,
    }));

  return { header, sections };
};
