import { useState, useRef, useCallback, useEffect } from 'react';
import { Keyboard, View, useWindowDimensions } from 'react-native';
import type { CountryDropdownLayout } from '@/types/signup';
import { COUNTRY_PICKER_MAX_HEIGHT } from '../constants';

const KEYBOARD_DISMISS_FALLBACK_MS = 300;

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

  const pendingOpenRef = useRef<{
    fallbackTimeoutId: ReturnType<typeof setTimeout>;
    hideSubscription: { remove: () => void };
  } | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (pendingOpenRef.current) {
        clearTimeout(pendingOpenRef.current.fallbackTimeoutId);
        pendingOpenRef.current.hideSubscription.remove();
        pendingOpenRef.current = null;
      }
    };
  }, []);

  const openCountryPicker = useCallback(() => {
    countryTriggerRef.current?.measureInWindow((x, y, width, height) => {
      if (!isMountedRef.current) {
        return;
      }

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

    // Already waiting on a previous toggle (keyboard dismissing) — ignore re-taps.
    if (pendingOpenRef.current) {
      return;
    }

    let settled = false;
    const openOnce = () => {
      if (settled) {
        return;
      }
      settled = true;
      if (pendingOpenRef.current) {
        clearTimeout(pendingOpenRef.current.fallbackTimeoutId);
        pendingOpenRef.current.hideSubscription.remove();
        pendingOpenRef.current = null;
      }
      if (isMountedRef.current) {
        openCountryPicker();
      }
    };

    // Listen for the real native keyboard-hide event instead of trusting
    // Keyboard.isVisible(), which can lag the actual bridge state right
    // after a blur/focus transition. A short fallback timer covers the
    // common case where the keyboard was already closed (no hide event
    // will ever fire); a longer bound covers a dismiss that's slow to
    // report back, so we never get stuck waiting forever either way.
    const hideSubscription = Keyboard.addListener('keyboardDidHide', openOnce);
    const fallbackDelay = Keyboard.isVisible() ? KEYBOARD_DISMISS_FALLBACK_MS : 16;
    const fallbackTimeoutId = setTimeout(openOnce, fallbackDelay);
    pendingOpenRef.current = { fallbackTimeoutId, hideSubscription };

    Keyboard.dismiss();
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
