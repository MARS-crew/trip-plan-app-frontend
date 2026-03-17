import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen: React.FC = () => {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="flex-1 items-center justify-center">
        <Text className="text-h1 font-bold text-black">홈</Text>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
