import React from 'react';
import { Animated, TouchableOpacity, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BackArrow from '@/assets/icons/backArrow.svg';
import BellIcon from '@/assets/icons/bell.svg';
import Time2Icon from '@/assets/icons/time2.svg';
import type { RootStackParamList } from '@/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ToggleSwitchProps {
  value: boolean;
  onPress: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ value, onPress }) => {
  const translateX = React.useRef(new Animated.Value(value ? 16 : 0)).current;

  React.useEffect(() => {
    Animated.spring(translateX, {
      toValue: value ? 16 : 0,
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
      className={`h-7 w-11 rounded-full px-0.5 ${value ? 'bg-main' : 'bg-[#D9D9D9]'}`}
      style={{ justifyContent: 'center' }}>
      <Animated.View
        className="absolute left-0.5 h-6 w-6 rounded-full bg-white"
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
      <View className="px-4 pt-2">
        <View className="flex-row items-center">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={navigation.goBack}
            className="mr-2 h-10 w-10 items-start justify-center">
            <BackArrow width={20} height={20} />
          </TouchableOpacity>
          <Text className="text-h1 font-bold text-black">알림 설정</Text>
        </View>

        <Text className="ml-1 mt-9 text-p1 font-semibold text-black">푸시 알림</Text>

        <View className="mt-3 overflow-hidden rounded-2xl border border-borderGray bg-white">
          <View className="flex-row items-center justify-between px-4 py-4">
            <View className="flex-row items-center">
              <View className="h-9 w-9 items-center justify-center rounded-xl bg-chip">
                <BellIcon width={16} height={16} />
              </View>

              <View className="ml-3">
                <Text className="text-h2 font-semibold text-black">푸시 알림</Text>
                <Text className="mt-0.5 text-p1 text-black">일정, 날씨 관련 알림</Text>
              </View>
            </View>

            <ToggleSwitch value={isPushEnabled} onPress={() => setIsPushEnabled(prev => !prev)} />
          </View>

          <View className="border-t border-borderGray">
            <View className="flex-row items-center justify-between px-4 py-4">
              <View className="flex-row items-center">
                <View className="h-9 w-9 items-center justify-center rounded-xl bg-chip">
                  <Time2Icon width={16} height={16} />
                </View>

                <View className="ml-3">
                  <Text className="text-h2 font-semibold text-black">야간 푸시 알림 동의</Text>
                  <Text className="mt-0.5 text-p1 text-black">야간 중 푸시 알림</Text>
                </View>
              </View>

              <ToggleSwitch
                value={isNightPushEnabled}
                onPress={() => setIsNightPushEnabled(prev => !prev)}
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
