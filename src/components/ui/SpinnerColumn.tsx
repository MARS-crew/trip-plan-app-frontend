import React, { useCallback, useEffect, useRef } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, Text, View } from 'react-native';

import { COLORS } from '@/constants/colors';

interface SpinnerColumnProps {
  items: number[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  format?: (n: number) => string;
}

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;

const SpinnerColumn: React.FC<SpinnerColumnProps> = ({
  items,
  selectedIndex,
  onSelect,
  format = (n) => String(n),
}) => {
  const scrollRef = useRef<ScrollView>(null);
  const normalizedSelectedIndex = Math.max(0, Math.min(selectedIndex, items.length - 1));

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollRef.current?.scrollTo({
        y: normalizedSelectedIndex * ITEM_HEIGHT,
        animated: false,
      });
    }, 0);

    return () => clearTimeout(timer);
  }, [items.length, normalizedSelectedIndex]);

  const handleScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!items.length) return;
      const offsetY = e.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / ITEM_HEIGHT);
      const clamped = Math.max(0, Math.min(index, items.length - 1));
      onSelect(clamped);
      scrollRef.current?.scrollTo({ y: clamped * ITEM_HEIGHT, animated: true });
    },
    [items.length, onSelect],
  );

  return (
    <View style={{ flex: 1, height: ITEM_HEIGHT * VISIBLE_ITEMS }}>
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: ITEM_HEIGHT * 2,
          left: 8,
          right: 8,
          height: 1,
          backgroundColor: COLORS.main,
          zIndex: 1,
        }}
      />
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: ITEM_HEIGHT * 3,
          left: 8,
          right: 8,
          height: 1,
          backgroundColor: COLORS.inputBackground,
          zIndex: 1,
        }}
      />
      <ScrollView
        ref={scrollRef}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        contentOffset={{ x: 0, y: normalizedSelectedIndex * ITEM_HEIGHT }}
        contentContainerStyle={{
          paddingTop: ITEM_HEIGHT * 2,
          paddingBottom: ITEM_HEIGHT * 2,
        }}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}>
        {items.map((item, idx) => {
          const isSelected = idx === normalizedSelectedIndex;

          return (
            <View
              key={item}
              style={{
                height: ITEM_HEIGHT,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: isSelected ? '600' : '400',
                  color: isSelected ? COLORS.black : COLORS.gray,
                }}>
                {format(item)}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

SpinnerColumn.displayName = 'SpinnerColumn';

export default SpinnerColumn;
