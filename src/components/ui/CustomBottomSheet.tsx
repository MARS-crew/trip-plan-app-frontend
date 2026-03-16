import React from "react";
import { View, Dimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";
import { styled } from "nativewind";

export interface CustomBottomSheetProps {
  children: React.ReactNode;
  onStateChange?: (isExpanded: boolean) => void; // ✅ 이름 확인
}

const AnimatedView = styled(Animated.View);
const SCREEN_HEIGHT = Dimensions.get("window").height;
const VISIBLE_HEIGHT = 70;

export function CustomBottomSheet({ children, onStateChange }: CustomBottomSheetProps) {
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

      if (onStateChange) {
        // 조금이라도 올라오면 true 전달
        runOnJS(onStateChange)(translateY.value < MAX_Y);
      }
    })
    .onEnd(() => {
      // 멈춘 자리 그대로 유지 (애니메이션 없음)
      if (onStateChange) {
        runOnJS(onStateChange)(translateY.value < MAX_Y);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <AnimatedView
      className="absolute bottom-0 h-full w-full bg-white rounded-t-[16px] overflow-hidden"
      style={animatedStyle}
    >
      <GestureDetector gesture={gesture}>
        <View className="w-full items-center py-[20px] bg-white">
          <View className="w-10 h-1 bg-botoomSheetBackground rounded-full" />
        </View>
      </GestureDetector>
      <View className="flex-1">{children}</View>
    </AnimatedView>
  );
}

export default CustomBottomSheet;