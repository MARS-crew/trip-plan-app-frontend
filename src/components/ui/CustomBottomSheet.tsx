import React from "react";
import { View, Dimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  SharedValue
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const VISIBLE_HEIGHT = 70;
const MIN_Y = 70;
const MAX_Y = SCREEN_HEIGHT - VISIBLE_HEIGHT;


interface CustomBottomSheetProps {
  children: React.ReactNode;
  onStateChange?: (isExpanded: boolean) => void;
  translateY: SharedValue<number>;
}

export const CustomBottomSheet = ({
  children,
  onStateChange,
  translateY,
}: CustomBottomSheetProps) => {


  const startY = useSharedValue(0);


  const gesture = Gesture.Pan()
    .onStart(() => {
      startY.value = translateY.value;
    })
    .onUpdate((e) => {
      const nextY = startY.value + e.translationY;
      translateY.value = Math.max(MIN_Y, Math.min(MAX_Y, nextY));

      // ❌ 여기서 runOnJS(onStateChange) 호출을 지우세요. 
      // 초당 수십 번 호출되면서 성능을 갉아먹습니다.
    })
    .onEnd((e) => {
      // 손을 뗐을 때 최종 상태만 한 번 전달
      const isExpanded = translateY.value < MAX_Y - 50;
      if (onStateChange) {
        runOnJS(onStateChange)(isExpanded);
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