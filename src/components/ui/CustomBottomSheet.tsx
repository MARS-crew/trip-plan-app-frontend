import React from "react";
import { View, Dimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  withTiming,
  Easing,
  runOnJS,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

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

  // 1. 3단계 스냅 포인트 계산 (바닥 기준 높이)
  const SHEET_HEIGHT = 654; // 최대로 올라왔을 때 높이

  const SNAP_MIN = SHEET_HEIGHT - 28;   // 32px만 보이게
  const SNAP_MID = SHEET_HEIGHT - 310;
  const SNAP_HIGH = 0;

  const gesture = Gesture.Pan()
    .onStart(() => {
      startY.value = translateY.value;
    })
    .onUpdate((e) => {
      const nextY = startY.value + e.translationY;
      // 이동 범위 제한 (620 ~ 66 사이에서만 움직임)
      translateY.value = Math.max(SNAP_HIGH, Math.min(SNAP_MIN, nextY));
    })
    .onEnd((e) => {
      const currentY = translateY.value;
      const velocityY = e.velocityY;
      let targetY;

      // 2. 속도가 빠를 때 방향에 따라 스냅
      if (velocityY < -500) {
        // 위로 휙 올릴 때: 현재 위치보다 한 단계 위로
        targetY = currentY > SNAP_MID ? SNAP_MID : SNAP_HIGH;
      } else if (velocityY > 500) {
        // 아래로 휙 내릴 때: 현재 위치보다 한 단계 아래로
        targetY = currentY < SNAP_MID ? SNAP_MID : SNAP_MIN;
      } else {
        // 3. 속도가 느릴 때 가장 가까운 지점으로 자석처럼 붙기
        const distanceToMin = Math.abs(currentY - SNAP_MIN);
        const distanceToMid = Math.abs(currentY - SNAP_MID);
        const distanceToHigh = Math.abs(currentY - SNAP_HIGH);

        const minDistance = Math.min(distanceToMin, distanceToMid, distanceToHigh);

        if (minDistance === distanceToMin) targetY = SNAP_MIN;
        else if (minDistance === distanceToMid) targetY = SNAP_MID;
        else targetY = SNAP_HIGH;
      }

      // 부드럽게 이동
      translateY.value = withTiming(targetY, {
        duration: 400,
        easing: Easing.out(Easing.exp),
      });

      if (onStateChange) {
        runOnJS(onStateChange)(targetY !== SNAP_MIN);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],

  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: SHEET_HEIGHT,
          backgroundColor: 'white',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,

        },
        animatedStyle,
      ]}
    >
      <GestureDetector gesture={gesture}>
        <View className="items-center w-full py-[14px] bg-white rounded-full">
          <View className="w-10 h-1 bg-botoomSheetBackground rounded-full" />
        </View>
      </GestureDetector>
      <Animated.View className="flex-1" pointerEvents="auto">
        {children}
      </Animated.View>
    </Animated.View>
  );
};
CustomBottomSheet.displayName = 'CustomBottomSheet';
export default CustomBottomSheet;