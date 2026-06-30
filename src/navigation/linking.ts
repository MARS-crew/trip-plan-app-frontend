import type { LinkingOptions } from '@react-navigation/native';
import Config from 'react-native-config';

import type { RootStackParamList } from './types';

const normalizeHttpsPrefix = (value?: string): string | null => {
  const trimmedValue = value?.trim().replace(/\/+$/g, '');
  if (!trimmedValue) return null;

  return /^https?:\/\//i.test(trimmedValue) ? trimmedValue : `https://${trimmedValue}`;
};

const chottuLinkPrefix = normalizeHttpsPrefix(Config.CHOTTU_LINK_BASE_URL);

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['com.trip_plan://', ...(chottuLinkPrefix ? [chottuLinkPrefix] : [])],
  config: {
    screens: {
      TripShare: {
        path: 'trip-share/:tripId',
        parse: {
          tripId: Number,
        },
      },
    },
  },
};
