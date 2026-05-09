import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Linking, ScrollView, Share, ToastAndroid } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getTripRoute, getTripSchedules, getTripShare } from '@/services';
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
      if (result.error?.code === 'REQUEST_ABORTED') return;
      console.error(`[tripShare] ${getServiceErrorMessage(result.error)}`);
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
      console.error('[tripShare] 서버 오류가 발생했습니다.');
    }
  }, [tripId]);

  const handleRouteFailure = useCallback((errorCode: string, message: string): void => {
    console.error(`[tripRoute] 길찾기 실패 errorCode=${errorCode} message=${message}`);
    ToastAndroid.show('길찾기 요청에 실패하였습니다', ToastAndroid.SHORT);
  }, []);

  const handlePressShareInKebab = useCallback(() => {
    handleCloseKebabMenu();
    handleShareTrip().catch(() => {
      console.error(
        '[tripShare] 공유 실패 errorCode=INTERNAL_ERROR message=서버 오류가 발생했습니다.',
      );
    });
  }, [handleCloseKebabMenu, handleShareTrip]);

  const handlePressRouteInCard = useCallback(
    async (card: TripDetailCardItem): Promise<void> => {
      if (!tripId) return;
      const tripScheduleId = card.tripScheduleId;
      if (!tripScheduleId) {
        handleRouteFailure('INVALID_INPUT', '잘못된 요청입니다.');
        return;
      }

      const result = await getTripRoute({ tripId, tripScheduleId });
      if (result.error || !result.data) {
        if (result.error?.code === 'REQUEST_ABORTED') return;
        handleRouteFailure(
          result.error?.code ?? 'INTERNAL_ERROR',
          getServiceErrorMessage(result.error),
        );
        return;
      }

      const routeUrl = result.data.googleDirectionsUrl?.trim();
      if (!routeUrl) {
        handleRouteFailure('INTERNAL_ERROR', '서버 오류가 발생했습니다.');
        return;
      }

      try {
        const canOpen = await Linking.canOpenURL(routeUrl);
        if (!canOpen) {
          handleRouteFailure('CLIENT_ERROR', '길찾기를 실행할 수 있는 앱이 없습니다.');
          return;
        }
        await Linking.openURL(routeUrl);
        handleCloseCardMenu();
      } catch {
        handleRouteFailure('INTERNAL_ERROR', '서버 오류가 발생했습니다.');
      }
    },
    [handleCloseCardMenu, handleRouteFailure, tripId],
  );

  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 310 }}>
        <Header
          onPressKebab={handleOpenKebabMenu}
          tripId={tripId}
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
          onPressRoute={(card) => {
            handlePressRouteInCard(card).catch(() => {
              handleRouteFailure('INTERNAL_ERROR', '서버 오류가 발생했습니다.');
            });
          }}
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
