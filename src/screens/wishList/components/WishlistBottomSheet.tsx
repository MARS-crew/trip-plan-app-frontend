import React, { memo } from 'react';
import { ScrollView, View } from 'react-native';
import CustomBottomSheet from '@/components/ui/CustomBottomSheet';
import { CategoryChip } from '@/screens/wishList/components';
import type { WishlistBottomSheetProps } from '@/screens/wishList/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const WishlistBottomSheetComponent: React.FC<WishlistBottomSheetProps> = ({
  translateY,
  onStateChange,
  maxTopSnap,
  tabs,
  selectedCategory,
  onSelectCategory,
  onPressComplete,
  renderTabContent,
  sheetHeight,
}) => {
  const insets = useSafeAreaInsets();
  return (
    <CustomBottomSheet
      translateY={translateY}
      onStateChange={onStateChange}
      maxTopSnap={maxTopSnap}
      height={sheetHeight}>
      <View className="mt-5 flex-row items-center justify-between px-4">
        <View className="flex-row">
          {tabs.map((tab) => (
            <CategoryChip
              key={tab.id}
              label={tab.label}
              onPress={() => onSelectCategory(tab.id)}
              isSelected={selectedCategory === tab.id}
              className={`mr-2 rounded-2xl px-4 py-2 ${selectedCategory === tab.id ? 'bg-main' : 'bg-chip'}`}
            />
          ))}
        </View>
        <CategoryChip
          label="완료"
          onPress={onPressComplete}
          isSelected={true}
          className="rounded-2xl bg-main px-4 py-2"
        />
      </View>

      <View className="mx-4 mt-3 flex-1" style={{ paddingBottom: insets.bottom }}>
        <ScrollView
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}>
          {renderTabContent()}
        </ScrollView>
      </View>
    </CustomBottomSheet>
  );
};

WishlistBottomSheetComponent.displayName = 'WishlistBottomSheet';

export const WishlistBottomSheet = memo(WishlistBottomSheetComponent);
