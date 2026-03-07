import React, { useMemo } from 'react';
import { StatusBar, Text, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { APP_NAME } from '@/constants';

const App: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const statusBarStyle = useMemo(
    () => (isDarkMode ? 'light-content' : 'dark-content'),
    [isDarkMode],
  );

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={statusBarStyle} />
      <View className="flex-1 items-center justify-center">
        <Text>{APP_NAME}</Text>
      </View>
    </SafeAreaProvider>
  );
};

export default App;