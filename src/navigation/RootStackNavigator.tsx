import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BottomTabNavigator from './BottomTabNavigator';
import { FindIdScreen, LoginScreen, WishlistScreen } from '@/screens';

import type { RootStackParamList } from './types';
import { FindPasswordScreen } from '@/screens';
import { PrivacyPolicyScreen } from '@/screens/terms/PrivacyPolicyScreen';
import { NightMarketingScreen } from '@/screens/terms/NightMarketingScreen';
import { MarketingConsentScreen } from '@/screens/terms/MarketingConsentScreen';
import { AddTripScreen } from '@/screens/addTrip/AddTripScreen';
import { AddTripCalendarScreen } from '@/screens/addTrip/AddTripCalendarScreen';
import { AddCalendarMapScreen } from '@/screens/AddCalendarMapScreen';

import EmptyMapScreen from '@/screens/myTrip/EmptyMapScreen';

// ============ Constants ============
const Stack = createNativeStackNavigator<RootStackParamList>();

// ============ Component ============
export const RootStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen name="MarketingConsentScreen" component={MarketingConsentScreen} />
      <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} />
      <Stack.Screen name="NightMarketingScreen" component={NightMarketingScreen} />
      <Stack.Screen name="EmptyMapScreen" component={EmptyMapScreen} />
      <Stack.Screen name="FindId" component={FindIdScreen} />
      <Stack.Screen name="WishlistScreen" component={WishlistScreen} />
      <Stack.Screen name="FindPassword" component={FindPasswordScreen} />
      <Stack.Screen name="AddTripScreen" component={AddTripScreen} />
      <Stack.Screen name="AddTripCalendar" component={AddTripCalendarScreen} />
      <Stack.Screen name="AddCalendarMapScreen" component={AddCalendarMapScreen} />
    </Stack.Navigator>
  );
};
