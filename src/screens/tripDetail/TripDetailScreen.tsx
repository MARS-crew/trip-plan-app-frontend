import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Linking, ScrollView, Share, ToastAndroid } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  deleteTrip,
  deleteTripSchedule,
  getMyTrips,
  getTripRoute,
  getTripSchedules,
  getTripShare,
  updateTripTitle,
} from '@/services';
import type { RootStackParamList } from '@/navigation/types';
import { getTripDayColor } from '@/screens/scheduleMap/utils';
import type {
  TripDetailCardItem,
  TripDetailHeader,
  TripDetailRoute,
  TripDetailSection,
} from '@/types/tripDetail.types';
import {
  getServiceErrorMessage,
  getTripScheduleUpdateErrorToastMessage,
  getTripDeleteErrorToastMessage,
  getTripScheduleDeleteErrorToastMessage,
  mergeSectionsWithDayFallback,
  normalizeTripDetailData,
} from '@/utils';
import {
  Header,
  DaySection,
  KebabMenuSheet,
  CardContextMenu,
  DeleteWarningModal,
  EditTitleModal,
} from '@/screens/tripDetail/components';
import { KEBAB_SHEET_HEIGHT } from './components/KebabMenuSheet';

const KEBAB_ANIMATION_DURATION = 250;
const CARD_MENU_ANIMATION_DURATION = 220;
const TRIP_TITLE_MAX_LENGTH = 10;
type TripDetailNavigation = NativeStackNavigationProp<RootStackParamList, 'TripDetail'>;
type DeleteTarget = { type: 'trip' } | { type: 'schedule'; cardId: number; tripScheduleId: number };

const TripDetailScreen: React.FC = () => {
  const navigation = useNavigation<TripDetailNavigation>();
  const route = useRoute<TripDetailRoute>();
  const tripId = route.params?.tripId;
  const { bottom: bottomInset } = useSafeAreaInsets();
  const kebabSheetHiddenY = KEBAB_SHEET_HEIGHT + Math.max(bottomInset, 12);

  const kebabTranslateY = useSharedValue(kebabSheetHiddenY);
  const cardMenuOpacity = useSharedValue(0);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialHeaderImageUrlRef = useRef(route.params?.initialImageUrl);

  const [isKebabMenuVisible, setIsKebabMenuVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isEditTitleModalVisible, setIsEditTitleModalVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [isDeletingTrip, setIsDeletingTrip] = useState(false);
  const [isUpdatingTitle, setIsUpdatingTitle] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [selectedCardTop, setSelectedCardTop] = useState(0);
  const [editedTitle, setEditedTitle] = useState('');
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
    if (!isKebabMenuVisible) {
      kebabTranslateY.value = kebabSheetHiddenY;
    }
  }, [isKebabMenuVisible, kebabSheetHiddenY, kebabTranslateY]);

  useFocusEffect(
    useCallback(() => {
      if (!tripId) {
        setDaySections([]);
        return () => {};
      }

      const abortController = new AbortController();
      const fetchTripDetailSchedules = async (): Promise<void> => {
        const [scheduleResult, myTripsResult] = await Promise.all([
          getTripSchedules({ tripId, signal: abortController.signal }),
          getMyTrips({ signal: abortController.signal }),
        ]);
        if (
          abortController.signal.aborted ||
          scheduleResult.error?.code === 'REQUEST_ABORTED' ||
          myTripsResult.error?.code === 'REQUEST_ABORTED'
        ) {
          return;
        }
        if (scheduleResult.error) {
          setDaySections([]);
          return;
        }

        const tripListImageUrl = myTripsResult.data
          .find((trip) => trip.tripId === tripId)
          ?.imageUrl?.trim();
        const stableHeaderImageUrl =
          initialHeaderImageUrlRef.current || route.params?.initialImageUrl || tripListImageUrl;

        if (!initialHeaderImageUrlRef.current && stableHeaderImageUrl) {
          initialHeaderImageUrlRef.current = stableHeaderImageUrl;
        }

        const normalizedData = normalizeTripDetailData(scheduleResult.data);
        setHeaderData({
          ...normalizedData.header,
          imageUrl:
            initialHeaderImageUrlRef.current ?? tripListImageUrl ?? normalizedData.header.imageUrl,
        });
        setDaySections(normalizedData.sections);
      };

      void fetchTripDetailSchedules();

      return () => {
        abortController.abort();
      };
    }, [route.params?.initialImageUrl, tripId]),
  );

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
    kebabTranslateY.value = kebabSheetHiddenY;
    kebabTranslateY.value = withTiming(0, { duration: KEBAB_ANIMATION_DURATION });
  }, [clearCloseTimer, kebabSheetHiddenY, kebabTranslateY]);

  const handleCloseKebabMenu = useCallback(() => {
    clearCloseTimer();
    kebabTranslateY.value = withTiming(kebabSheetHiddenY, {
      duration: KEBAB_ANIMATION_DURATION,
    });
    closeTimerRef.current = setTimeout(() => {
      setIsKebabMenuVisible(false);
      closeTimerRef.current = null;
    }, KEBAB_ANIMATION_DURATION);
  }, [clearCloseTimer, kebabSheetHiddenY, kebabTranslateY]);

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

  const handleOpenEditTitleModal = useCallback(() => {
    handleCloseKebabMenu();
    setEditedTitle(headerData.title ?? '');
    setIsEditTitleModalVisible(true);
  }, [handleCloseKebabMenu, headerData.title]);

  const handleCloseEditTitleModal = useCallback(() => {
    setIsEditTitleModalVisible(false);
  }, []);

  const handleSubmitEditTitle = useCallback(async () => {
    if (!tripId || isUpdatingTitle) return;
    const trimmedTitle = editedTitle.trim();

    if (!trimmedTitle) {
      ToastAndroid.show('여행명을 입력해주세요.', ToastAndroid.SHORT);
      return;
    }
    if (trimmedTitle.length > TRIP_TITLE_MAX_LENGTH) {
      ToastAndroid.show('여행명은 10자 이내로 입력해주세요.', ToastAndroid.SHORT);
      return;
    }

    setIsUpdatingTitle(true);
    const result = await updateTripTitle({ tripId, payload: { title: trimmedTitle } });
    setIsUpdatingTitle(false);

    if (result.error) {
      ToastAndroid.show('제목 수정에 실패하였습니다.', ToastAndroid.SHORT);
      return;
    }

    setHeaderData((prev) => ({ ...prev, title: trimmedTitle }));
    setIsEditTitleModalVisible(false);
  }, [editedTitle, isUpdatingTitle, tripId]);

  const handleOpenEditDateModal = useCallback(() => {
    handleCloseKebabMenu();
    if (!tripId) return;
    navigation.navigate('AddTripCalendar', {
      mode: 'editDate',
      tripId,
      title: headerData.title ?? '',
      imageUrl: headerData.imageUrl ?? '',
      startDate: headerData.startDate,
      endDate: headerData.endDate,
    });
  }, [
    handleCloseKebabMenu,
    headerData.endDate,
    headerData.imageUrl,
    headerData.startDate,
    headerData.title,
    navigation,
    tripId,
  ]);

  const handleOpenTripDeleteModal = useCallback(() => {
    handleCloseKebabMenu();
    handleCloseCardMenu();
    setDeleteTarget({ type: 'trip' });
    setIsDeleteModalVisible(true);
  }, [handleCloseCardMenu, handleCloseKebabMenu]);

  const handleOpenScheduleDeleteModal = useCallback(
    (card: TripDetailCardItem) => {
      const tripScheduleId = card.tripScheduleId;
      if (!tripScheduleId) {
        ToastAndroid.show(getTripScheduleDeleteErrorToastMessage(null), ToastAndroid.SHORT);
        return;
      }
      handleCloseCardMenu();
      setDeleteTarget({ type: 'schedule', cardId: card.id, tripScheduleId });
      setIsDeleteModalVisible(true);
    },
    [handleCloseCardMenu],
  );

  const handleOpenScheduleEditScreen = useCallback(
    (card: TripDetailCardItem) => {
      if (!tripId || !card.tripScheduleId) {
        ToastAndroid.show(getTripScheduleUpdateErrorToastMessage(null), ToastAndroid.SHORT);
        return;
      }

      const scheduleDate = card.scheduleDate ?? headerData.startDate;
      if (!scheduleDate) {
        ToastAndroid.show(getTripScheduleUpdateErrorToastMessage(null), ToastAndroid.SHORT);
        return;
      }

      handleCloseCardMenu();
      navigation.navigate('AddSchedule', {
        mode: 'edit',
        tripId,
        tripTitle: headerData.title ?? '',
        tripImageUrl: headerData.imageUrl,
        tripScheduleId: card.tripScheduleId,
        date: scheduleDate,
        placeId: card.placeId,
        placeName: card.location,
        address: card.address,
        title: card.title,
        startTime: card.startTime,
        endTime: card.endTime,
        memo: card.description,
      });
    },
    [
      handleCloseCardMenu,
      headerData.imageUrl,
      headerData.startDate,
      headerData.title,
      navigation,
      tripId,
    ],
  );

  const handleCloseDeleteModal = useCallback(() => {
    setIsDeleteModalVisible(false);
    setDeleteTarget(null);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!tripId || isDeletingTrip || !deleteTarget) return;

    setIsDeletingTrip(true);
    if (deleteTarget.type === 'trip') {
      const result = await deleteTrip({ tripId });
      setIsDeletingTrip(false);
      if (result.error) {
        ToastAndroid.show(getTripDeleteErrorToastMessage(result.error), ToastAndroid.SHORT);
        return;
      }
      setIsDeleteModalVisible(false);
      setDeleteTarget(null);
      navigation.navigate('MainTabs', { screen: 'MyTrip' });
      return;
    }

    const result = await deleteTripSchedule({
      tripId,
      tripScheduleId: deleteTarget.tripScheduleId,
    });
    setIsDeletingTrip(false);
    if (result.error) {
      ToastAndroid.show(getTripScheduleDeleteErrorToastMessage(result.error), ToastAndroid.SHORT);
      return;
    }
    setDaySections((prevSections) =>
      prevSections.map((section) => ({
        ...section,
        cards: section.cards.filter((card) => card.id !== deleteTarget.cardId),
      })),
    );
    setIsDeleteModalVisible(false);
    setDeleteTarget(null);
  }, [deleteTarget, isDeletingTrip, navigation, tripId]);

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
            tripId={tripId}
            tripTitle={headerData.title}
            tripImageUrl={headerData.imageUrl}
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
          onPressEdit={handleOpenScheduleEditScreen}
          onPressRoute={(card) => {
            handlePressRouteInCard(card).catch(() => {
              handleRouteFailure('INTERNAL_ERROR', '서버 오류가 발생했습니다.');
            });
          }}
          onPressDelete={handleOpenScheduleDeleteModal}
          onClose={handleCloseCardMenu}
        />
      )}

      <KebabMenuSheet
        isVisible={isKebabMenuVisible}
        translateY={kebabTranslateY}
        hiddenTranslateY={kebabSheetHiddenY}
        bottomInset={bottomInset}
        onClose={handleCloseKebabMenu}
        onPressEditTitle={handleOpenEditTitleModal}
        onPressEditDate={handleOpenEditDateModal}
        onPressShare={handlePressShareInKebab}
        onPressDelete={handleOpenTripDeleteModal}
      />

      <DeleteWarningModal
        visible={isDeleteModalVisible}
        title={
          deleteTarget?.type === 'schedule'
            ? '일정을 삭제하시겠습니까? 취소가 불가능합니다.'
            : '여행을 삭제하시겠습니까? 취소가 불가능합니다.'
        }
        onConfirm={() => {
          handleConfirmDelete().catch(() => {
            ToastAndroid.show('삭제에 실패하였습니다.', ToastAndroid.SHORT);
          });
        }}
        onClose={handleCloseDeleteModal}
      />

      <EditTitleModal
        visible={isEditTitleModalVisible}
        value={editedTitle}
        maxLength={TRIP_TITLE_MAX_LENGTH}
        isSubmitting={isUpdatingTitle}
        onChangeValue={setEditedTitle}
        onSubmit={() => {
          handleSubmitEditTitle().catch(() => {
            ToastAndroid.show('제목 수정에 실패하였습니다.', ToastAndroid.SHORT);
          });
        }}
        onClose={handleCloseEditTitleModal}
      />
    </SafeAreaView>
  );
};

export default TripDetailScreen;
export { TripDetailScreen };
