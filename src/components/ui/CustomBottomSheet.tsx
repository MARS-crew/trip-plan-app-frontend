import React from "react";
import { View, Dimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";


const SCREEN_HEIGHT = Dimensions.get("window").height;
const VISIBLE_HEIGHT = 70;
const MIN_Y = 70;
const MAX_Y = SCREEN_HEIGHT - VISIBLE_HEIGHT;


interface CustomBottomSheetProps {
  children: React.ReactNode;
  onStateChange?: (isExpanded: boolean) => void;
}

export const CustomBottomSheet = ({
  children,
  onStateChange,
}: CustomBottomSheetProps) => {

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
        runOnJS(onStateChange)(translateY.value < MAX_Y);
      }
    })
    .onEnd(() => {
      if (onStateChange) {
        runOnJS(onStateChange)(translateY.value < MAX_Y);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      className="absolute bottom-0 w-full h-full bg-white rounded-t-[16px] overflow-hidden"
      style={animatedStyle}
    >
      <GestureDetector gesture={gesture}>
        <View className="items-center w-full py-[20px] bg-white">
          <View className="w-10 h-1 bg-botoomSheetBackground rounded-full" />
        </View>
      </GestureDetector>
      <View className="flex-1">{children}</View>
    </Animated.View>
  );
};
CustomBottomSheet.displayName = 'CustomBottomSheet';
export default CustomBottomSheet;