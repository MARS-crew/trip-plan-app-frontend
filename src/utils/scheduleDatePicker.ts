export interface DateValue {
  year: number;
  month: number;
  day: number;
}

interface DatePickerOptions {
  years: number[];
  months: number[];
  days: number[];
  selectedYear: number;
  selectedMonth: number;
  selectedDay: number;
}

type ValidDateRange = { start: DateValue; end: DateValue } | null;

const DEFAULT_YEARS = Array.from({ length: 10 }, (_, i) => 2024 + i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

export const padDatePart = (n: number): string => String(n).padStart(2, '0');

export const parseDateValue = (date?: string): DateValue | null => {
  if (!date) return null;
  const [year, month, day] = date.split('-').map(Number);
  if (!year || !month || !day) return null;
  return { year, month, day };
};

export const formatDateValue = ({ year, month, day }: DateValue): string =>
  `${year}-${padDatePart(month)}-${padDatePart(day)}`;

export const getDateValueFromDate = (date: Date): DateValue => ({
  year: date.getFullYear(),
  month: date.getMonth() + 1,
  day: date.getDate(),
});

const toDate = ({ year, month, day }: DateValue): Date => new Date(year, month - 1, day);

const getDaysInMonth = (year: number, month: number): number => new Date(year, month, 0).getDate();

const getValidRange = (startDate: DateValue | null, endDate: DateValue | null): ValidDateRange => {
  if (!startDate || !endDate) return null;
  return toDate(startDate).getTime() <= toDate(endDate).getTime()
    ? { start: startDate, end: endDate }
    : null;
};

const isDateInRange = (date: DateValue, range: Exclude<ValidDateRange, null>): boolean => {
  const value = toDate(date).getTime();
  return value >= toDate(range.start).getTime() && value <= toDate(range.end).getTime();
};

const getYears = (range: ValidDateRange): number[] => {
  if (!range) return DEFAULT_YEARS;
  return Array.from(
    { length: range.end.year - range.start.year + 1 },
    (_, i) => range.start.year + i,
  );
};

const overlapsTripRange = (year: number, month: number, range: ValidDateRange): boolean => {
  if (!range) return true;

  const monthStart = new Date(year, month - 1, 1).getTime();
  const monthEnd = new Date(year, month, 0).getTime();
  return monthEnd >= toDate(range.start).getTime() && monthStart <= toDate(range.end).getTime();
};

export const getScheduleDatePickerOptions = (
  selectedDate: DateValue,
  startDate: DateValue | null,
  endDate: DateValue | null,
): DatePickerOptions => {
  const range = getValidRange(startDate, endDate);
  const years = getYears(range);
  const selectedYear = years.includes(selectedDate.year) ? selectedDate.year : years[0];

  const months = MONTHS.filter((month) => overlapsTripRange(selectedYear, month, range));
  const selectedMonth = months.includes(selectedDate.month) ? selectedDate.month : months[0];

  const monthDays = Array.from(
    { length: getDaysInMonth(selectedYear, selectedMonth) },
    (_, i) => i + 1,
  );
  const days = range
    ? monthDays.filter((day) =>
        isDateInRange({ year: selectedYear, month: selectedMonth, day }, range),
      )
    : monthDays;
  const selectedDay = days.includes(selectedDate.day) ? selectedDate.day : days[0];

  return { years, months, days, selectedYear, selectedMonth, selectedDay };
};
