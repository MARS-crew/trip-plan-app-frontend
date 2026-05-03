import React from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import TripDetailCard from '@/components/ui/TripDetailCard';
import { KebabEditIcon, KebabMapIcon, KebabTrashIcon } from '@/assets/icons';
import type { CardContextMenuProps } from '@/types/tripDetail.types';

const CardContextMenu = ({
  card,
  opacity,
  topOffset,
  accentColor,
  onPressRoute,
  onPressDelete,
  onClose,
}: CardContextMenuProps) => {
  const backdropStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  const menuStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <>
      <Animated.View
        pointerEvents="auto"
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          },
          backdropStyle,
        ]}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      <Animated.View
        pointerEvents="box-none"
        className="absolute left-0 right-0 z-50 px-4 items-center"
        style={[menuStyle, { top: topOffset }]}>
        <View className="w-full">
          <TripDetailCard
            {...card}
            accentColor={accentColor}
            onPressAction={() => {}}
            onPressCard={onClose}
          />

          <View className="mt-3 rounded-[8px] bg-white px-4 py-4">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onClose}
              className="flex-row items-center px-2 py-3">
              <View className="mr-3 h-[32px] w-[32px] items-center justify-center rounded-[8px] bg-chip">
                <KebabEditIcon />
              </View>
              <Text className="text-h3 font-pretendardSemiBold text-black">편집</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onPressRoute(card)}
              className="flex-row items-center px-2 py-3">
              <View className="mr-3 h-[32px] w-[32px] items-center justify-center rounded-[8px] bg-chip">
                <KebabMapIcon />
              </View>
              <Text className="text-h3 font-pretendardSemiBold text-black">길찾기</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onPressDelete(card)}
              className="flex-row items-center px-2 py-3">
              <View className="mr-3 h-[32px] w-[32px] items-center justify-center rounded-[8px] bg-chip">
                <KebabTrashIcon />
              </View>
              <Text className="text-h3 font-pretendardSemiBold text-black">삭제</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </>
  );
};

export default CardContextMenu;
