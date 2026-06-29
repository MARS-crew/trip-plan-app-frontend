import React, { useCallback, useEffect, useState } from 'react';
import {
  Modal,
  ToastAndroid,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';

import { TopBar } from '@/components';
import { SpinnerColumn } from '@/components/ui';
import { COLORS } from '@/constants/colors';
import { createSchedule, updateTripSchedule } from '@/services/tripService';
import { getTripScheduleUpdateErrorToastMessage } from '@/utils';

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;
const SCHEDULE_TITLE_MAX_LENGTH = 10;

const YEARS = Array.from({ length: 10 }, (_, i) => 2024 + i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

const pad = (n: number): string => String(n).padStart(2, '0');
const getDaysInMonth = (year: number, month: number): number => new Date(year, month, 0).getDate();
const parseTimeToValue = (time?: string): TimeValue | null => {
  if (!time) return null;
  const [hourString, minuteString] = time.split(':');
  const hour = Number(hourString);
  const minute = Number(minuteString);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
  return { hour, minute };
};

interface DateValue {
  year: number;
  month: number;
  day: number;
}

interface TimeValue {
  hour: number;
  minute: number;
}

interface FormValues {
  title: string;
  date: DateValue | null;
  startTime: TimeValue | null;
  endTime: TimeValue | null;
  location: string;
  memo: string;
}

type PickerMode = 'date' | 'startTime' | 'endTime' | null;
type AddScheduleNavigation = NativeStackNavigationProp<RootStackParamList, 'AddSchedule'>;

const getDatePickerOptions = (today: Date, year: number, month: number, day: number) => {
  const years = YEARS;
  const selectedYear = years.includes(year) ? year : years[0];

  const months = MONTHS;
  const selectedMonth = months.includes(month) ? month : months[0];

  const daysInMonth = Array.from(
    { length: getDaysInMonth(selectedYear, selectedMonth) },
    (_, i) => i + 1,
  );
  const days = daysInMonth;
  const selectedDay = days.includes(day) ? day : days[0];

  return { years, months, days, selectedYear, selectedMonth, selectedDay };
};

const AddScheduleScreen = () => {
  const navigation = useNavigation<AddScheduleNavigation>();
  const route = useRoute<RouteProp<RootStackParamList, 'AddSchedule'>>();
  const params = route.params;
  const isEditMode = params?.mode === 'edit';
  const today = new Date();

  const handleNavigateToTripDetail = (): void => {
    if (isEditMode) {
      navigation.popToTop();
      return;
    }

    if (params?.tripId) {
      navigation.replace('TripDetail', { tripId: params.tripId });
    } else {
      navigation.replace('TripDetail');
    }
  };
  const handleNavigateToAddCalendarMap = (): void => {
    navigation.navigate('AddCalendarMapScreen', {
      tripId: params?.tripId,
      tripTitle: params?.tripTitle,
      date: dateLabel !== '날짜' ? dateLabel : params?.date,
      tripScheduleId: params?.tripScheduleId,
      title: formValues.title,
      startTime: formValues.startTime
        ? `${pad(formValues.startTime.hour)}:${pad(formValues.startTime.minute)}`
        : undefined,
      endTime: formValues.endTime
        ? `${pad(formValues.endTime.hour)}:${pad(formValues.endTime.minute)}`
        : undefined,
      memo: formValues.memo,
    });
  };

  const initialDate: DateValue | null = (() => {
    if (!params?.date) return null;
    const [y, m, d] = params.date.split('-').map(Number);
    return { year: y, month: m, day: d };
  })();

  const [formValues, setFormValues] = useState<FormValues>({
    title: params?.title ?? params?.placeName ?? '',
    date: initialDate,
    startTime: parseTimeToValue(params?.startTime),
    endTime: parseTimeToValue(params?.endTime),
    location: params?.address ?? '',
    memo: params?.memo ?? '',
  });

  useEffect(() => {
    if (!params?.address && !params?.placeName) return;
    setFormValues((prev) => ({
      ...prev,
      location: params.address ?? prev.location,
      title: prev.title || params.placeName || prev.title,
    }));
  }, [params?.address, params?.placeName]);

  const [pickerMode, setPickerMode] = useState<PickerMode>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [tempYear, setTempYear] = useState(today.getFullYear());
  const [tempMonth, setTempMonth] = useState(today.getMonth() + 1);
  const [tempDay, setTempDay] = useState(today.getDate());
  const [tempHour, setTempHour] = useState(9);
  const [tempMinute, setTempMinute] = useState(0);

  const handleChangeText = useCallback((field: 'title' | 'location' | 'memo', value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const openDatePicker = (): void => {
    const safeDate = formValues.date ?? {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate(),
    };
    setTempYear(safeDate.year);
    setTempMonth(safeDate.month);
    setTempDay(safeDate.day);
    setPickerMode('date');
  };

  const openTimePicker = (mode: 'startTime' | 'endTime'): void => {
    const currentTime = formValues[mode];
    let hour = currentTime?.hour ?? 9;
    let minute = currentTime?.minute ?? 0;

    if (mode === 'endTime' && formValues.startTime) {
      const st = formValues.startTime;
      if (hour < st.hour || (hour === st.hour && minute <= st.minute)) {
        hour = st.minute < 59 ? st.hour : st.hour + 1;
        minute = st.minute < 59 ? st.minute + 1 : 0;
      }
    } else if (mode === 'startTime' && formValues.endTime) {
      const et = formValues.endTime;
      if (hour > et.hour || (hour === et.hour && minute >= et.minute)) {
        hour = et.minute > 0 ? et.hour : et.hour - 1;
        minute = et.minute > 0 ? et.minute - 1 : 59;
      }
    }

    setTempHour(hour);
    setTempMinute(minute);
    setPickerMode(mode);
  };

  const {
    years: availableYears,
    months: availableMonths,
    days: availableDays,
    selectedYear,
    selectedMonth,
    selectedDay,
  } = getDatePickerOptions(today, tempYear, tempMonth, tempDay);

  const availableHours = (() => {
    if (pickerMode === 'endTime' && formValues.startTime) {
      const st = formValues.startTime;
      return HOURS.filter((h) => h > st.hour || (h === st.hour && st.minute < 59));
    }
    if (pickerMode === 'startTime' && formValues.endTime) {
      const et = formValues.endTime;
      return HOURS.filter((h) => h < et.hour || (h === et.hour && et.minute > 0));
    }
    return HOURS;
  })();

  const availableMinutes = (() => {
    if (pickerMode === 'endTime' && formValues.startTime && tempHour === formValues.startTime.hour) {
      return MINUTES.filter((m) => m > formValues.startTime!.minute);
    }
    if (pickerMode === 'startTime' && formValues.endTime && tempHour === formValues.endTime.hour) {
      return MINUTES.filter((m) => m < formValues.endTime!.minute);
    }
    return MINUTES;
  })();

  const handleConfirm = (): void => {
    if (pickerMode === 'date') {
      const nextDate = {
        year: selectedYear,
        month: selectedMonth,
        day: selectedDay,
      };

      setFormValues((prev) => ({
        ...prev,
        date: nextDate,
      }));

      setPickerMode(null);
      return;
    }

    if (pickerMode === 'startTime' || pickerMode === 'endTime') {
      setFormValues((prev) => ({
        ...prev,
        [pickerMode]: {
          hour: tempHour,
          minute: tempMinute,
        },
      }));
    }

    setPickerMode(null);
  };

  const dateLabel = formValues.date
    ? `${formValues.date.year}-${pad(formValues.date.month)}-${pad(formValues.date.day)}`
    : '날짜';

  const timeLabel = (timeValue: TimeValue | null, placeholder: string): string => {
    return timeValue ? `${pad(timeValue.hour)}:${pad(timeValue.minute)}` : placeholder;
  };
  const isSubmitEnabled =
    formValues.title.trim().length > 0 && formValues.date !== null && !isSubmitting;

  const handleSubmit = async (): Promise<void> => {
    if (!formValues.date || !params?.tripId) return;
    if (formValues.title.trim().length > SCHEDULE_TITLE_MAX_LENGTH) {
      ToastAndroid.show('일정명은 10자 이내로 입력해주세요.', ToastAndroid.SHORT);
      return;
    }

    if (formValues.startTime && formValues.endTime) {
      const startMinutes = formValues.startTime.hour * 60 + formValues.startTime.minute;
      const endMinutes = formValues.endTime.hour * 60 + formValues.endTime.minute;
      if (startMinutes >= endMinutes) {
        ToastAndroid.show('시작 시간은 종료 시간보다 앞서야 합니다.', ToastAndroid.SHORT);
        return;
      }
    }
    const tripScheduleId = params.tripScheduleId;
    if (isEditMode && !tripScheduleId) return;

    const scheduleDate = `${formValues.date.year}-${pad(formValues.date.month)}-${pad(formValues.date.day)}`;
    const startTime = formValues.startTime
      ? `${pad(formValues.startTime.hour)}:${pad(formValues.startTime.minute)}`
      : undefined;
    const endTime = formValues.endTime
      ? `${pad(formValues.endTime.hour)}:${pad(formValues.endTime.minute)}`
      : undefined;

    setIsSubmitting(true);
    let error = null;
    if (isEditMode && tripScheduleId) {
      const result = await updateTripSchedule({
        tripId: params.tripId,
        tripScheduleId,
        payload: {
          title: formValues.title.trim(),
          scheduleDate,
          startTime,
          endTime,
          placeId: params.placeId,
          placeName: params.placeName,
          address: params.address,
          latitude: params.latitude,
          longitude: params.longitude,
          memo: formValues.memo.trim() || undefined,
        },
      });
      error = result.error;
    } else {
      const result = await createSchedule({
        tripId: params.tripId,
        payload: {
          title: formValues.title.trim(),
          scheduleDate,
          startTime,
          endTime,
          placeId: params.placeId,
          placeName: params.placeName,
          address: params.address,
          latitude: params.latitude,
          longitude: params.longitude,
          memo: formValues.memo.trim() || undefined,
        },
      });
      error = result.error;
    }
    setIsSubmitting(false);

    if (error) {
      const errorMessage = isEditMode
        ? getTripScheduleUpdateErrorToastMessage(error)
        : '일정 생성에 실패하였습니다.';
      ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
      return;
    }

    handleNavigateToTripDetail();
  };

  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <TopBar title={isEditMode ? '일정 편집' : '일정 추가'} onPress={() => navigation.goBack()} />

      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled">
        <View className="mt-6 w-full self-center rounded-[8px] border border-borderGray bg-white px-6 py-6">
          <View>
            <View className="mb-2 flex-row items-center">
              <Text className="font-pretendardSemiBold text-h3 text-black">일정명</Text>
              <Text className="ml-[2px] text-h3 text-statusError">*</Text>
            </View>
            <TextInput
              value={formValues.title}
              onChangeText={(value) => handleChangeText('title', value)}
              placeholder="일정명"
              placeholderTextColor={COLORS.gray}
              className="h-[46px] w-full rounded-[12px] border border-borderGray bg-screenBackground px-4 text-h3 text-black"
              maxLength={SCHEDULE_TITLE_MAX_LENGTH}
            />
          </View>

          <View className="mt-4">
            <View className="mb-2 flex-row items-center">
              <Text className="font-pretendardSemiBold text-h3 text-black">날짜</Text>
              <Text className="ml-[2px] text-h3 text-statusError">*</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={openDatePicker}
              className="h-[46px] w-full flex-row items-center justify-between rounded-[12px] border border-borderGray bg-screenBackground px-4">
              <Text className={`text-h3 ${formValues.date ? 'text-black' : 'text-gray'}`}>
                {dateLabel}
              </Text>
              <Text style={{ fontSize: 12, color: COLORS.gray }}>▼</Text>
            </TouchableOpacity>
          </View>

          <View className="mt-4">
            <Text className="mb-2 font-pretendardSemiBold text-h3 text-black">시간</Text>
            <View className="flex-row gap-2">
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => openTimePicker('startTime')}
                className="h-[46px] flex-1 flex-row items-center justify-between rounded-[12px] border border-borderGray bg-screenBackground px-4">
                <Text className={`text-h3 ${formValues.startTime ? 'text-black' : 'text-gray'}`}>
                  {timeLabel(formValues.startTime, '시작 시간')}
                </Text>
                <Text style={{ fontSize: 12, color: COLORS.gray }}>▼</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => openTimePicker('endTime')}
                className="h-[46px] flex-1 flex-row items-center justify-between rounded-[12px] border border-borderGray bg-screenBackground px-4">
                <Text className={`text-h3 ${formValues.endTime ? 'text-black' : 'text-gray'}`}>
                  {timeLabel(formValues.endTime, '종료 시간')}
                </Text>
                <Text style={{ fontSize: 12, color: COLORS.gray }}>▼</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="mt-4">
            <Text className="mb-2 font-pretendardSemiBold text-h3 text-black">장소</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleNavigateToAddCalendarMap}
              className="h-[46px] w-full justify-center rounded-[12px] border border-borderGray bg-screenBackground px-4">
              <Text className="text-h3 text-gray">
                {formValues.location || '장소를 입력해주세요'}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mb-[14px] mt-4">
            <Text className="mb-2 font-pretendardSemiBold text-h3 text-black">메모</Text>
            <TextInput
              value={formValues.memo}
              onChangeText={(value) => handleChangeText('memo', value)}
              placeholder="메모를 입력해주세요"
              placeholderTextColor={COLORS.gray}
              multiline
              textAlignVertical="top"
              className="h-[128px] w-full rounded-[12px] border border-borderGray bg-screenBackground px-4 py-3 text-h3 text-black"
              maxLength={100}
            />
          </View>
        </View>

        <View className="mt-6 items-center">
          <TouchableOpacity
            disabled={!isSubmitEnabled}
            onPress={() => {
              void handleSubmit();
            }}
            activeOpacity={0.8}
            className="h-[44px] w-full items-center justify-center rounded-[8px]"
            style={{ backgroundColor: isSubmitEnabled ? COLORS.main : COLORS.buttonDisabledOverlay }}>
            <Text className="font-pretendardSemiBold text-h3 text-white">
              {isEditMode ? '수정하기' : '등록하기'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={pickerMode !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setPickerMode(null)}
        statusBarTranslucent>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <Pressable
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}
            onPress={() => setPickerMode(null)}
          />

          <View className="rounded-t-[16px] bg-white px-6 pb-10 pt-4">
            <View className="mb-4 flex-row items-center justify-between">
              <TouchableOpacity onPress={() => setPickerMode(null)}>
                <Text className="text-p1 text-gray">취소</Text>
              </TouchableOpacity>

              <Text className="font-pretendardSemiBold text-h3 text-black">
                {pickerMode === 'date' ? '날짜 선택' : '시간 선택'}
              </Text>

              <TouchableOpacity onPress={handleConfirm}>
                <Text className="font-pretendardSemiBold text-p1 text-main">완료</Text>
              </TouchableOpacity>
            </View>

            {pickerMode === 'date' ? (
              <View style={{ flexDirection: 'row', height: ITEM_HEIGHT * VISIBLE_ITEMS }}>
                <SpinnerColumn
                  items={availableYears}
                  selectedIndex={availableYears.indexOf(selectedYear)}
                  onSelect={(index) => setTempYear(availableYears[index])}
                  format={(n) => `${n}년`}
                />
                <SpinnerColumn
                  items={availableMonths}
                  selectedIndex={availableMonths.indexOf(selectedMonth)}
                  onSelect={(index) => setTempMonth(availableMonths[index])}
                  format={(n) => `${pad(n)}월`}
                />
                <SpinnerColumn
                  items={availableDays}
                  selectedIndex={Math.min(
                    availableDays.indexOf(selectedDay) >= 0
                      ? availableDays.indexOf(selectedDay)
                      : 0,
                    availableDays.length - 1,
                  )}
                  onSelect={(index) => setTempDay(availableDays[index])}
                  format={(n) => `${pad(n)}일`}
                />
              </View>
            ) : null}

            {pickerMode === 'startTime' || pickerMode === 'endTime' ? (
              <View style={{ flexDirection: 'row', height: ITEM_HEIGHT * VISIBLE_ITEMS }}>
                <SpinnerColumn
                  items={availableHours}
                  selectedIndex={Math.max(0, availableHours.indexOf(tempHour))}
                  onSelect={(index) => {
                    const newHour = availableHours[index];
                    setTempHour(newHour);
                    if (pickerMode === 'endTime' && formValues.startTime && newHour === formValues.startTime.hour) {
                      if (tempMinute <= formValues.startTime.minute) {
                        setTempMinute(formValues.startTime.minute + 1);
                      }
                    } else if (pickerMode === 'startTime' && formValues.endTime && newHour === formValues.endTime.hour) {
                      if (tempMinute >= formValues.endTime.minute) {
                        setTempMinute(formValues.endTime.minute - 1);
                      }
                    }
                  }}
                  format={(n) => `${pad(n)}시`}
                />
                <SpinnerColumn
                  items={availableMinutes}
                  selectedIndex={Math.max(0, availableMinutes.indexOf(tempMinute))}
                  onSelect={(index) => setTempMinute(availableMinutes[index])}
                  format={(n) => `${pad(n)}분`}
                />
              </View>
            ) : null}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

AddScheduleScreen.displayName = 'AddScheduleScreen';

export default AddScheduleScreen;
export { AddScheduleScreen };
