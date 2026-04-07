import React, { memo } from 'react';
import { ScrollView, View } from 'react-native';
import CustomBottomSheet from '@/components/ui/CustomBottomSheet';
import { CategoryChip } from '@/screens/wishList/components';
import type { WishlistBottomSheetProps } from '@/screens/wishList/types';

const WishlistBottomSheetComponent: React.FC<WishlistBottomSheetProps> = ({
  translateY,
  onStateChange,
  maxTopSnap,
  tabs,
  selectedCategory,
  onSelectCategory,
  onPressComplete,
  renderTabContent,
}) => {
  return (
    <CustomBottomSheet
      translateY={translateY}
      onStateChange={onStateChange}
      maxTopSnap={maxTopSnap}>
      <View className="flex-row items-center justify-between mt-5 px-4">
        <View className="flex-row">
          {tabs.map((tab) => (
            <CategoryChip
              key={tab.id}
              label={tab.label}
              onPress={() => onSelectCategory(tab.id)}
              isSelected={selectedCategory === tab.id}
              className={`mr-2 px-4 py-2 rounded-2xl ${selectedCategory === tab.id ? 'bg-main' : 'bg-chip'}`}
            />
          ))}
        </View>
        <CategoryChip
          label="완료"
          onPress={onPressComplete}
          isSelected={true}
          className="px-4 py-2 bg-main rounded-2xl"
        />
      </View>

      <View className="mx-4 mt-3 flex-1">
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
