import React from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { KebabEditIcon, KebabCalIcon, KebabShareIcon, KebabTrashIcon } from '@/assets/icons';
import type { KebabMenuSheetProps } from '@/types/tripDetail.types';

export const KEBAB_SHEET_HEIGHT = 257;

const KebabMenuSheet = ({ isVisible, translateY, onClose, onPressShare, onPressDelete }: KebabMenuSheetProps) => {
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.value, [0, KEBAB_SHEET_HEIGHT], [1, 0]),
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!isVisible) return null;

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
        className="absolute bottom-0 left-0 right-0 z-50"
        style={sheetStyle}>
        <View className="w-full rounded-t-[12px] bg-white px-4 py-4">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onClose}
            className="h-14 w-full flex-row items-center px-4">
            <View className="mr-3">
              <KebabEditIcon />
            </View>
            <Text className="text-h3 font-pretendardSemiBold text-black">제목 변경</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onClose}
            className="h-14 w-full flex-row items-center px-4">
            <View className="mr-3">
              <KebabCalIcon />
            </View>
            <Text className="text-h3 font-pretendardSemiBold text-black">날짜 변경</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPressShare ?? onClose}
            className="h-14 w-full flex-row items-center px-4">
            <View className="mr-3">
              <KebabShareIcon />
            </View>
            <Text className="text-h3 font-pretendardSemiBold text-black">공유</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPressDelete ?? onClose}
            className="h-14 w-full flex-row items-center px-4">
            <View className="mr-3">
              <KebabTrashIcon />
            </View>
            <Text className="text-h3 font-pretendardSemiBold text-black">삭제</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
};

export default KebabMenuSheet;
