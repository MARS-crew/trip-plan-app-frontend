import React from 'react';
import { Animated, TouchableOpacity, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TopBar } from '@/components/ui';
import BellIcon from '@/assets/icons/bell.svg';
import Time2Icon from '@/assets/icons/time2.svg';
import { COLORS } from '@/constants';
import type { RootStackParamList } from '@/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ToggleSwitchProps {
  value: boolean;
  onPress: () => void;
}

const TOGGLE_TRANSLATE_X = 20;

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ value, onPress }) => {
  const translateX = React.useRef(new Animated.Value(value ? TOGGLE_TRANSLATE_X : 0)).current;

  React.useEffect(() => {
    Animated.spring(translateX, {
      toValue: value ? TOGGLE_TRANSLATE_X : 0,
      damping: 18,
      stiffness: 220,
      mass: 0.7,
      useNativeDriver: true,
    }).start();
  }, [translateX, value]);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className={`h-[24px] w-[44px] rounded-full ${value ? 'bg-main' : 'bg-subtleBorder'}`}
      style={{
        justifyContent: 'center',
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 1.5,
        elevation: 1,
      }}>
      <Animated.View
        className="absolute left-[2px] h-5 w-5 rounded-full bg-white"
        style={{ transform: [{ translateX }] }}
      />
    </TouchableOpacity>
  );
};

const NotificationSettingsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [isPushEnabled, setIsPushEnabled] = React.useState<boolean>(true);
  const [isNightPushEnabled, setIsNightPushEnabled] = React.useState<boolean>(false);

  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <TopBar title="알림 설정" onPress={navigation.goBack} />
      <View className="px-4">
        <Text className="ml-1.5 mt-4 font-pretendardSemiBold text-xs text-black">
          푸시 알림
        </Text>

        <View className="mt-3 overflow-hidden rounded-lg border border-borderGray bg-white">
          <View className="flex-row items-center justify-between px-4 py-4">
            <View className="flex-row items-center">
              <View className="h-9 w-9 items-center justify-center rounded-lg bg-chip">
                <BellIcon width={16} height={16} />
              </View>

              <View className="ml-3">
                <Text className="font-pretendardMedium text-sm leading-[17px] text-black">
                  푸시 알림
                </Text>
                <Text className="mt-[2px] text-p leading-[16px] text-black">
                  일정, 날씨 관련 알림
                </Text>
              </View>
            </View>

            <ToggleSwitch value={isPushEnabled} onPress={() => setIsPushEnabled((prev) => !prev)} />
          </View>

          <View className="border-t border-borderGray">
            <View className="flex-row items-center justify-between px-4 py-4">
              <View className="flex-row items-center">
                <View className="h-9 w-9 items-center justify-center rounded-lg bg-chip">
                  <Time2Icon width={16} height={16} />
                </View>

                <View className="ml-3">
                  <Text className="font-pretendardMedium text-sm leading-[17px] text-black">
                    야간 푸시 알림 동의
                  </Text>
                  <Text className="mt-[2px] text-p leading-[16px] text-black">
                    야간 중 푸시 알림
                  </Text>
                </View>
              </View>

              <ToggleSwitch
                value={isNightPushEnabled}
                onPress={() => setIsNightPushEnabled((prev) => !prev)}
              />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

NotificationSettingsScreen.displayName = 'NotificationSettingsScreen';

export default NotificationSettingsScreen;
export { NotificationSettingsScreen };
