import React, { useEffect, useMemo, useState } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootStackNavigator, navigationRef } from '@/navigation';
import { LoadingView } from '@/components/ui/LoadingView';
import { linking } from '@/navigation/linking';
import Config from 'react-native-config';
import NaverLogin from '@react-native-seoul/naver-login';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useAuthStore } from '@/store';
import {
  setupPushNotifications,
  listenForFcmTokenRefresh,
  listenForForegroundMessages,
} from '@/services/pushService';

const App: React.FC = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    setupPushNotifications().catch((e) => {
    });
    const unsubscribeTokenRefresh = listenForFcmTokenRefresh();
    const unsubscribeForegroundMessages = listenForForegroundMessages();

    return () => {
      unsubscribeTokenRefresh();
      unsubscribeForegroundMessages();
    };
  }, [isAuthenticated]);

  useEffect(() => {
    try {
      NaverLogin.initialize({
        appName: 'Trip_Plan',
        consumerKey: Config.NAVER_CLIENT_ID,
        consumerSecret: Config.NAVER_CLIENT_SECRET,
      });
    } catch (e) {
      console.warn('NaverLogin initialize failed:', e);
    }

    try {
      GoogleSignin.configure({
        webClientId: Config.GOOGLE_WEB_CLIENT_ID,
      });
    } catch (e) {
      console.warn('GoogleSignin configure failed:', e);
    }

    void useAuthStore
      .getState()
      .hydrateAuth()
      .finally(() => setIsHydrated(true));
  }, []);

  if (!isHydrated) {
    return <LoadingView />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
        <NavigationContainer ref={navigationRef} linking={linking}>
          <RootStackNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
