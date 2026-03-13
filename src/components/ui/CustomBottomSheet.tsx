import React from "react";
import { View, Dimensions,Text } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { styled } from "nativewind";

export interface CustomBottomSheetProps {
  children: React.ReactNode;
}

const AnimatedView = styled(Animated.View);

const SCREEN_HEIGHT = Dimensions.get("window").height;
const VISIBLE_HEIGHT = 70;

export function CustomBottomSheet({ children }: CustomBottomSheetProps) {
  const MIN_Y = 70;
  const MAX_Y = SCREEN_HEIGHT - VISIBLE_HEIGHT;

  const translateY = useSharedValue(MAX_Y);
  const startY = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onStart(() => {
      startY.value = translateY.value;
    })
    .onUpdate((e) => {
      const nextY = startY.value + e.translationY;
      translateY.value = Math.max(MIN_Y, Math.min(MAX_Y, nextY));
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <AnimatedView
      className="absolute bottom-0 h-full w-full bg-white rounded-t-[16px] overflow-hidden"
      style={animatedStyle}
    >
      {/* ✨ 1. 이 영역(핸들)을 잡고 끌 때만 바텀시트가 움직입니다. */}
      <GestureDetector gesture={gesture}>
        <View className="w-full items-center py-[20px] bg-white">
          {/* 드래그 핸들 바 아이콘 */}
          <View className="w-10 h-1 bg-botoomSheetBackground rounded-full" />
        </View>
      </GestureDetector>

      {/* ✨ 2. 이 아래는 제스처 영향권 밖이라 내부 스크롤(ScrollView, FlatList)이 작동합니다. */}
      <View className="flex-1">
        {children}
      </View>
    </AnimatedView>
  );
}


CustomBottomSheet.displayName = "CustomBottomSheet";
export default CustomBottomSheet;

