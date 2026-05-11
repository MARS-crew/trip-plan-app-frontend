export const formatAmountWithCommas = (input: string): string => {
  const digitsOnly = input.replace(/\D/g, '');
  if (!digitsOnly) return '';
  const normalized = digitsOnly.replace(/^0+(?=\d)/, '');
  return normalized.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const parseAmount = (formatted: string): number => {
  const digits = formatted.replace(/\D/g, '');
  return digits ? Number(digits) : 0;
};

export const convertCurrency = (amount: number, rate: number): string => {
  const result = Math.round(amount * rate);
  return formatAmountWithCommas(String(result));
};

export const buildRateText = (
  fromCurrency: 'KRW' | 'JPY',
  toCurrency: 'KRW' | 'JPY',
  rate: number,
): string => {
  return `1 ${fromCurrency} = ${rate.toFixed(6)} ${toCurrency}`;
};
