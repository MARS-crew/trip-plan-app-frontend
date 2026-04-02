import React, { useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { CalendarList, LocaleConfig } from 'react-native-calendars';

import { BackArrow } from '@/assets/icons';
import { COLORS } from '@/constants/colors';

// ==================== Types ====================
type AddTripNavigation = NativeStackNavigationProp<RootStackParamList, 'AddTripCalendar'>;

interface DateRange {
  startDate: string | null;
  endDate: string | null;
}

interface MarkedDateItem {
  selected?: boolean;
  selectedColor?: string;
  color?: string;
  textColor?: string;
  startingDay?: boolean;
  endingDay?: boolean;
}

LocaleConfig.locales.kr = {
  monthNames: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  monthNamesShort: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'kr';

const toDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const getTodayString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const getDateRange = (start: string, end: string): string[] => {
  const result: string[] = [];
  const current = toDate(start);
  const last = toDate(end);

  while (current <= last) {
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, '0');
    const day = String(current.getDate()).padStart(2, '0');
    result.push(`${year}-${month}-${day}`);
    current.setDate(current.getDate() + 1);
  }

  return result;
};

const AddTripCalendarScreen: React.FC = () => {

  // ==================== Hooks ====================
  const navigation = useNavigation<AddTripNavigation>();
  const todayString = getTodayString();
  const [range, setRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });

  const markedDates = useMemo(() => {
    const result: Record<string, MarkedDateItem> = {};

    if (!range.startDate) {
      return result;
    }

    if (!range.endDate) {
      result[range.startDate] = {
        selected: true,
        selectedColor: COLORS.main,
      };
      return result;
    }

    const dates = getDateRange(range.startDate, range.endDate);

    dates.forEach((date, index) => {
      const isStart = index === 0;
      const isEnd = index === dates.length - 1;

      result[date] = {
        color: isStart || isEnd ? COLORS.main : COLORS.serve,
        textColor: isStart || isEnd ? COLORS.white : COLORS.main,
        startingDay: isStart,
        endingDay: isEnd,
      };
    });

    return result;
  }, [range]);

  const isButtonEnabled = Boolean(range.startDate && range.endDate);

  const handleDayPress = (day: { dateString: string }): void => {
    const { dateString } = day;

    if (!range.startDate || (range.startDate && range.endDate)) {
      setRange({ startDate: dateString, endDate: null });
      return;
    }

    if (range.startDate && !range.endDate) {
      if (toDate(dateString) < toDate(range.startDate)) {
        setRange({ startDate: dateString, endDate: null });
        return;
      }

      setRange({ startDate: range.startDate, endDate: dateString });
    }
  };

  // ==================== 렌더링 ====================
  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <View className="h-14 flex-row items-center pl-6">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackArrow className="h-5 w-5" />
        </TouchableOpacity>
        <Text className="ml-4 text-h font-pretendardBold text-black">
          여행지 추가
        </Text>
      </View>

      {/* ==================== 달력 List ==================== */}
      <View className="flex-1 border-t border-borderGray bg-screenBackground">
        <View className="flex-1 pt-4">
          <CalendarList
            current={todayString}
            minDate={todayString}
            markingType="period"
            monthFormat="yyyy년 M월"
            markedDates={markedDates}
            onDayPress={handleDayPress}
            pastScrollRange={0}
            futureScrollRange={1200}
            scrollEnabled
            showScrollIndicator={false}
            calendarHeight={320}
            hideExtraDays
            contentContainerStyle={{ paddingBottom: 110 }}
            theme={{
              backgroundColor: COLORS.screenBackground,
              calendarBackground: COLORS.screenBackground,
              textSectionTitleColor: COLORS.gray,
              textSectionTitleDisabledColor: COLORS.muted,
              selectedDayBackgroundColor: COLORS.main,
              selectedDayTextColor: COLORS.white,
              todayTextColor: COLORS.main,
              dayTextColor: COLORS.black,
              textDisabledColor: COLORS.muted,
              monthTextColor: COLORS.black,
              textMonthFontWeight: '700',
              textMonthFontSize: 16,
              textDayHeaderFontSize: 12,
              textDayFontWeight: '500',
              'stylesheet.calendar.main': {
                week: {
                  marginTop: 0,
                  marginBottom: 0,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                },
              },
              'stylesheet.calendar.header': {
                header: {
                  paddingLeft: 0,
                  marginLeft: 0,
                  marginBottom: 8,
                },
                monthText: {
                  color: COLORS.black,
                  fontSize: 16,
                  fontWeight: '700',
                  textAlign: 'left',
                  alignSelf: 'flex-start',
                },
                dayTextAtIndex0: {
                  color: COLORS.sunday,
                },
                dayTextAtIndex6: {
                  color: COLORS.saturday,
                },
              },
            }}
            dayComponent={({ date, state, marking }) => {
              if (!date) {
                return <View style={{ width: 53, height: 40 }} />;
              }

              const isStart = Boolean(marking?.startingDay);
              const isEnd = Boolean(marking?.endingDay);
              const isMiddle = Boolean(marking?.color) && !isStart && !isEnd;
              const isSingle = Boolean(marking?.selected);
              const isTodayDefault =
                date.dateString === todayString && !isStart && !isEnd && !isMiddle && !isSingle;

              const weekDay = new Date(date.dateString).getDay();

              let textColor = COLORS.gray;
              if (state === 'disabled') {
                textColor = COLORS.muted;
              } else if (isStart || isEnd || isSingle) {
                textColor = COLORS.white;
              } else if (isMiddle) {
                textColor = COLORS.main;
              } else if (weekDay === 0) {
                textColor = COLORS.sunday;
              } else if (weekDay === 6) {
                textColor = COLORS.saturday;
              }

              const outerBackgroundColor = isStart || isEnd ? COLORS.serve : 'transparent';

              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  disabled={state === 'disabled'}
                  onPress={() => {
                    if (state !== 'disabled') {
                      handleDayPress({ dateString: date.dateString });
                    }
                  }}
                  className="h-[40px] items-center justify-center"
                  style={{ width: '100%' }}>
                  <View
                    className="h-[40px] items-center justify-center"
                    style={{
                      width: '100%',
                      backgroundColor: outerBackgroundColor,
                      borderTopLeftRadius: isStart ? 20 : 0,
                      borderBottomLeftRadius: isStart ? 20 : 0,
                      borderTopRightRadius: isEnd ? 20 : 0,
                      borderBottomRightRadius: isEnd ? 20 : 0,
                    }}>
                    <View
                      className="h-[40px] items-center justify-center"
                      style={{
                        width: '100%',
                        backgroundColor:
                          isStart || isEnd || isSingle
                            ? COLORS.main
                            : isMiddle
                              ? COLORS.serve
                              : 'transparent',
                        borderWidth: isTodayDefault ? 1 : 0,
                        borderColor: isTodayDefault ? COLORS.main : 'transparent',
                        borderTopLeftRadius: isStart || isSingle ? 22 : isTodayDefault ? 8 : 0,
                        borderBottomLeftRadius:
                          isStart || isSingle ? 22 : isTodayDefault ? 8 : 0,
                        borderTopRightRadius: isEnd || isSingle ? 22 : isTodayDefault ? 8 : 0,
                        borderBottomRightRadius:
                          isEnd || isSingle ? 22 : isTodayDefault ? 8 : 0,
                      }}>
                      <Text className="text-p1" style={{ color: textColor }}>
                        {date.day}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}/>
        </View>

        {/* ==================== 날짜 등록 버튼 ==================== */}
        <View className="absolute bottom-5 left-0 right-0 px-4 pb-10 pt-3">
          <View
            className="h-[44px] w-[370px] rounded-[4px]"
            style={{
              backgroundColor: COLORS.screenBackground,
              shadowColor: '#000',
              shadowOffset: { width: 1, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 1,
              elevation: 4,
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              disabled={!isButtonEnabled}
              onPress={() => navigation.navigate('WishlistScreen')}
              className="h-[44px] w-[370px] items-center justify-center rounded-[4px]"
              style={{
                backgroundColor: isButtonEnabled ? COLORS.main : COLORS.buttonDisabledOverlay,
                borderWidth: 1,
                borderColor: isButtonEnabled ? COLORS.main : COLORS.buttonDisabled,
              }}>
              <Text className="text-h3 font-pretendardSemiBold text-white">날짜 등록</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

AddTripCalendarScreen.displayName = 'AddTripCalendarScreen';

export default AddTripCalendarScreen;
export { AddTripCalendarScreen };