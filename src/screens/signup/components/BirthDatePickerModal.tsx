import React, { useCallback, useEffect, useMemo } from 'react';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import SpinnerColumn from '@/components/ui/SpinnerColumn';
import {
  ITEM_HEIGHT,
  VISIBLE_ITEMS,
  YEARS,
  MONTHS,
  getDaysInMonth,
  pad,
  CURRENT_YEAR,
} from '../constants';
import { CURRENT_MONTH, CURRENT_DATE } from '@/utils/dateConstants';

interface BirthDatePickerModalProps {
  visible: boolean;
  tempYear: number;
  tempMonth: number;
  tempDay: number;
  onChangeYear: (year: number) => void;
  onChangeMonth: (month: number) => void;
  onChangeDay: (day: number) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export const BirthDatePickerModal: React.FC<BirthDatePickerModalProps> = ({
  visible,
  tempYear,
  tempMonth,
  tempDay,
  onChangeYear,
  onChangeMonth,
  onChangeDay,
  onConfirm,
  onCancel,
}) => {
  const availableMonths = useMemo(
    () => (tempYear === CURRENT_YEAR ? MONTHS.filter((m) => m <= CURRENT_MONTH) : MONTHS),
    [tempYear],
  );

  const days = useMemo(() => {
    const totalDays = getDaysInMonth(tempYear, tempMonth);
    const maxDay =
      tempYear === CURRENT_YEAR && tempMonth === CURRENT_MONTH ? CURRENT_DATE : totalDays;
    return Array.from({ length: maxDay }, (_, i) => i + 1);
  }, [tempYear, tempMonth]);

  // 연도 변경 시 월 보정
  useEffect(() => {
    if (tempYear === CURRENT_YEAR && tempMonth > CURRENT_MONTH) {
      onChangeMonth(CURRENT_MONTH);
    }
  }, [tempYear]);

  // 연도/월 변경 시 일 보정
  useEffect(() => {
    const totalDays = getDaysInMonth(tempYear, tempMonth);
    const maxDay =
      tempYear === CURRENT_YEAR && tempMonth === CURRENT_MONTH ? CURRENT_DATE : totalDays;
    if (tempDay > maxDay) {
      onChangeDay(maxDay);
    }
  }, [tempYear, tempMonth]);

  const handleYearSelect = useCallback(
    (index: number) => {
      onChangeYear(YEARS[index]);
    },
    [onChangeYear],
  );

  const handleMonthSelect = useCallback(
    (index: number) => {
      onChangeMonth(availableMonths[index]);
    },
    [onChangeMonth, availableMonths],
  );

  const handleDaySelect = useCallback(
    (index: number) => {
      onChangeDay(days[index]);
    },
    [onChangeDay, days],
  );

  const backdropOpacity = useSharedValue(0);
  const sheetTranslateY = useSharedValue(300);

  useEffect(() => {
    if (visible) {
      backdropOpacity.value = withTiming(1, { duration: 250 });
      sheetTranslateY.value = withTiming(0, { duration: 250 });
    } else {
      backdropOpacity.value = withTiming(0, { duration: 200 });
      sheetTranslateY.value = withTiming(300, { duration: 200 });
    }
  }, [visible]);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdropOpacity.value }));
  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: sheetTranslateY.value }] }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent>
      <View className="flex-1 justify-end">
        <Animated.View style={[{ flex: 1 }, backdropStyle]}>
          <Pressable className="flex-1 bg-black/30" onPress={onCancel} />
        </Animated.View>

        <Animated.View
          className="rounded-t-[16px] bg-white px-6 pb-10 pt-4"
          style={sheetStyle}>
          <View className="mb-4 flex-row items-center justify-between">
            <TouchableOpacity onPress={onCancel}>
              <Text className="text-p1 text-gray">취소</Text>
            </TouchableOpacity>

            <Text className="font-pretendardSemiBold text-h3 text-black">생년월일 선택</Text>

            <TouchableOpacity onPress={onConfirm}>
              <Text className="font-pretendardSemiBold text-p1 text-main">완료</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row" style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS }}>
            <SpinnerColumn
              items={YEARS}
              selectedIndex={Math.max(0, YEARS.indexOf(tempYear))}
              onSelect={handleYearSelect}
              format={(n) => `${n}년`}
            />
            <SpinnerColumn
              items={availableMonths}
              selectedIndex={Math.max(0, availableMonths.indexOf(tempMonth))}
              onSelect={handleMonthSelect}
              format={(n) => `${pad(n)}월`}
            />
            <SpinnerColumn
              items={days}
              selectedIndex={Math.min(
                days.indexOf(tempDay) >= 0 ? days.indexOf(tempDay) : 0,
                days.length - 1,
              )}
              onSelect={handleDaySelect}
              format={(n) => `${pad(n)}일`}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

BirthDatePickerModal.displayName = 'BirthDatePickerModal';
