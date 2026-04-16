import React, { useRef } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import TripDetailCard from '@/components/ui/TripDetailCard';
import { Map2Icon, PlusGrayIcon } from '@/assets/icons';
import { getTripDayColor } from '@/screens/scheduleMap/utils';
import type { DaySectionProps } from '@/types/tripDetail.types';

type TripDetailNavigation = NativeStackNavigationProp<RootStackParamList, 'TripDetail'>;

const DaySection = ({
  dayNo,
  dayLabel,
  cards = [],
  showMapIcon = false,
  onPressCard,
  onPressAction,
}: DaySectionProps) => {
  const navigation = useNavigation<TripDetailNavigation>();
  const cardRefs = useRef<Record<number, View | null>>({});

  const handlePressCard = (cardId: number) => {
    cardRefs.current[cardId]?.measureInWindow((x, y) => {
      onPressCard(cardId, y + 22);
    });
  };

  return (
    <View className="bg-screenBackground pt-[19px] pb-3">
      <View className="flex-row items-center justify-between px-4">
        <Text className="text-h3 font-semibold">{dayLabel}</Text>
        {showMapIcon && (
          <TouchableOpacity
            onPress={() => navigation.navigate('ScheduleMap')}>
            <Map2Icon width={20} height={20} />
          </TouchableOpacity>
        )}
      </View>

      <View className="mt-[18px] border-t border-borderGray" />

      {cards.map((card) => (
        <View
          key={card.id}
          ref={(ref) => { cardRefs.current[card.id] = ref; }}
          className="mt-[12px] px-4">
          <TripDetailCard
            {...card}
            accentColor={getTripDayColor(dayNo)}
            onPressAction={() => onPressAction(card.id)}
            onPressCard={() => handlePressCard(card.id)}
          />
        </View>
      ))}

      <View className="mt-[12px] px-4">
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('AddSchedule')}
          className="h-[50px] w-full flex-row items-center justify-center rounded-[8px] border border-borderGray border-dashed">
          <PlusGrayIcon />
          <Text className="ml-[2px] text-p1 text-gray">일정 추가하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DaySection;
