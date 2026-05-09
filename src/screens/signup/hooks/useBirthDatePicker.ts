import { useState, useCallback } from 'react';
import { CURRENT_YEAR, getDaysInMonth, pad } from '../constants';

export const useBirthDatePicker = () => {
  const [isBirthDatePickerVisible, setIsBirthDatePickerVisible] = useState<boolean>(false);
  const [tempYear, setTempYear] = useState<number>(new Date().getFullYear());
  const [tempMonth, setTempMonth] = useState<number>(new Date().getMonth() + 1);
  const [tempDay, setTempDay] = useState<number>(new Date().getDate());

  const openBirthDatePicker = useCallback((birthDate: string) => {
    const parsed = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthDate.trim());
    const now = new Date();

    if (parsed) {
      const parsedYear = Math.min(Number(parsed[1]), CURRENT_YEAR);
      const parsedMonth = Number(parsed[2]);
      const parsedDay = Number(parsed[3]);

      setTempYear(parsedYear);
      setTempMonth(parsedMonth);
      setTempDay(Math.min(parsedDay, getDaysInMonth(parsedYear, parsedMonth)));
    } else {
      setTempYear(now.getFullYear());
      setTempMonth(now.getMonth() + 1);
      setTempDay(now.getDate());
    }

    setIsBirthDatePickerVisible(true);
  }, []);

  const handleConfirmBirthDate = useCallback((): string => {
    const clampedDay = Math.min(tempDay, getDaysInMonth(tempYear, tempMonth));
    const nextBirthDate = `${tempYear}-${pad(tempMonth)}-${pad(clampedDay)}`;
    setIsBirthDatePickerVisible(false);
    return nextBirthDate;
  }, [tempDay, tempMonth, tempYear]);

  const closeBirthDatePicker = useCallback(() => {
    setIsBirthDatePickerVisible(false);
  }, []);

  return {
    isBirthDatePickerVisible,
    tempYear,
    tempMonth,
    tempDay,
    setTempYear,
    setTempMonth,
    setTempDay,
    openBirthDatePicker,
    handleConfirmBirthDate,
    closeBirthDatePicker,
  };
};
