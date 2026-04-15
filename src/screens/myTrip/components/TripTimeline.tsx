import React, { useCallback } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { PlaceIcon, VectorIcon, VectorLeftIcon } from '@/assets/icons';
import type {
  TripTimelineListItemProps,
  TripTimelineProps,
} from '@/types/myTrip.types';

const formatTimelineTime = (time: string): string => {
  const matched = time.match(/^(\d{2}):(\d{2})/);
  if (!matched) return time;
  return `${matched[1]}:${matched[2]}`;
};

const formatDateChipLabel = (scheduleDate: string): string => {
  const [yearString, monthString, dayString] = scheduleDate.split('-');
  const year = Number(yearString);
  const month = Number(monthString);
  const day = Number(dayString);

  if (!year || !month || !day) return scheduleDate;

  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekday = weekdays[new Date(year, month - 1, day).getDay()];
  return `${month}/${day}(${weekday})`;
};

const TripTimelineListItem: React.FC<TripTimelineListItemProps> = ({ item, isLast }) => (
  <View className={`${isLast ? '' : 'mb-4'} flex-row items-start`}>
    <View className="w-[58px] items-center">
      <View className="h-[58px] w-[58px] rounded-[8px] bg-[#DF6C201A] py-3">
        <Text className="text-center font-pretendardBold text-p text-main">
          {formatTimelineTime(item.startTime)}
        </Text>
        <View className="items-center">
          <View className="w-4 border-t border-[#E5E0DC]" />
        </View>
        <Text className="text-center text-p text-gray">{formatTimelineTime(item.endTime)}</Text>
      </View>
    </View>

    <View className="ml-3 flex-1 self-start rounded-[8px] bg-[#F4F0EC80] px-4 py-[10px]">
      <Text className="font-pretendardSemiBold text-h3 text-black">{item.title}</Text>

      <View className="mt-[2px] flex-row items-center">
        <PlaceIcon width={12} height={12} />
        <Text className="ml-1 text-p text-gray">{item.location}</Text>
      </View>

      {item.description ? <Text className="mt-[2px] text-p text-gray">{item.description}</Text> : null}
    </View>
  </View>
);

const TripTimeline: React.FC<TripTimelineProps> = ({
  dateOptions,
  selectedDate,
  onSelectDate,
  items,
  isLoading = false,
}) => {
  const selectedDateIndex = Math.max(
    0,
    dateOptions.findIndex((dateOption) => dateOption.scheduleDate === selectedDate),
  );

  const handleSelectDate = useCallback(
    (index: number) => {
      const targetDate = dateOptions[index]?.scheduleDate;
      if (!targetDate) return;
      onSelectDate(targetDate);
    },
    [dateOptions, onSelectDate],
  );

  const handlePressPrev = useCallback(() => {
    if (selectedDateIndex <= 0) return;
    const targetDate = dateOptions[selectedDateIndex - 1]?.scheduleDate;
    if (!targetDate) return;
    onSelectDate(targetDate);
  }, [dateOptions, onSelectDate, selectedDateIndex]);

  const handlePressNext = useCallback(() => {
    if (selectedDateIndex >= dateOptions.length - 1) return;
    const targetDate = dateOptions[selectedDateIndex + 1]?.scheduleDate;
    if (!targetDate) return;
    onSelectDate(targetDate);
  }, [dateOptions, onSelectDate, selectedDateIndex]);

  if (!dateOptions.length) {
    if (!isLoading && !items.length) {
      return (
        <View className="py-3">
          <Text className="text-p text-gray">일정이 없습니다.</Text>
        </View>
      );
    }
    return null;
  }

  return (
    <View className="relative pb-2">
      <View className="mb-6 flex-row items-center">
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handlePressPrev}
          className="h-6 w-2 items-center justify-center">
          <VectorLeftIcon />
        </TouchableOpacity>

        <View className="relative flex-1">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            className="flex-1">
            {dateOptions.map((dateOption, index) => {
              const isSelected = index === selectedDateIndex;
              return (
                <TouchableOpacity
                  key={`${dateOption.dayNo}-${dateOption.scheduleDate}`}
                  activeOpacity={0.8}
                  onPress={() => handleSelectDate(index)}
                  className={`h-[38px] w-[85px] items-center justify-center rounded-[8px] border ${
                    isSelected ? 'border-main bg-[#DF6C201A]' : 'border-[#E5E0DC] bg-white'
                  } ${index !== dateOptions.length - 1 ? 'mr-2' : ''}`}>
                  <Text className={`text-p1 ${isSelected ? 'text-main' : 'text-gray'}`}>
                    {formatDateChipLabel(dateOption.scheduleDate)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <LinearGradient
            pointerEvents="none"
            colors={[
              'rgba(255,255,255,1)',
              'rgba(255,255,255,1)',
              'rgba(255,255,255,0.9)',
              'rgba(255,255,255,0.2)',
            ]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 20,
            }}
          />

          <LinearGradient
            pointerEvents="none"
            colors={[
              'rgba(255,255,255,0.2)',
              'rgba(255,255,255,0.9)',
              'rgba(255,255,255,1)',
              'rgba(255,255,255,1)',
            ]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: 20,
            }}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handlePressNext}
          className="h-6 w-2 items-center justify-center">
          <VectorIcon />
        </TouchableOpacity>
      </View>

      <View className="absolute bottom-0 left-[29px] top-[78px] w-[1px] bg-[#E5E0DC]" />

      {!isLoading && !items.length ? (
        <View className="pb-2 pt-1">
          <Text className="text-p text-gray"> 일정이 없습니다.</Text>
        </View>
      ) : null}

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return <TripTimelineListItem key={item.id} item={item} isLast={isLast} />;
      })}
    </View>
  );
};

export default TripTimeline;
