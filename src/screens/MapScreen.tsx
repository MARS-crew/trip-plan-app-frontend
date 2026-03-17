import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MapScreen: React.FC = () => {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="flex-1 items-center justify-center">
        <Text className="text-h1 font-bold text-black">내여행</Text>
      </View>
    </SafeAreaView>
  );
};

export default MapScreen;
