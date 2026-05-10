import React, { useEffect, useMemo } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootStackNavigator } from '@/navigation';
import Config from 'react-native-config';
import NaverLogin from '@react-native-seoul/naver-login';
import { useAuthStore } from '@/store';

const App: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    NaverLogin.initialize({
      appName: 'Trip_Plan',
      consumerKey: Config.NAVER_CLIENT_ID,
      consumerSecret: Config.NAVER_CLIENT_SECRET,
    });
    void useAuthStore.getState().hydrateAuth();
  }, []);

  const statusBarStyle = useMemo(
    () => (isDarkMode ? 'light-content' : 'dark-content'),
    [isDarkMode],
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar barStyle={statusBarStyle} />
        <NavigationContainer>
          <RootStackNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
