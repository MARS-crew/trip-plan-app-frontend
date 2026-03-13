import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SavedScreen: React.FC = () => {
  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <View className="flex-1 items-center justify-center">
        <Text className="text-h1 font-bold text-black">저장</Text>
      </View>
    </SafeAreaView>
  );
};

SavedScreen.displayName = 'SavedScreen';

export default SavedScreen;
export { SavedScreen };