import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
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

const pad = (n: number) => String(n).padStart(2, '0');
const getDaysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();
const parseTimeToValue = (time?: string): TimeValue | null => {
  if (!time) return null;
  const [hourString, minuteString] = time.split(':');
  const hour = Number(hourString);
  const minute = Number(minuteString);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
  return { hour, minute };
};

interface SpinnerColumnProps {
  items: number[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  format?: (n: number) => string;
}

const SpinnerColumn: React.FC<SpinnerColumnProps> = ({
  items,
  selectedIndex,
  onSelect,
  format = (n) => String(n),
}) => {
  const scrollRef = useRef<ScrollView>(null);

  const handleScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = e.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / ITEM_HEIGHT);
      const clamped = Math.max(0, Math.min(index, items.length - 1));
      onSelect(clamped);
      scrollRef.current?.scrollTo({ y: clamped * ITEM_HEIGHT, animated: true });
    },
    [items.length, onSelect],
  );

  return (
    <View style={{ flex: 1, height: ITEM_HEIGHT * VISIBLE_ITEMS }}>
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: ITEM_HEIGHT * 2,
          left: 8,
          right: 8,
          height: 1,
          backgroundColor: COLORS.main,
          zIndex: 1,
        }}
      />
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: ITEM_HEIGHT * 3,
          left: 8,
          right: 8,
          height: 1,
          backgroundColor: COLORS.inputBackground,
          zIndex: 1,
        }}
      />
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        contentOffset={{ x: 0, y: selectedIndex * ITEM_HEIGHT }}
        contentContainerStyle={{
          paddingTop: ITEM_HEIGHT * 2,
          paddingBottom: ITEM_HEIGHT * 2,
        }}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
      >
        {items.map((item, idx) => {
          const isSelected = idx === selectedIndex;

          return (
            <View
              key={item}
              style={{
                height: ITEM_HEIGHT,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: isSelected ? '600' : '400',
                  color: isSelected ? COLORS.black : COLORS.gray
                }}
              >
                {format(item)}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
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

  const handleNavigateToTripDetail = () => {
    if (isEditMode) {
      navigation.goBack();
      return;
    }

    if (params?.tripId) {
      navigation.navigate('TripDetail', { tripId: params.tripId });
    } else {
      navigation.navigate('TripDetail');
    }
  };
  const handleNavigateToAddCalendarMap = () => {
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

  const openDatePicker = () => {
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

  const openTimePicker = (mode: 'startTime' | 'endTime') => {
    const currentTime = formValues[mode];
    setTempHour(currentTime?.hour ?? 9);
    setTempMinute(currentTime?.minute ?? 0);
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

  const handleConfirm = () => {
    if (pickerMode === 'date') {
      setFormValues((prev) => ({
        ...prev,
        date: {
          year: selectedYear,
          month: selectedMonth,
          day: selectedDay,
        },
      }));
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

  const timeLabel = (timeValue: TimeValue | null, placeholder: string) => {
    return timeValue ? `${pad(timeValue.hour)}:${pad(timeValue.minute)}` : placeholder;
  };
  const isSubmitEnabled = formValues.title.trim().length > 0 && formValues.date !== null && !isSubmitting;

  const handleSubmit = async (): Promise<void> => {
    if (!formValues.date || !params?.tripId) return;
    if (formValues.title.trim().length > SCHEDULE_TITLE_MAX_LENGTH) {
      ToastAndroid.show('일정명은 10자 이내로 입력해주세요.', ToastAndroid.SHORT);
      return;
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
        keyboardShouldPersistTaps="handled"
      >
        <View className="mt-6 self-center w-full rounded-[8px] border border-borderGray bg-white px-6 py-6">
          <View>
            <View className="mb-2 flex-row items-center">
              <Text className="text-h3 font-pretendardSemiBold text-black">일정명</Text>
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
              <Text className="text-h3 font-pretendardSemiBold text-black">날짜</Text>
              <Text className="ml-[2px] text-h3 text-statusError">*</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={openDatePicker}
              className="h-[46px] w-full flex-row items-center justify-between rounded-[12px] border border-borderGray bg-screenBackground px-4"
            >
              <Text className={`text-h3 ${formValues.date ? 'text-black' : 'text-gray'}`}>
                {dateLabel}
              </Text>
              <Text style={{ fontSize: 12, color: COLORS.gray }}>▼</Text>
            </TouchableOpacity>
          </View>

          <View className="mt-4">
            <Text className="mb-2 text-h3 font-pretendardSemiBold text-black">시간</Text>
            <View className="flex-row gap-2">
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => openTimePicker('startTime')}
                className="h-[46px] flex-1 flex-row items-center justify-between rounded-[12px] border border-borderGray bg-screenBackground px-4"
              >
                <Text className={`text-h3 ${formValues.startTime ? 'text-black' : 'text-gray'}`}>
                  {timeLabel(formValues.startTime, '시작 시간')}
                </Text>
                <Text style={{ fontSize: 12, color: COLORS.gray }}>▼</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => openTimePicker('endTime')}
                className="h-[46px] flex-1 flex-row items-center justify-between rounded-[12px] border border-borderGray bg-screenBackground px-4"
              >
                <Text className={`text-h3 ${formValues.endTime ? 'text-black' : 'text-gray'}`}>
                  {timeLabel(formValues.endTime, '종료 시간')}
                </Text>
                <Text style={{ fontSize: 12, color: COLORS.gray }}>▼</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="mt-4">
            <Text className="mb-2 text-h3 font-pretendardSemiBold text-black">장소</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleNavigateToAddCalendarMap}
              className="h-[46px] w-full justify-center rounded-[12px] border border-borderGray bg-screenBackground px-4"
            >
              <Text className='text-h3 text-gray'>
                {formValues.location || '장소를 입력해주세요'}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-4 mb-[14px]">
            <Text className="mb-2 text-h3 font-pretendardSemiBold text-black">메모</Text>
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
            onPress={() => { void handleSubmit(); }}
            activeOpacity={0.8}
            className="h-[44px] w-full items-center justify-center rounded-[8px]"
            style={{ backgroundColor: isSubmitEnabled ? COLORS.main : '#DF6C2080' }}
          >
            <Text className="text-h3 font-pretendardSemiBold text-white">
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
        statusBarTranslucent
      >
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

              <Text className="text-h3 font-pretendardSemiBold text-black">
                {pickerMode === 'date' ? '날짜 선택' : '시간 선택'}
              </Text>

              <TouchableOpacity onPress={handleConfirm}>
                <Text className="text-p1 font-pretendardSemiBold text-main">완료</Text>
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
                    availableDays.indexOf(selectedDay) >= 0 ? availableDays.indexOf(selectedDay) : 0,
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
                  items={HOURS}
                  selectedIndex={HOURS.indexOf(tempHour)}
                  onSelect={(index) => setTempHour(HOURS[index])}
                  format={(n) => `${pad(n)}시`}
                />
                <SpinnerColumn
                  items={MINUTES}
                  selectedIndex={MINUTES.indexOf(tempMinute)}
                  onSelect={(index) => setTempMinute(MINUTES[index])}
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
