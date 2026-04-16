import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, Share } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getTripSchedules, getTripShare } from '@/services';
import { getTripDayColor } from '@/screens/scheduleMap/utils';
import type {
  TripDetailCardItem,
  TripDetailHeader,
  TripDetailRoute,
  TripDetailSection,
} from '@/types/tripDetail.types';
import { Header, DaySection, KebabMenuSheet, CardContextMenu } from './components';
import { KEBAB_SHEET_HEIGHT } from './components/KebabMenuSheet';

const KEBAB_ANIMATION_DURATION = 250;
const CARD_MENU_ANIMATION_DURATION = 220;

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

const buildEmptyDaySections = (tripDayCount: number, startDate?: string): TripDetailSection[] => {
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

const mergeSectionsWithDayFallback = (
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
  order,
  title: toStringValue(schedule.title) ?? '',
  location: toStringValue(schedule.placeName) ?? toStringValue(schedule.address) ?? '',
  description: toStringValue(schedule.memo) ?? '',
  startTime: formatScheduleTime(toStringValue(schedule.startTime)),
  endTime: formatScheduleTime(toStringValue(schedule.endTime)),
  isCurrentSchedule,
});

const normalizeTripDetailData = (
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

  const header: TripDetailHeader = { title, dateText, imageUrl, startDate, tripDayCount };

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

const TripDetailScreen: React.FC = () => {
  const route = useRoute<TripDetailRoute>();
  const tripId = route.params?.tripId;

  const kebabTranslateY = useSharedValue(KEBAB_SHEET_HEIGHT);
  const cardMenuOpacity = useSharedValue(0);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isKebabMenuVisible, setIsKebabMenuVisible] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [selectedCardTop, setSelectedCardTop] = useState(0);
  const [headerData, setHeaderData] = useState<TripDetailHeader>({
    title: '',
    dateText: '',
    tripDayCount: 1,
  });
  const [daySections, setDaySections] = useState<TripDetailSection[]>([]);

  const allCards = useMemo(() => daySections.flatMap((section) => section.cards), [daySections]);
  const renderedSections = useMemo(
    () =>
      mergeSectionsWithDayFallback(daySections, headerData.tripDayCount ?? 1, headerData.startDate),
    [daySections, headerData.startDate, headerData.tripDayCount],
  );
  const selectedCard = useMemo(
    () =>
      selectedCardId !== null
        ? (allCards.find((card) => card.id === selectedCardId) ?? null)
        : null,
    [allCards, selectedCardId],
  );
  const selectedCardAccentColor = useMemo(() => {
    if (selectedCardId === null) return getTripDayColor(1);

    const selectedSection = renderedSections.find((section) =>
      section.cards.some((card) => card.id === selectedCardId),
    );
    return getTripDayColor(selectedSection?.dayNo ?? 1);
  }, [renderedSections, selectedCardId]);

  useEffect(() => {
    if (!tripId) {
      setDaySections([]);
      return;
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

    fetchTripDetailSchedules();

    return () => {
      abortController.abort();
    };
  }, [tripId]);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const handleOpenKebabMenu = useCallback(() => {
    clearCloseTimer();
    setSelectedCardId(null);
    setIsKebabMenuVisible(true);
    kebabTranslateY.value = KEBAB_SHEET_HEIGHT;
    kebabTranslateY.value = withTiming(0, { duration: KEBAB_ANIMATION_DURATION });
  }, [clearCloseTimer, kebabTranslateY]);

  const handleCloseKebabMenu = useCallback(() => {
    clearCloseTimer();
    kebabTranslateY.value = withTiming(KEBAB_SHEET_HEIGHT, { duration: KEBAB_ANIMATION_DURATION });
    closeTimerRef.current = setTimeout(() => {
      setIsKebabMenuVisible(false);
      closeTimerRef.current = null;
    }, KEBAB_ANIMATION_DURATION);
  }, [clearCloseTimer, kebabTranslateY]);

  const handleOpenCardMenu = useCallback(
    (cardId: number, yOffset: number) => {
      clearCloseTimer();
      setIsKebabMenuVisible(false);
      setSelectedCardId(cardId);
      setSelectedCardTop(yOffset);
      cardMenuOpacity.value = 0;
      cardMenuOpacity.value = withTiming(1, { duration: CARD_MENU_ANIMATION_DURATION });
    },
    [cardMenuOpacity, clearCloseTimer],
  );

  const handleCloseCardMenu = useCallback(() => {
    clearCloseTimer();
    cardMenuOpacity.value = withTiming(0, { duration: CARD_MENU_ANIMATION_DURATION });
    closeTimerRef.current = setTimeout(() => {
      setSelectedCardId(null);
      closeTimerRef.current = null;
    }, CARD_MENU_ANIMATION_DURATION);
  }, [cardMenuOpacity, clearCloseTimer]);

  const handleShareTrip = useCallback(async (): Promise<void> => {
    if (!tripId) return;

    const result = await getTripShare({ tripId });
    if (result.error || !result.data) {
      return;
    }

    const title = result.data.shareTitle?.trim() || result.data.tripTitle?.trim() || '여행 공유';
    const description = result.data.shareDescription?.trim() || '';
    const shareUrl = result.data.shareUrl?.trim() || '';
    const message = [description, shareUrl].filter(Boolean).join('\n');

    try {
      await Share.share({
        title,
        message: message || title,
        url: shareUrl || undefined,
      });
    } catch {}
  }, [tripId]);

  const handlePressShareInKebab = useCallback(() => {
    handleCloseKebabMenu();
    void handleShareTrip();
  }, [handleCloseKebabMenu, handleShareTrip]);

  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 310 }}>
        <Header
          onPressKebab={handleOpenKebabMenu}
          title={headerData.title}
          dateText={headerData.dateText}
          imageUrl={headerData.imageUrl}
        />

        {renderedSections.map(({ dayNo, dayLabel, cards, showMapIcon }) => (
          <DaySection
            key={`${dayNo}-${dayLabel}`}
            dayNo={dayNo}
            dayLabel={dayLabel}
            cards={cards}
            showMapIcon={showMapIcon}
            onPressCard={handleOpenCardMenu}
            onPressAction={() => {}}
          />
        ))}
      </ScrollView>

      {selectedCard !== null && (
        <CardContextMenu
          card={selectedCard}
          opacity={cardMenuOpacity}
          topOffset={selectedCardTop}
          accentColor={selectedCardAccentColor}
          onClose={handleCloseCardMenu}
        />
      )}

      <KebabMenuSheet
        isVisible={isKebabMenuVisible}
        translateY={kebabTranslateY}
        onClose={handleCloseKebabMenu}
        onPressShare={handlePressShareInKebab}
      />
    </SafeAreaView>
  );
};

export default TripDetailScreen;
export { TripDetailScreen };
