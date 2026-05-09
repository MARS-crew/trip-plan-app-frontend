import { useState, useRef, useCallback } from 'react';
import { View, useWindowDimensions } from 'react-native';
import type { CountryDropdownLayout } from '@/types/signup';
import { COUNTRY_PICKER_MAX_HEIGHT } from '../constants';

export const useCountryPicker = () => {
  const [showCountryPicker, setShowCountryPicker] = useState<boolean>(false);
  const [countryDropdownLayout, setCountryDropdownLayout] = useState<CountryDropdownLayout>({
    left: 16,
    top: 0,
    width: 0,
    maxHeight: COUNTRY_PICKER_MAX_HEIGHT,
  });
  const countryTriggerRef = useRef<View | null>(null);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const openCountryPicker = useCallback(() => {
    countryTriggerRef.current?.measureInWindow((x, y, width, height) => {
      const horizontalMargin = 16;
      const left = Math.max(horizontalMargin, Math.min(x, windowWidth - horizontalMargin - width));
      const top = y + height + 7;
      const availableHeight = Math.max(140, windowHeight - top - 16);

      setCountryDropdownLayout({
        left,
        top,
        width,
        maxHeight: Math.min(COUNTRY_PICKER_MAX_HEIGHT, availableHeight),
      });
      setShowCountryPicker(true);
    });
  }, [windowHeight, windowWidth]);

  const handleToggleCountryPicker = useCallback(() => {
    if (showCountryPicker) {
      setShowCountryPicker(false);
      return;
    }

    requestAnimationFrame(() => {
      openCountryPicker();
    });
  }, [openCountryPicker, showCountryPicker]);

  const handleCountrySelect = useCallback((country: string) => {
    setShowCountryPicker(false);
    return country;
  }, []);

  return {
    showCountryPicker,
    countryDropdownLayout,
    countryTriggerRef,
    setShowCountryPicker,
    openCountryPicker,
    handleToggleCountryPicker,
    handleCountrySelect,
  };
};
