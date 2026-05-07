import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, Share, ToastAndroid } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { deleteTripSchedule, deleteTrip, getTripSchedules, getTripShare } from '@/services';
import { getTripDayColor } from '@/screens/scheduleMap/utils';
import type {
  TripDetailHeader,
  TripDetailRoute,
  TripDetailSection,
} from '@/types/tripDetail.types';
import {
  getTripDeleteErrorToastMessage,
  getTripShareErrorMessage,
  mergeSectionsWithDayFallback,
  normalizeTripDetailData,
} from '@/utils';
import {
  Header,
  DaySection,
  KebabMenuSheet,
  CardContextMenu,
  DeleteWarningModal,
} from './components';
import { KEBAB_SHEET_HEIGHT } from './components/KebabMenuSheet';

const KEBAB_ANIMATION_DURATION = 250;
const CARD_MENU_ANIMATION_DURATION = 220;
type TripDetailNavigation = NativeStackNavigationProp<RootStackParamList, 'TripDetail'>;

const TripDetailScreen: React.FC = () => {
  const navigation = useNavigation<TripDetailNavigation>();
  const route = useRoute<TripDetailRoute>();
  const tripId = route.params?.tripId;

  const kebabTranslateY = useSharedValue(KEBAB_SHEET_HEIGHT);
  const cardMenuOpacity = useSharedValue(0);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isKebabMenuVisible, setIsKebabMenuVisible] = useState(false);
  const [isDeleteWarningVisible, setIsDeleteWarningVisible] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [selectedCardTop, setSelectedCardTop] = useState(0);
  const [isScheduleDeleteWarningVisible, setIsScheduleDeleteWarningVisible] = useState(false);
  const [pendingDeleteScheduleId, setPendingDeleteScheduleId] = useState<number | null>(null);
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

  const fetchTripDetailSchedules = useCallback(
    async (signal?: AbortSignal): Promise<void> => {
      if (!tripId) {
        setDaySections([]);
        return;
      }

      const result = await getTripSchedules({ tripId, signal });
      if (signal?.aborted || result.error?.code === 'REQUEST_ABORTED') return;
      if (result.error) {
        setDaySections([]);
        return;
      }
      const normalizedData = normalizeTripDetailData(result.data);
      setHeaderData(normalizedData.header);
      setDaySections(normalizedData.sections);
    },
    [tripId],
  );

  useEffect(() => {
    if (!tripId) {
      setDaySections([]);
      return;
    }

    const abortController = new AbortController();
    fetchTripDetailSchedules(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, [fetchTripDetailSchedules, tripId]);

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

  const handleDeleteTrip = useCallback(async (): Promise<void> => {
    if (!tripId) return;

    const result = await deleteTrip({ tripId });
    if (result.error) {
      ToastAndroid.show(getTripDeleteErrorToastMessage(result.error), ToastAndroid.SHORT);
      return;
    }

    handleCloseKebabMenu();
    setIsDeleteWarningVisible(false);
    navigation.goBack();
  }, [handleCloseKebabMenu, navigation, tripId]);
  const handleShareTrip = useCallback(async (): Promise<void> => {
    if (!tripId) return;

    const result = await getTripShare({ tripId });
    if (result.error || !result.data) {
      if (result.error?.code === 'REQUEST_ABORTED') return;
      ToastAndroid.show(getTripShareErrorMessage(result.error), ToastAndroid.SHORT);
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
    } catch {
      ToastAndroid.show('서버 오류가 발생했습니다.', ToastAndroid.SHORT);
    }
  }, [tripId]);

  const handlePressShareInKebab = useCallback(() => {
    handleCloseKebabMenu();
    void handleShareTrip();
  }, [handleCloseKebabMenu, handleShareTrip]);

  const handleDeleteSchedule = useCallback(async (): Promise<void> => {
    if (!tripId || !pendingDeleteScheduleId) return;

    const result = await deleteTripSchedule({
      tripId,
      tripScheduleId: pendingDeleteScheduleId,
    });

    if (result.error) {
      ToastAndroid.show(getTripDeleteErrorToastMessage(result.error), ToastAndroid.SHORT);
      return;
    }

    setIsScheduleDeleteWarningVisible(false);
    setPendingDeleteScheduleId(null);
    await fetchTripDetailSchedules();
  }, [fetchTripDetailSchedules, pendingDeleteScheduleId, tripId]);

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
          onPressDelete={(card) => {
            const targetScheduleId = card.tripScheduleId ?? card.id;
            if (!targetScheduleId) {
              ToastAndroid.show('알 수 없는 오류로 삭제에 실패하였습니다', ToastAndroid.SHORT);
              return;
            }
            handleCloseCardMenu();
            setPendingDeleteScheduleId(targetScheduleId);
            setIsScheduleDeleteWarningVisible(true);
          }}
          onClose={handleCloseCardMenu}
        />
      )}

      <DeleteWarningModal
        visible={isScheduleDeleteWarningVisible}
        title="일정을 삭제하시겠습니까? 취소가 불가능합니다."
        confirmLabel="삭제"
        onConfirm={() => {
          handleDeleteSchedule().catch(() => {
            ToastAndroid.show('알 수 없는 오류로 삭제에 실패하였습니다', ToastAndroid.SHORT);
          });
        }}
        onClose={() => {
          setIsScheduleDeleteWarningVisible(false);
          setPendingDeleteScheduleId(null);
        }}
      />

      <KebabMenuSheet
        isVisible={isKebabMenuVisible}
        translateY={kebabTranslateY}
        onClose={handleCloseKebabMenu}
        onPressShare={handlePressShareInKebab}
        onPressDelete={() => {
          handleCloseKebabMenu();
          setIsDeleteWarningVisible(true);
        }}
      />

      <DeleteWarningModal
        visible={isDeleteWarningVisible}
        title="여행을 삭제하시겠습니까? 취소가 불가능합니다."
        confirmLabel="삭제"
        onConfirm={() => {
          void handleDeleteTrip();
        }}
        onClose={() => setIsDeleteWarningVisible(false)}
      />
    </SafeAreaView>
  );
};

export default TripDetailScreen;
export { TripDetailScreen };
