import React from "react";
import { View, Dimensions } from "react-native";
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
  const MIN_Y = 0;
  const MAX_Y = SCREEN_HEIGHT - VISIBLE_HEIGHT;

  const translateY = useSharedValue(MAX_Y);
  const startY = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onStart(() => {
      startY.value = translateY.value;
    })
    .onUpdate((e) => {
      const nextY = startY.value + e.translationY;

      translateY.value = Math.max(
        MIN_Y,
        Math.min(MAX_Y, nextY)
      );
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <AnimatedView
        className="absolute bottom-0 h-full w-full bg-white rounded-t-[16px]"
        style={animatedStyle}
      >
       <View className="w-full items-center py-[14px]">
        <View className=" items-center w-10 h-1 bg-botoomSheetBackground rounded-full"/>
        </View>
        <View className="w-10 h-[5px] bg-gray-300 self-center my-2 rounded-full" />
        {children}
      </AnimatedView>
    </GestureDetector>
  );
}
CustomBottomSheet.displayName = "CustomBottomSheet";
export default CustomBottomSheet;

