import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BottomTabNavigator from './BottomTabNavigator';


import WishlistScreen from '@/screens/WishlistScreen';

import type { RootStackParamList } from './types';
import { PrivacyPolicyScreen } from '@/screens/terms/PrivacyPolicyScreen';
import { NightMarketingScreen } from '@/screens/terms/NightMarketingScreen';
import { MarketingConsentScreen } from '@/screens/terms/MarketingConsentScreen';
// ============ Constants ============
const Stack = createNativeStackNavigator<RootStackParamList>();

// ============ Component ============
export const RootStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen name="MarketingConsentScreen" component={MarketingConsentScreen} />
      <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} />
      <Stack.Screen name="NightMarketingScreen" component={NightMarketingScreen} />
      <Stack.Screen name="WishlistScreen" component={WishlistScreen} />

    </Stack.Navigator>
  );
};
