import React, { useCallback, useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Header, DaySection, KebabMenuSheet, CardContextMenu } from './components';
import { KEBAB_SHEET_HEIGHT } from './components/KebabMenuSheet';

const KEBAB_ANIMATION_DURATION = 250;
const CARD_MENU_ANIMATION_DURATION = 220;

const CARD_TOP_OFFSET_MAP: Record<number, number> = {
  1: 258,
  2: 368,
};

const day1Cards = [
  {
    id: 1,
    order: 1,
    title: '아사쿠사 센소지',
    location: '아사쿠사, 도쿄',
    description: '도쿄에서 가장 오래된 사원 방문',
    startTime: '09:00',
    endTime: '11:00',
    isCurrentSchedule: true,
  },
  {
    id: 2,
    order: 2,
    title: '츠키지 시장 점심',
    location: '츠키지, 도쿄',
    description: '신선한 스시와 해산물 즐기기',
    startTime: '12:00',
    endTime: '12:30',
  },
];

const DAY_SECTIONS = [
  { dayLabel: '1일차 / 02/28', cards: day1Cards, showMapIcon: true },
  { dayLabel: '2일차 / 03/01', cards: [], showMapIcon: false },
  { dayLabel: '3일차 / 03/02', cards: [], showMapIcon: false },
  { dayLabel: '4일차 / 03/03', cards: [], showMapIcon: false },
];

const TripDetailScreen: React.FC = () => {
  const kebabTranslateY = useSharedValue(KEBAB_SHEET_HEIGHT);
  const cardMenuOpacity = useSharedValue(0);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isKebabMenuVisible, setIsKebabMenuVisible] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [selectedCardTop, setSelectedCardTop] = useState(0);

  const selectedCard = selectedCardId !== null
    ? day1Cards.find((card) => card.id === selectedCardId) ?? null
    : null;

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

   const handleOpenCardMenu = useCallback((cardId: number, yOffset: number) => {
     clearCloseTimer();
     setIsKebabMenuVisible(false);
     setSelectedCardId(cardId);
     setSelectedCardTop(yOffset);
     cardMenuOpacity.value = 0;
     cardMenuOpacity.value = withTiming(1, { duration: CARD_MENU_ANIMATION_DURATION });
   }, [cardMenuOpacity, clearCloseTimer]);

  const handleCloseCardMenu = useCallback(() => {
    clearCloseTimer();
    cardMenuOpacity.value = withTiming(0, { duration: CARD_MENU_ANIMATION_DURATION });
    closeTimerRef.current = setTimeout(() => {
      setSelectedCardId(null);
      closeTimerRef.current = null;
    }, CARD_MENU_ANIMATION_DURATION);
  }, [cardMenuOpacity, clearCloseTimer]);

  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}>
        <Header onPressKebab={handleOpenKebabMenu} />

        {DAY_SECTIONS.map(({ dayLabel, cards, showMapIcon }) => (
          <DaySection
            key={dayLabel}
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
          topOffset={selectedCardTop}   // ← 동적 y값
          onClose={handleCloseCardMenu}
        />
      )}

      <KebabMenuSheet
        isVisible={isKebabMenuVisible}
        translateY={kebabTranslateY}
        onClose={handleCloseKebabMenu}
      />
    </SafeAreaView>
  );
};

export default TripDetailScreen;
export { TripDetailScreen };
