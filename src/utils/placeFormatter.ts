export const formatOpeningHours = (openingHours: string): string =>
  openingHours
    .split('|')
    .map((part) => part.trim())
    .filter(Boolean)
    .join('\n');
