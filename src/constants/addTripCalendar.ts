import type React from 'react';
import type { CalendarList } from 'react-native-calendars';
import { COLORS } from '@/constants/colors';

export const ADD_TRIP_CALENDAR_THEME = {
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
} as unknown as NonNullable<React.ComponentProps<typeof CalendarList>['theme']>;
