import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';

type AddScheduleNavigation = NativeStackNavigationProp<RootStackParamList,'AddScheduleScreen'>;

const AddScheduleScreen: React.FC = () => {
  const navigation = useNavigation<AddScheduleNavigation>();

  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <View className="flex-1 items-center justify-center">
        <Text className="text-h1 font-bold text-black">일정 추가</Text>
      </View>
    </SafeAreaView>
  );
};

AddScheduleScreen.displayName = 'AddScheduleScreen';

export default AddScheduleScreen;
export { AddScheduleScreen };