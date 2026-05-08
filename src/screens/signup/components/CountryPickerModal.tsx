import React, { useCallback } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { COUNTRIES, COUNTRY_PICKER_MAX_HEIGHT } from '../constants';

interface CountryPickerModalProps {
  visible: boolean;
  selectedCountry: string;
  layout: {
    left: number;
    top: number;
    width: number;
    maxHeight: number;
  };
  onSelectCountry: (country: string) => void;
  onDismiss: () => void;
}

export const CountryPickerModal: React.FC<CountryPickerModalProps> = ({
  visible,
  selectedCountry,
  layout,
  onSelectCountry,
  onDismiss,
}) => {
  const handleSelect = useCallback(
    (country: string) => {
      onSelectCountry(country);
    },
    [onSelectCountry],
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <View className="flex-1">
        <Pressable className="absolute inset-0" onPress={onDismiss} />

        <View pointerEvents="box-none" className="absolute inset-0">
          <View
            className="rounded-xl border border-borderGray bg-white"
            style={{
              position: 'absolute',
              left: layout.left,
              top: layout.top,
              width: layout.width,
              maxHeight: layout.maxHeight,
            }}>
            <ScrollView showsVerticalScrollIndicator scrollEnabled={true} contentContainerStyle={{ paddingVertical: 6 }}>
              {COUNTRIES.map((country, index) => {
                const isSelectedCountry = selectedCountry === country;
                const isLastItem = index === COUNTRIES.length - 1;
                const countryItemClassName = [
                  'mx-[6px] rounded-lg px-3 py-[9px]',
                  isLastItem ? '' : 'mb-1',
                  isSelectedCountry ? 'bg-statusSuccess' : 'bg-white',
                ]
                  .filter(Boolean)
                  .join(' ');

                return (
                  <Pressable
                    key={country}
                    onPress={() => handleSelect(country)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelectedCountry }}
                    className={countryItemClassName}>
                    <Text className={`text-p ${isSelectedCountry ? 'text-white' : 'text-black'}`}>
                      {country}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

CountryPickerModal.displayName = 'CountryPickerModal';
