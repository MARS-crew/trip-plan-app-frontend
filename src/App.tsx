import React, { useMemo } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

import { BottomTabNavigator } from '@/navigation';

const App: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const statusBarStyle = useMemo(
    () => (isDarkMode ? 'light-content' : 'dark-content'),
    [isDarkMode],
  );

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={statusBarStyle} />
      <NavigationContainer>
        <BottomTabNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;